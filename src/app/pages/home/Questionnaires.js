/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { createRef } from "react";
import { Table } from "react-bootstrap";
import { connect } from "react-redux";
import {
    Portlet,
    PortletBody
} from "../../partials/content/Portlet";
import { Formik } from "formik";
import clsx from "clsx";
import {
    Button,
    Dropdown,
    Modal,
    OverlayTrigger,
    Tooltip,
    Form,
    Col
} from "react-bootstrap";
import { getQuestionnairesList, addQuestionnaires, editQuestionnaires, deleteQuestionnaires } from "../../crud/auth.crud";
import { TitleComponent } from "../FormComponents/TitleComponent";
import Pagination from 'react-js-pagination';
import { InsertDriveFile, MoreHoriz, Edit, Close, BrandingWatermark } from '@material-ui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { paginationTexts } from '../../../_metronic/utils/utils';
import { CircularProgress } from "@material-ui/core";

var pwdValid = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
var space = /\s/;

class Questionnaires extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            questionnairesData: [],
            questionnairesCount: 0,
            startDate: null,
            endDate: null,
            showAlert: false,
            loading: false,
            searchValue: "",
            limit: 25,
            status: "",
            sortBy: 'createdAt',
            sortOrder: 'DESC',
            activePage: 1,
            isFocus: false,
            show: false,
            modalType: "",
            currentQuestionnaires: null,
            validated: false,
            disabledBtn: false,
            activeTab: 0,
            questionnairesArr: { "question": "", "options": [{ name: "" }] },
            errorQuestion: "",
            question: "",
            errorOptions: "",
            isCompany: false
        };
        this.inputRef = createRef();

    }


    componentDidMount = async () => {
        this.getQuestionnairesList();
    }

    getQuestionnairesList = async (searchData) => {
        this.setState({ loading: true });
        const { authToken } = this.props;

        var limitV = this.state.limit;
        var sortByV = this.state.sortBy;
        var sortOrderV = this.state.sortOrder;
        var activePage = this.state.activePage;
        var status = (this.state.status === 0 || this.state.status === 1) ? this.state.status : null;
        var search = (this.state.searchValue !== undefined) ? this.state.searchValue : null; //searchData !== undefined ? searchData : null;
        await getQuestionnairesList(authToken, search, limitV, sortByV,
            sortOrderV, activePage, status).then(result => {
                this.setState({
                    loading: false,
                    questionnairesData: result.data.payload ? result.data.payload.data.rows : [],
                    questionnairesCount: result.data.payload && result.data.payload.data.count,
                });

            }).catch(err => {
                this.setState({
                    loading: false,
                    questionnairesData: [],
                    questionnairesCount: 0
                });
                if (err.response && (err.response.data.message === "jwt expired")) {
                    window.location.href = "/admin/logout";
                }
            });
    }

    clear = () => {
        this.setState({ searchValue: "" });
        setTimeout(() => {
            this.getQuestionnairesList();
        }, 500);
    };

    handleSearchChange = event => {
        this.setState({ searchValue: event.target.value });
        if (event.target.value.length === 0) {
            this.getQuestionnairesList();
        }
    };

    handleStatus = (value) => {
        this.setState({ status: value });
        setTimeout(() => {
            this.getQuestionnairesList();
        }, 500);
    }

    handleSorting = (sortBy, sortOrder) => {
        this.setState({
            sortBy: sortBy,
            sortOrder: sortOrder,
        });
        setTimeout(() => {
            this.getQuestionnairesList();
        }, 500);
    }

    handleSelect = (number) => {
        this.setState({ activePage: number });
        setTimeout(() => {
            this.getQuestionnairesList();
        }, 500);
    }

    handleModal = (value, currentQuestionnaires) => {
        this.setState({ modalType: value, show: true, currentQuestionnaires });
    }

    handleClose = () => {
        this.setState({ show: false, disabledBtn: false });
        this.setState({ questionnairesArr: { "question": "", "options": [{ name: "" }] }, });
    }

    changeFocus = () => {
        this.setState({ isFocus: true });
    }

    handleShow = (e) => {
        this.setState({
            show: true,
        });
    }

    handleSwitchChange = async (value, item) => {
        const { authToken } = this.props;
        const { currentQuestionnaires } = this.state;
        var data = {
            id: currentQuestionnaires.id,
            status: !currentQuestionnaires.status,
            type: "updateStatus"
        }
        await editQuestionnaires(authToken, data).then(result => {
            toast.success(result.data.message, {
                className: "green-css"
            });
            this.handleClose();
        }).catch(err => {
            var msg = err.response ? err.response.data.message : err.message;
            toast.error(msg, {
                className: "red-css"
            });
        });
        setTimeout(() => {
            this.getQuestionnairesList();
        }, 500);
    }

    handleChanges = (e, isEdit) => {
        if (isEdit) {
            var dup = this.state.currentQuestionnaires;
            dup.question = e.target.value
            this.setState({
                currentQuestionnaires: dup,
                errorQuestion: "",
                errorOptions: ""
            });
        } else {
            var d = { ...this.state.questionnairesArr };
            d.question = e.target.value;
            this.setState({
                questionnairesArr: d, errorQuestion: "",
                errorOptions: ""
            });

        }
    }

    handleSubmit = () => {
        this.setState({ activePage: 1 });
        setTimeout(() => {
            this.getQuestionnairesList();
        }, 500);
    }

    handleReset = () => {
        window.location.reload();
    }

    handleArrChange = (e, key, index, isEdit) => {
        if (isEdit) {
            var d = this.state.currentQuestionnaires;
            var dup = d.options;
            dup[index].name = e.target.value;
            d.options = dup;
            this.setState({ currentQuestionnaires: d, errorQuestion: "" });
        } else {
            var dup = { ...this.state.questionnairesArr };

            dup.options[index].name = e.target.value;
            this.setState({ [key]: dup, errorQuestion: "" });
        }
    }

    editQuestionnaires = async () => {
        const { currentQuestionnaires, question, errorQuestion, errorOptions, } = this.state;
        var values = currentQuestionnaires;

        var isEmpty = values.options?.filter((item) => item.name == "");

        if (isEmpty.length > 0) {
            this.setState({
                errorQuestion: "Please provide proper data, field should not be empty"
            });
        } else if (currentQuestionnaires.question.length <= 0) {
            this.setState({
                errorOptions: "Please provide question name, field should not be empty"
            });
        } else {
            const { authToken } = this.props;

            var postdata = this.state.currentQuestionnaires;

            await editQuestionnaires(authToken, postdata).then(result => {
                this.handleClose();
                toast.success(result.data.message, {
                    className: "green-css"
                });
            }).catch(errors => {
                this.handleClose();
                var msg = errors.response ? errors.response.data.message : errors.message;
                toast.error(msg, {
                    className: "red-css"
                });
            });
            setTimeout(() => {
                this.getQuestionnairesList();
            }, 500);
        }
    }

    addQuestionnaires = async () => {
        const { questionnairesArr, question, errorQuestion, errorOptions, } = this.state;

        var values = questionnairesArr;

        var isEmpty = values.options?.filter((item) => item.name == "");

        if (isEmpty.length > 0) {
            this.setState({
                errorQuestion: "Please provide proper data, field should not be empty"
            });
        } else if (questionnairesArr.question.length <= 0) {
            this.setState({
                errorOptions: "Please provide question name, field should not be empty"
            });
        } else {
            const { authToken } = this.props;
            var arr = values.options?.filter((item) => item.name.trim() != "");
            var postdata = {
                question: questionnairesArr.question,
                options: arr,
            };
            await addQuestionnaires(authToken, postdata).then(result => {
                this.handleClose();
                toast.success(result.data.message, {
                    className: "green-css"
                });
            }).catch(errors => {
                this.handleClose();
                var msg = errors.response ? errors.response.data.message : errors.message;
                toast.error(msg, {
                    className: "red-css"
                });
            });
            setTimeout(() => {
                this.getQuestionnairesList();
            }, 500);
        }

    }

    handleDelete = async (event) => {
        this.setState({ disabledBtn: true });
        const { authToken } = this.props;
        var data = {
            id: this.state.currentQuestionnaires.id
        }
        await deleteQuestionnaires(authToken, data).then(result => {
            this.handleClose();
            toast.success(result.data.message, {
                className: "green-css"
            });
        }).catch(err => {
            this.handleClose();
            var msg = err.response ? err.response.data.message : err.message;
            toast.error(msg, {
                className: "red-css"
            });
        });
        setTimeout(() => {
            this.getQuestionnairesList();
        }, 500);

    }

    handleActiveTab = (value) => {
        this.setState({
            activeTab: value
        })
    }

    addConfig = (orgArray, key, isEdit) => {
        if (isEdit) {
             var values = this.state.currentQuestionnaires && this.state.currentQuestionnaires.options;

            var isEmpty = values?.filter((item) => item.name == "");
            if (isEmpty && isEmpty.length > 0) {
                this.setState({
                    [key]: "Please provide proper data, field should not be empty"
                });
            } else {
                var arr = []
                arr.push({ name: "" });
                var d = this.state.currentQuestionnaires;
                d.options = d.options.concat(arr);
                this.setState({ currentQuestionnaires: d, [key]: "" });
            }
        } else {
            var values = this.state[orgArray];

            var isEmpty = values?.options?.filter((item) => item.name == "");
            if (isEmpty && isEmpty.length > 0) {
                this.setState({
                    [key]: "Please provide proper data, field should not be empty"
                });
            } else {
                var arr = []
                arr.push({ name: "" });
                let tempObj = { ...this.state.questionnairesArr }
                tempObj.options.push({ "name": "" })
                this.setState({ questionnairesArr: tempObj, [key]: "" });

            }
        }
    }

    removeConfig = (orgArray, value, index, errorKey, isEdit) => {
        if (isEdit) {
            var array = this.state.currentQuestionnaires;
            if (array.options && array.options?.length <= 1) {
                this.setState({
                    errorQuestion: "Please enter atleast one option"
                });
            } else {
                var arr1 = array.options?.filter((item, ind) => {
                    if (item.name === value && ind == index) { } else {
                        return item
                    }
                });
                var d = this.state.currentQuestionnaires;
                d.options = arr1;
                this.setState({ currentQuestionnaires: d, [errorKey]: "" });
            }
        } else {
            var array = this.state[orgArray];

            if (array.options && array.options?.length <= 1) {
                this.setState({
                    errorQuestion: "Please enter atleast one option"
                });
            } else {

                var arr1 = array.options?.filter((item, ind) => {
                    if (item === value && ind == index) { } else {
                        return item
                    }
                });
                var d = this.state.questionnairesArr;
                d.options = arr1;
                this.setState({ questionnairesArr: d, [errorKey]: "" });
            }
        }
    }

    renderModalBody = () => {
        const { isFocus, modalType, currentQuestionnaires, disabledBtn, errorQuestion, questionnairesArr,
            errorOptions, question, } = this.state;
        if (modalType === "Add") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }}>{modalType} Questionnaires</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Modal.Body className="pt-0">
                        <div className='fv-row mb-4'>
                            <label className='form-label mb-0 fw-600 text-dark'>Enter Question</label>
                            <input
                                required
                                placeholder='Enter question'
                                className={"form-control"}
                                type='text'
                                name='question'
                                autoComplete='off'
                                onFocus={() => this.changeFocus()}
                                onChange={(e) => this.handleChanges(e)}
                                values={question}
                            />
                            {Boolean(errorOptions) && (
                                <div className='fv-plugins-message-container'>
                                    <span role='alert'>{errorOptions}</span>
                                </div>
                            )}
                        </div>
                        <div className='fv-row mb-4'>
                            <div className="form-group">
                                <label className="form-label mb-0 fw-600 text-dark">Enter Options </label>
                                <div className="h-220px overflow-auto">
                                    {questionnairesArr?.options?.length > 0 &&
                                        questionnairesArr?.options.map((item, index) =>
                                            <div className="position-relative mt-3" key={index}>
                                                <input type="text" placeholder="Enter Options " className="form-control"
                                                    value={item.name} onChange={(e) => this.handleArrChange(e, "questionnairesArr", index)} />
                                                <Close className="close-icon" onClick={() =>
                                                    this.removeConfig("questionnairesArr", item, index, "errorQuestion")} />
                                            </div>
                                        )}
                                    {Boolean(errorQuestion) && (
                                        <div className='fv-plugins-message-container'>
                                            <span role='alert'>{errorQuestion}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <button className="btn btn-primary mt-5" onClick={() =>
                                    this.addConfig("questionnairesArr", "errorQuestion")}>
                                    <i className="fa fa-plus"></i> add new options</button>
                            </div>
                            <div className="margin-top-10">
                                <button
                                    className="btn btn-success" onClick={() =>
                                        this.addQuestionnaires()}>Save Changes </button>
                            </div>
                        </div>
                    </Modal.Body>
                </div>
            );
        } else if (modalType === "Edit") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }}>{modalType} Questionnaires</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Modal.Body className="pt-0">
                        <div className='fv-row mb-4'>
                            <label className='form-label mb-0 fw-600 text-dark'>Enter Question</label>
                            <input
                                placeholder='Enter question'
                                className={"form-control"}
                                type='text'
                                name='question'
                                onFocus={() => this.changeFocus()}
                                autoComplete='off'
                                onChange={(e) => this.handleChanges(e, true)}
                                value={currentQuestionnaires.question}
                            />
                            {Boolean(errorOptions) && (
                                <div className='fv-plugins-message-container'>
                                    <span role='alert'>{errorOptions}</span>
                                </div>
                            )}
                        </div>

                        <div className='fv-row mb-4'>
                            <div className="form-group">
                                <label className="form-label mb-0 fw-600 text-dark">Enter Options </label>
                                <div className="h-220px overflow-auto">
                                    {currentQuestionnaires?.options?.length > 0 &&
                                        currentQuestionnaires?.options?.map((item, index) =>
                                            <div className="position-relative mt-3" key={index}>
                                                <input type="text" placeholder="Enter options " className="form-control"
                                                    value={item.name} onChange={(e) => this.handleArrChange(e, "currentQuestionnaires", index, true)} />
                                                <Close className="close-icon" onClick={() =>
                                                    this.removeConfig("currentQuestionnaires", item.name, index, "errorQuestion", true)} />
                                            </div>
                                        )}
                                    {Boolean(errorQuestion) && (
                                        <div className='fv-plugins-message-container'>
                                            <span role='alert'>{errorQuestion}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <button className="btn btn-primary mt-5" onClick={() =>
                                    this.addConfig("currentQuestionnaires", "errorQuestion", true)}>
                                    <i className="fa fa-plus"></i> add new options</button>
                            </div>
                            <div className="margin-top-10">
                                <button
                                    className="btn btn-success" onClick={() =>
                                        this.editQuestionnaires()}>Save Changes </button>
                            </div>
                        </div>
                    </Modal.Body>
                </div>
            );
        } else if (modalType === "Delete") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }} className="text-dark">Delete Questionnaires</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Form noValidate>
                        <Modal.Body>
                            <Form.Group as={Col} md="12" className={"text-center"}>
                                <Form.Label style={{ fontWeight: 400 }} className="text-muted">Are you sure you want to delete
                                    this Questionnaires with <b className="text-dark">{currentQuestionnaires && currentQuestionnaires.question}</b> ?
                                </Form.Label>
                            </Form.Group>
                        </Modal.Body>
                        <hr className="line-style" />
                        <Modal.Footer>
                            <Button className="ml-auto mr-3 w-auto" variant="danger" disabled={disabledBtn}
                                onClick={(e) => this.handleDelete(e)}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Form>
                </div>
            );
        } else if (modalType === "ActiveStatus") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }} className="text-dark">Change Questionnaires Status</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Form noValidate>
                        <Modal.Body>
                            <Form.Group as={Col} md="12" className={"text-center"}>
                                <Form.Label style={{ fontWeight: 400 }} className="text-muted">Are you sure you want to {currentQuestionnaires.status === 0 ? <b>Activate </b> : <b>Deactivate </b>}
                                    this Questionnaires with <b>{currentQuestionnaires && currentQuestionnaires.question}</b> ?
                                </Form.Label>
                            </Form.Group>
                        </Modal.Body>
                        <hr className="line-style" />
                        <Modal.Footer>
                            {currentQuestionnaires.status === 0 ?
                                <Button className="ml-auto mr-3 w-auto" variant="success" disabled={disabledBtn}
                                    onClick={(e) => this.handleSwitchChange(e)}>
                                    Activate
                                </Button>
                                :
                                <Button className="ml-auto mr-3 w-auto" variant="danger" disabled={disabledBtn}
                                    onClick={(e) => this.handleSwitchChange(e)}>
                                    Deactivate
                                </Button>
                            }
                        </Modal.Footer>
                    </Form>
                </div>
            );
        }
    }

    render() {
        const { questionnairesData, questionnairesCount, activePage, limit, searchValue, loading, isFocus } = this.state;
        const customStyle = isFocus ? styleSearch
            : { borderWidth: 2 };

        return (
            <div>
                <TitleComponent title={this.props.title} icon={this.props.icon} />
                <div className="row">
                    <div className="col-md-12">
                        <div className="kt-section bg-white px-4 py-2 border-top">
                            <form className="kt-quick-search__form" onSubmit={(e) => { e.preventDefault() }}>
                                <div className="row">
                                    <div className="input-group align-self-center col-9 col-md-3 mb-0">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" style={{ borderWidth: 2 }}>
                                                <i className="flaticon2-search-1" />
                                            </span>
                                        </div>

                                        <input
                                            type="text"
                                            ref={this.inputRef}
                                            placeholder="Search..."
                                            value={searchValue}
                                            onFocus={() => this.changeFocus()}
                                            style={customStyle}
                                            onChange={this.handleSearchChange}
                                            className="form-control kt-quick-search__input h-auto"
                                        />
                                        {(searchValue) && (
                                            <div className="input-group-append" onClick={this.clear}>
                                                <span className="input-group-text" style={{ borderWidth: 2 }}>
                                                    <i className="la la-close kt-quick-search__close"
                                                        style={{ display: "flex" }} />
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mr-md-3">
                                        <Button type="button" className='btn btn-primary btn-elevate kt-login__btn-primary'
                                            onClick={this.handleSubmit}>
                                            Search
                                        </Button>
                                    </div>
                                    <div className="mr-3 ml-3 ml-md-0">
                                        <Button type="button" className='btn btn-info btn-elevate kt-login__btn-info'
                                            onClick={this.handleReset}>
                                            Reset</Button>
                                    </div>
                                    <Dropdown drop="down">
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Status</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => this.handleStatus(1)}>Active</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(0)}>Inactive</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(2)}>All</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <div className="mr-2 ml-auto">
                                        <Button
                                            className='btn btn-primary btn-elevate kt-login__btn-warning'
                                            onClick={(e) => this.handleModal("Add")}
                                        >
                                            Add Questionnaires
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <ToastContainer />
                <Portlet className={'shadow-none'}>
                    <PortletBody>
                        {loading ? <div className="text-center py-3" ><CircularProgress />
                        </div> : <Table striped responsive bordered hover className="table-list-header m-0">
                            <thead>
                                <tr>
                                    <th>
                                        <span className="pl-md-5"><b>Questions</b></span>
                                        <i className='flaticon2-up ml-2 ctriggerclick arrow-icons' style={{ fontSize: 10 }} onClick={() => this.handleSorting('question', 'ASC')} />
                                        <i className='flaticon2-down ctriggerclick arrow-icons' style={{ fontSize: 10 }} onClick={() => this.handleSorting('question', 'DESC')} />
                                    </th>
                                    <th className="text-center"><b>Options </b></th>
                                    <th width="20%" className="text-center"><b>Status</b></th>
                                    <th width="15%" className="text-center"><b>Action</b></th>
                                </tr>
                            </thead>

                            <tbody>
                                {questionnairesData.length > 0 ?
                                    questionnairesData.map((item, index) =>
                                        <tr key={item.id}>
                                            <td>
                                                <h6 className={'font-weight-bold text-muted pl-md-5'}>{item.question}</h6>
                                            </td>
                                            <td>
                                                <h6 className={'font-weight-bold text-muted pl-md-5'}>
                                                    {item.options.length > 0
                                                        ? item.options.map((it, indx) => {
                                                            return (
                                                                <span key={indx}>
                                                                    {item.options.length - 1 == indx
                                                                        ? it.name
                                                                        : it.name + ", "}
                                                                </span>
                                                            );
                                                        })
                                                        : "-"}
                                                </h6>
                                            </td>
                                            <td className="text-center">
                                                <h6 className={'font-weight-bold Status_activation'}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.handleModal("ActiveStatus", item)
                                                    }}
                                                >
                                                    {item.status === 1 ? <span className={'text-success border-bottom border-success'}>Active</span> : <span className={'text-danger border-bottom border-danger'}>Deactive</span>}
                                                </h6>
                                            </td>
                                            <td className="text-center">
                                                <OverlayTrigger
                                                    placement="left"
                                                    overlay={<Tooltip id="documentations-tooltip">Edit</Tooltip>}>
                                                    <a className="kt-menu__link-icon flaticon2-edit pr-4 text-warning"
                                                        style={{ fontSize: '1.3rem' }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.handleModal("Edit", item);
                                                        }}></a>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    placement="left"
                                                    overlay={<Tooltip id="documentations-tooltip">Delete</Tooltip>}>
                                                    <a className="kt-menu__link-icon flaticon2-rubbish-bin-delete-button text-danger"
                                                        style={{ fontSize: '1.3rem' }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.handleModal("Delete", item)
                                                        }}></a>
                                                </OverlayTrigger>
                                            </td>
                                        </tr>
                                    )
                                    :
                                    <tr>
                                        <td colSpan="12" className="text-center">
                                            <div className="col-md-6 col-lg-4 mx-auto text-center mt-5">
                                                <div className="card card-custom text-center py-5 border-doted-dark bg-transparent">
                                                    <div className="card-body">
                                                        <span className="bg-light-danger p-3 text-dark rounded">
                                                            <BrandingWatermark />
                                                        </span>
                                                        <h3 className="text-dark mb-0 mt-4">No Questionnaires have been Found</h3>
                                                        <span className="mt-2">Simply click above button to add questionnaires options</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </Table>}
                    </PortletBody>
                </Portlet>

                {(questionnairesCount > limit) &&
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center px-4 cus-pagination">
                        <h5 className="text-dark mb-3 mb-md-0">{paginationTexts(activePage, questionnairesCount, limit)}</h5>
                        <Pagination
                            bsSize={'medium'}
                            activePage={activePage}
                            itemsCountPerPage={limit}
                            totalItemsCount={questionnairesCount}
                            pageRangeDisplayed={5}
                            onChange={this.handleSelect}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                    </div>}
                <Modal centered size="md" show={this.state.show} onHide={() => {
                    this.handleClose();
                }} style={{ opacity: 1 }}>
                    {this.renderModalBody()}
                </Modal>
            </div>
        );
    }
}

const styleSearch = {
    borderColor: "#E3E3E3", borderWidth: 2, borderLeftWidth: 0, borderRightWidth: 0
}

const mapStateToProps = ({ auth: { authToken } }) => ({
    authToken
});

export default connect(mapStateToProps)(Questionnaires);