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
import { getCategoryList, addCategory, editCategory, deleteCategory } from "../../crud/auth.crud";
import { TitleComponent } from "../FormComponents/TitleComponent";
import Pagination from 'react-js-pagination';
import { BrandingWatermark } from '@material-ui/icons';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { paginationTexts } from '../../../_metronic/utils/utils';
import { CircularProgress } from "@material-ui/core";

var pwdValid = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
var space = /\s/;

class Category extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryData: [],
            categoryCount: 0,
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
            currentCategory: null,
            validated: false,
            disabledBtn: false,
            activeTab: 0,
        };
        this.inputRef = createRef();

    }


    componentDidMount = async () => {
        this.getCategoryList();
    }

    getCategoryList = async (searchData) => {
        this.setState({ loading: true });
        const { authToken } = this.props;

        var limitV = this.state.limit;
        var sortByV = this.state.sortBy;
        var sortOrderV = this.state.sortOrder;
        var activePage = this.state.activePage;
        var status = (this.state.status === 0 || this.state.status === 1) ? this.state.status : null;
        var search = (this.state.searchValue !== undefined) ? this.state.searchValue : null; //searchData !== undefined ? searchData : null;
        await getCategoryList(authToken, search, limitV, sortByV,
            sortOrderV, activePage, status).then(result => {
                this.setState({
                    loading: false,
                    categoryData: result.data.payload ? result.data.payload.data.rows : [],
                    categoryCount: result.data.payload && result.data.payload.data.count
                });

            }).catch(err => {
                this.setState({
                    loading: false,
                    categoryData: [],
                    categoryCount: 0
                });
                if (err.response && (err.response.data.message === "jwt expired")) {
                    window.location.href = "/admin/logout";
                }
            });
    }

    clear = () => {
        this.setState({ searchValue: "" });
        setTimeout(() => {
            this.getCategoryList();
        }, 500);
    };

    handleSearchChange = event => {
        this.setState({ searchValue: event.target.value });
        if (event.target.value.length > 0) {
            this.getCategoryList(event.target.value);

        }
        if (event.target.value.length === 0) {
            this.getCategoryList();
        }
    };

    handleStatus = (value) => {
        this.setState({ status: value });
        setTimeout(() => {
            this.getCategoryList();
        }, 500);
    }

    handleSorting = (sortBy, sortOrder) => {
        this.setState({
            sortBy: sortBy,
            sortOrder: sortOrder,
        });
        setTimeout(() => {
            this.getCategoryList();
        }, 500);
    }

    handleSelect = (number) => {
        this.setState({ activePage: number });
        setTimeout(() => {
            this.getCategoryList();
        }, 500);
    }

    handleModal = (value, currentCategory) => {
        this.setState({ modalType: value, show: true, currentCategory });
    }

    handleClose = () => {
        this.setState({ show: false, disabledBtn: false });
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
        const { currentCategory } = this.state;
        var data = {
            id: currentCategory.id,
            title: currentCategory.title,
            status: !currentCategory.status,
            type: "updateStatus"
        }
        await editCategory(authToken, data).then(result => {
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
            this.getCategoryList();
        }, 500);
    }

    handleChange = (key, value) => {
        this.setState({ [key]: value });
    }

    handleSubmit = () => {
        this.setState({ activePage: 1 });
        setTimeout(() => {
            this.getCategoryList();
        }, 500);
    }

    handleReset = () => {
        window.location.reload();
    }

    handleEditCategorySubmit = async (values, setSubmitting, key) => {
        const { authToken } = this.props;
        var data = {
            id: this.state.currentCategory.id,
        }
        data = {
            ...data, title: values.title.trim(), description: values.description.trim()
        }

        await editCategory(authToken, data).then(result => {
            setSubmitting(false);
            this.handleClose();
            toast.success(result.data.message, {
                className: "green-css"
            });
        }).catch(err => {
            setSubmitting(false);
            this.handleClose();
            var msg = err.response ? err.response.data.message : err.message;
            toast.error(msg, {
                className: "red-css"
            });
        });
        setTimeout(() => {
            this.getCategoryList();
        }, 500);
    }

    handleAddCategorySubmit = async (values, setSubmitting) => {
        const { authToken } = this.props;
        var data = {
            title: values.title.trim(),
            description: values.description ? values.description.trim() : null
        }
        await addCategory(authToken, data).then(result => {
            setSubmitting(false);
            this.handleClose();
            toast.success(result.data.message, {
                className: "green-css"
            });
        }).catch(err => {
            setSubmitting(false);
            this.handleClose();
            var msg = err.response ? err.response.data.message : err.message;
            toast.error(msg, {
                className: "red-css"
            });
        });
        setTimeout(() => {
            this.getCategoryList();
        }, 500);
    }

    handleDelete = async (event) => {
        this.setState({ disabledBtn: true });
        const { authToken } = this.props;
        var data = {
            id: this.state.currentCategory.id
        }
        await deleteCategory(authToken, data).then(result => {
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
            this.getCategoryList();
        }, 500);

    }

    handleActiveTab = (value) => {
        this.setState({
            activeTab: value
        })
    }

    renderModalBody = () => {
        const { isFocus, modalType, currentCategory, disabledBtn, activeTab, status } = this.state;
        const customStyle = isFocus ? { borderRadius: 0, borderWidth: 2, backgroundColor: 'transparent', borderColor: "#E3E3E3", color: "black" }
            : { borderRadius: 0, borderWidth: 2, backgroundColor: 'transparent', color: 'black' };

        const isEdit = modalType === "Edit" ? true : false;
        if (modalType === "Add" || modalType === "Edit") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }}>{modalType} Category</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Formik
                        enableReinitialize
                        validateOnChange={false}
                        validateOnBlur={false}
                        validate={values => {
                            const errors = {};

                            if (values.title.trim().length <= 0) {
                                errors.title = "Please provide valid category name"
                            }

                            return errors;
                        }}
                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            if (isEdit) {
                                this.handleEditCategorySubmit(values, setSubmitting);
                            } else {
                                this.handleAddCategorySubmit(values, setSubmitting);
                            }
                        }}

                        initialValues={{
                            title: isEdit ? currentCategory && currentCategory.title : '',
                            description: isEdit ? currentCategory && currentCategory.description : '',
                        }}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            values,
                            touched,
                            errors,
                            isSubmitting
                        }) => (
                            <Form noValidate={true}
                                onSubmit={handleSubmit}
                            >
                                <Modal.Body className="pt-0">
                                    <div className='fv-row mb-4'>
                                        <label className='form-label mb-0 fw-600 text-dark'>Category Name</label>
                                        <input
                                            required
                                            placeholder='Category Name'
                                            className={clsx(
                                                'form-control form-control-solid',
                                                { 'is-invalid': touched.title && errors.title },
                                                {
                                                    'is-valid': touched.title && !errors.title,
                                                }
                                            )}
                                            type='text'
                                            name='title'
                                            autoComplete='off'
                                            onFocus={() => this.changeFocus()}
                                            onChange={handleChange}
                                            value={values.title}
                                        />
                                        {touched.title && errors.title && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.title}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='fv-row mb-4'>
                                        <label className='form-label mb-0 fw-600 text-dark'>Description</label>
                                        <textarea
                                            rows={3}
                                            placeholder='Description'
                                            className={clsx(
                                                'form-control form-control-solid rounded pl-4',
                                            )}
                                            type='text'
                                            name='description'
                                            autoComplete='off'
                                            onFocus={() => this.changeFocus()}
                                            onChange={handleChange}
                                            value={values.description}
                                        />
                                    </div>
                                </Modal.Body>
                                <hr className="line-style" />
                                <Modal.Footer>
                                    <Button type="submit" className="ml-auto mr-3" variant="primary" disabled={isSubmitting}>
                                        {isEdit ? "Update" : "Add"}
                                    </Button>
                                </Modal.Footer>
                            </Form>)}
                    </Formik>
                </div>
            );
        } else if (modalType === "Delete") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }} className="text-dark">Delete Category</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Form noValidate>
                        <Modal.Body>
                            <Form.Group as={Col} md="12" className={"text-center"}>
                                <Form.Label style={{ fontWeight: 400 }} className="text-muted">
                                    Are you sure you want to delete
                                    this Category with <b className="text-dark">{currentCategory && currentCategory.title}</b> ?</Form.Label>
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
                        <Modal.Title style={{ fontWeight: 700 }} className="text-dark">Change Category Status</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Form noValidate>
                        <Modal.Body>
                            <Form.Group as={Col} md="12" className={"text-center"}>
                                <Form.Label style={{ fontWeight: 400 }} className="text-muted">
                                    Are you sure you want to {currentCategory.status === 0 ? <b>Activate </b> : <b>Deactivate </b>}
                                    this Category with <b>{currentCategory && currentCategory.title}</b> ?</Form.Label>
                            </Form.Group>
                        </Modal.Body>
                        <hr className="line-style" />
                        <Modal.Footer>
                            {currentCategory.status === 0 ?
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
        const { categoryData, categoryCount, activePage, limit, searchValue, loading, isFocus, startDate, endDate } = this.state;
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
                                            Add Category
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
                        </div> :
                            <Table striped responsive bordered hover className="table-list-header m-0">
                                <thead>
                                    <tr>
                                        <th>
                                            <span className="pl-md-5"><b>Title</b></span>
                                            <i className='flaticon2-up ml-2 ctriggerclick arrow-icons'
                                                style={{ fontSize: 10 }} onClick={() => this.handleSorting('title', 'ASC')} />
                                            <i className='flaticon2-down ctriggerclick arrow-icons'
                                                style={{ fontSize: 10 }} onClick={() => this.handleSorting('title', 'DESC')} />
                                        </th>
                                        <th>
                                            <span className="pl-md-5"><b>Description</b></span>
                                            <i className='flaticon2-up ml-2 ctriggerclick arrow-icons'
                                                style={{ fontSize: 10 }} onClick={() => this.handleSorting('description', 'ASC')} />
                                            <i className='flaticon2-down ctriggerclick arrow-icons'
                                                style={{ fontSize: 10 }} onClick={() => this.handleSorting('description', 'DESC')} />
                                        </th>
                                        <th width="20%" className="text-center"><b>Status</b></th>
                                        <th width="15%" className="text-center"><b>Action</b></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {categoryData.length > 0 ?
                                        categoryData.map((item, index) =>
                                            <tr key={item.id}>
                                                <td>
                                                    <h6 className={'font-weight-bold text-muted pl-md-5'}>{item.title}</h6>
                                                </td>
                                                <td>
                                                    <h6 className={'font-weight-bold text-muted pl-md-5'}>{item.description ? item.description : '-'}</h6>
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
                                                            <h3 className="text-dark mb-0 mt-4">No Categories have been Found</h3>
                                                            <span className="mt-2">Simply click above button to add new category</span>
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

                {(categoryCount > limit) &&
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center px-4 cus-pagination">
                        <h5 className="text-dark mb-3 mb-md-0">{paginationTexts(activePage, categoryCount, limit)}</h5>
                        <Pagination
                            bsSize={'medium'}
                            activePage={activePage}
                            itemsCountPerPage={limit}
                            totalItemsCount={categoryCount}
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

export default connect(mapStateToProps)(Category);