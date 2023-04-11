/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { createRef } from "react";
import { Table } from "react-bootstrap";
import { connect } from "react-redux";
import {
    Portlet,
    PortletBody
} from "../../partials/content/Portlet";
import { withRouter } from "react-router-dom";
import {
    Button,
    Dropdown,
    Modal,
    OverlayTrigger,
    Tooltip,
    Form,
    Col
} from "react-bootstrap";
import { getVisitationHistory, getAllUsersList, getAllProjectsList, getAllList, createCSVRequest, downloadOrdersCSV, deleteOrdersCSV } from "../../crud/auth.crud";
import moment from 'moment-timezone';
import { TitleComponent } from "../FormComponents/TitleComponent";
import Pagination from 'react-js-pagination';
import { BrandingWatermark, InfoOutlined, AddCircle, Cancel } from '@material-ui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { paginationTexts } from '../../../_metronic/utils/utils';
import { CircularProgress } from "@material-ui/core";
import { Formik } from 'formik';
import clsx from 'clsx';

class Visitations extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            reportsData: [],
            reportsCount: 0,
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
            user_id: "",
            project_id: "",
            outlet_id: "",
            userData: [],
            projectData: [],
            outletData: [],
            range: '',
            dloading: false
        };
        this.inputRef = createRef();
        this.refreshInterval = null;

    }


    componentDidMount = async () => {
        this.getVisitationHistory();
        this.getAllUsersList();
        this.getAllProjectsList();
        this.getAllList();
    }

    getVisitationHistory = async (searchData) => {

        const { authToken } = this.props;
        this.setState({ dloading: true });

        var limitV = this.state.limit;
        var sortByV = this.state.sortBy;
        var sortOrderV = this.state.sortOrder;
        var activePage = this.state.activePage;
        var user_id = this.state.user_id;
        var project_id = this.state.project_id;
        var outlet_id = this.state.outlet_id;
        var status = (this.state.status === 0 || this.state.status === 1 || this.state.status === 2) ? this.state.status : null;
        var search = (this.state.searchValue !== undefined) ? this.state.searchValue : null;
        var range = (this.state.range != 4) ? this.state.range : null;
        await getVisitationHistory(authToken, search, limitV, sortByV,
            sortOrderV, activePage, status, user_id, project_id, outlet_id, range).then(result => {
                this.setState({
                    dloading: false,
                    reportsData: result.data.payload ? result.data.payload.rows : [],
                    reportsCount: result.data.payload && result.data.payload.count
                });

            }).catch(err => {
                this.setState({
                    dloading: false,
                    reportsData: [],
                    reportsCount: 0
                });
                if (err.response && (err.response.data.message === "jwt expired")) {
                    window.location.href = "/admin/logout";
                }
            });
    }

    getAllUsersList = async (searchData) => {

        const { authToken } = this.props;

        await getAllUsersList(authToken).then(result => {
            this.setState({
                userData: result.data.payload ? result.data.payload.data.rows : [],
            });

        }).catch(err => {
            this.setState({
                userData: [],
            });
            if (err.response && (err.response.data.message === "jwt expired")) {
                window.location.href = "/admin/logout";
            }
        });
    }

    getAllProjectsList = async (searchData) => {
        const { authToken } = this.props;

        await getAllProjectsList(authToken).then(result => {
            this.setState({
                projectData: result.data.payload ? result.data.payload.data.rows : [],
            });
        }).catch(err => {
            this.setState({
                projectData: [],
            });
            if (err.response && (err.response.data.message === "jwt expired")) {
                window.location.href = "/admin/logout";
            }
        });
    }

    getAllList = async (searchData) => {
        const { authToken } = this.props;

        await getAllList(authToken).then(result => {
            this.setState({
                outletData: result.data.payload ? result.data.payload.data.rows : [],
            });
        }).catch(err => {
            this.setState({
                outletData: [],
            });
            if (err.response && (err.response.data.message === "jwt expired")) {
                window.location.href = "/admin/logout";
            }
        });
    }

    handleUsersStatus = (value) => {
        this.setState({ user_id: value ? value : "", project_id: "", outlet_id: "" });
        setTimeout(() => {
            this.getVisitationHistory();
        }, 500);
    }

    handleProjectStatus = (value) => {
        this.setState({ project_id: value ? value : "", user_id: "", outlet_id: "" });
        setTimeout(() => {
            this.getVisitationHistory();
        }, 500);
    }

    handleOutletStatus = (value) => {
        this.setState({ outlet_id: value ? value : "", project_id: "", user_id: "" });
        setTimeout(() => {
            this.getVisitationHistory();
        }, 500);
    }


    clear = () => {
        this.setState({ searchValue: "" });
        setTimeout(() => {
            this.getVisitationHistory();
        }, 500);
    };

    handleSearchChange = event => {
        this.setState({ searchValue: event.target.value });
        if (event.target.value.length === 0) {
            this.getVisitationHistory();
        }
    };

    handleStatus = (value) => {
        this.setState({ status: value });
        setTimeout(() => {
            this.getVisitationHistory();
        }, 500);
    }

    handleDateRange = (value) => {
        this.setState({ range: value });
        setTimeout(() => {
            this.getVisitationHistory();
        }, 500);
    }

    handleSorting = (sortBy, sortOrder) => {
        this.setState({
            sortBy: sortBy,
            sortOrder: sortOrder,
        });
        setTimeout(() => {
            this.getVisitationHistory();
        }, 500);
    }

    handleSelect = (number) => {
        this.setState({ activePage: number });
        setTimeout(() => {
            this.getVisitationHistory();
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

    handleChange = (key, value) => {
        this.setState({ [key]: value });
    }

    handleSubmit = () => {
        this.setState({ activePage: 1 });
        setTimeout(() => {
            this.getVisitationHistory();
        }, 500);
    }

    handleReset = () => {
        window.location.reload();
    }

    handleActiveTab = (value) => {
        this.setState({
            activeTab: value
        })
    }

    exportOrdersCSV = async (values, setSubmitting) => {
        const { authToken } = this.props;
        const { searchValue, user_id, project_id, outlet_id, status } = this.state;
        this.setState({ loading: true });
        var statusF = (status === 0 || status === 1 || status === 2) ? status : null;
        var search = (searchValue !== undefined) ? searchValue : null;
        var conditions = { statusF, search, user_id, project_id, outlet_id };
        var data = { conditions: JSON.stringify(conditions), type: "CUSTOM", report_type: "order", ...values };
        await createCSVRequest(authToken, data).then(result => {
            setSubmitting(false);
            this.setState({ loading: false });
            toast.success(result.data.message, {
                className: "green-css"
            });

        }).catch(errors => {
            setSubmitting(false);
            this.setState({ loading: false });
            var msg = errors.response ? errors.response.data.message : errors.message;
            toast.error(msg, {
                className: "red-css"
            });
        });
    }

    renderModalBody = () => {
        const { isFocus, modalType, currentCategory, disabledBtn, activeTab, status } = this.state;
        const customStyle = isFocus ? { borderRadius: 0, borderWidth: 2, backgroundColor: 'transparent', borderColor: "#E3E3E3", color: "black" }
            : { borderRadius: 0, borderWidth: 2, backgroundColor: 'transparent', color: 'black' };

        if (currentCategory?.type == 2) {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }} className="text-dark">Visitation Feedbacks</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Modal.Body>
                        <div className="d-flex align-items-center mb-3">
                            <span className="text-dark font-weight-bold mr-2">title:</span>
                            <a href="#" className="text-muted">{currentCategory.feedback_title ? currentCategory.feedback_title : '-'}</a>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <span className="text-dark font-weight-bold mr-2">Description:</span>
                            <a href="#" className="text-muted">{currentCategory.feedback_description ? currentCategory.feedback_description : '-'}</a>
                        </div>
                    </Modal.Body>
                    <hr className="line-style" />
                    <Modal.Footer>
                        <Button className="ml-auto mr-3 w-auto" variant="info"
                            onClick={(e) => this.handleClose()}>
                            Close
                        </Button>
                    </Modal.Footer>
                </div>
            );
        } else if (currentCategory?.type == 0 || currentCategory?.type == 1) {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }} className="text-dark">Visitation Execution Data</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Modal.Body>
                        <div className="row">
                            {currentCategory.execution_url.length > 0 ?
                                currentCategory.execution_url.map((item, index) => {
                                    return (
                                        <div className="col-12 col-md-6 col-xl-3" key={index}>
                                            <div className="shadow-lg p-2 h-100">
                                                <a href={item.url} target="_blank">
                                                    <img src={item.url} alt='Metronic' className="h-110px w-100" />
                                                </a>
                                            </div>
                                        </div>
                                    )
                                })
                                :
                                <div className="col-12 text-center text-muted font-weight-bold">No data found</div>
                            }
                        </div>
                    </Modal.Body>
                    <hr className="line-style" />
                    <Modal.Footer>
                        <Button className="ml-auto mr-3 w-auto" variant="info"
                            onClick={(e) => this.handleClose()}>
                            Close
                        </Button>
                    </Modal.Footer>
                </div >
            );
        }
    }

    handleAddRange = (values, props) => {
        var d = values.dateRange;
        var isEmptyStart = values.dateRange?.filter((item) => item.start_date == "");
        var isEmptyEnd = values.dateRange?.filter((item) => item.end_date == "");

        if (isEmptyStart.length > 0 || isEmptyEnd.length > 0) {
            if (isEmptyStart.length > 0) {
                d[d.length - 1]['errors'] = { start_date: "Please provide valid start date", ...d[d.length - 1]['errors'] }
            }
            if (isEmptyEnd.length > 0) {
                d[d.length - 1]['errors'] = { end_date: "Please provide valid end date", ...d[d.length - 1]['errors'] }
            }
            var maxDate = moment(d[d.length - 1]['start_date']).add(30, 'days').format('YYYY-MM-DD hh:mm:ss');
            if (new Date(maxDate).getTime() < new Date(d[d.length - 1]['end_date']).getTime()) {
                d[d.length - 1]['errors'] = { end_date: "End date can't be greater than 30 days from selected start date", ...d[d.length - 1]['errors'] }
            }
        } else {
            if (d.length < 5) {
                d[d.length - 1]['errors'] = null;
                d.push({ start_date: "", end_date: "", errors: null });
            } else {
                toast.error("Cannot add more than 5 request", {
                    className: "red-css"
                });
            }
        }

        props.setFieldValue('dateRange', d);
    }

    handleDeleteRange = (values, props, index) => {
        if (values.dateRange.length > 1) {
            values.dateRange = values.dateRange.filter((item, i) => i != index);
            props.setFieldValue('dateRange', values.dateRange);
        }
    }

    render() {
        const { reportsData, reportsCount, activePage, limit, searchValue, dloading, loading, isFocus, startDate, endDate, userData, projectData, outletData } = this.state;
        const customStyle = isFocus ? styleSearch
            : { borderWidth: 2 };

        return (
            <div>
                <TitleComponent title={this.props ? this.props.title : ""} icon={this.props.icon} />
                <div className="row">
                    <div className="col-md-12">
                        <div className="kt-section bg-white px-4 py-2 mb-0 border-top">
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
                                    <Dropdown drop="down" className="mr-3">
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Type</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => this.handleStatus(0)}>Check In</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(1)}>Check Out</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(2)}>Closed</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(3)}>All</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown drop="down" className="mr-3">
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                            Date Range</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => this.handleDateRange(0)}>Todays</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleDateRange(1)}>This Week</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleDateRange(2)}>Last Week</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleDateRange(3)}>Last Month</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleDateRange(4)}>All</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown drop="down" className="mr-3">
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Users</Dropdown.Toggle>
                                        <Dropdown.Menu className="max-h-300px overflow-auto">
                                            {userData?.map((item, index) =>
                                                <Dropdown.Item onClick={() => this.handleUsersStatus(item.id)} key={item.id}>{item.username}</Dropdown.Item>
                                            )}
                                            <Dropdown.Item onClick={() => this.handleUsersStatus()}>All</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown drop="down" className="mr-3">
                                        <Dropdown.Toggle variant="info" id="dropdown-basic">
                                            Project</Dropdown.Toggle>
                                        <Dropdown.Menu className="max-h-300px overflow-auto">
                                            {projectData && projectData?.map((item, index) =>
                                                <Dropdown.Item onClick={() => this.handleProjectStatus(item.id)} key={item.id}>{item.title}</Dropdown.Item>
                                            )}
                                            <Dropdown.Item onClick={() => this.handleProjectStatus()}>All</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    <Dropdown drop="down">
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                            Outlet</Dropdown.Toggle>
                                        <Dropdown.Menu className="max-h-300px overflow-auto">
                                            {outletData?.map((item, index) =>
                                                <Dropdown.Item onClick={() => this.handleOutletStatus(item.id)} key={item.id}>{item.outlet_name}</Dropdown.Item>
                                            )}
                                            <Dropdown.Item onClick={() => this.handleOutletStatus()}>All</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <div className="mr-2 ml-auto">
                                        <Button type="button" className='btn btn-info btn-elevate kt-login__btn-info'
                                            onClick={this.handleReset}>
                                            Reset</Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="kt-section bg-white px-4 py-2 border-top">
                            <Formik
                                validate={values => {
                                    var errors = [];
                                    var maxDate = null;

                                    values.dateRange.map((item) => {
                                        if (item.start_date.trim().length <= 0) {
                                            item.errors = {
                                                start_date: "Please provide valid start date",
                                                ...item['errors']
                                            }
                                            errors.push(true);
                                        } else {
                                            maxDate = moment(item.start_date).add(30, 'days').format('YYYY-MM-DD hh:mm:ss');
                                        }

                                        if (item.end_date.trim().length <= 0) {
                                            item.errors = {
                                                end_date: "Please provide valid end date",
                                                ...item['errors']
                                            }
                                            errors.push(true);
                                        } else if (new Date(maxDate).getTime() < new Date(item.end_date).getTime()) {
                                            item.errors = {
                                                end_date: "End date can't be greater than 30 days from selected start date",
                                                ...item['errors']
                                            }
                                            errors.push(true);
                                        }
                                    })
                                    if (errors.length > 0) {
                                        return values;
                                    } else {
                                        return {};
                                    }

                                }}
                                enableReinitialize
                                onSubmit={(values, { setStatus, setSubmitting }) => {
                                    this.exportOrdersCSV(values, setSubmitting);
                                }}
                                validateOnChange={false}
                                validateOnBlur={false}
                                initialValues={{
                                    dateRange: [{
                                        start_date: '',
                                        end_date: '',
                                        errors: null
                                    }],
                                }}
                            >
                                {({
                                    handleSubmit,
                                    handleChange,
                                    values,
                                    errors,
                                    status,
                                    touched,
                                    isSubmitting,
                                    ...props
                                }) => (
                                    <Form noValidate={true}
                                        onSubmit={handleSubmit}
                                    >
                                        <div className='row fv-row mb-1'>
                                            <div className="col-md-6">
                                                {values.dateRange.map((item, i) => {
                                                    return (
                                                        <div className="row align-items-center" key={i}>
                                                            <div className="col-md-5">
                                                                <label className='form-label mb-0 fw-600 text-dark'>Start Date</label>
                                                                <input
                                                                    className={clsx(
                                                                        'form-control form-control-solid',
                                                                        { 'is-invalid': item.errors && item.errors.start_date },
                                                                        {
                                                                            'is-valid': item.errors && !item.errors.start_date,
                                                                        }
                                                                    )}
                                                                    type='date'
                                                                    name='start_date'
                                                                    autoComplete='off'
                                                                    value={item.start_date}
                                                                    onChange={(e) => {
                                                                        values.dateRange[i].start_date = e.target.value;
                                                                        values.dateRange[i].end_date = moment(e.target.value).add(30, 'days').format('yyyy-MM-DD');
                                                                        if (values.dateRange[i].errors) {
                                                                            values.dateRange[i].errors = null;
                                                                        }
                                                                        props.setFieldValue('dateRange', values.dateRange);
                                                                    }}
                                                                />
                                                                {item.errors && item.errors.start_date && (
                                                                    <div className='fv-plugins-message-container'>
                                                                        <span role='alert'>{item.errors.start_date}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="col-md-5">
                                                                <label className='form-label mb-0 fw-600 text-dark'>End Date</label>
                                                                <input
                                                                    className={clsx(
                                                                        'form-control form-control-solid',
                                                                        { 'is-invalid': item.errors && item.errors.end_date },
                                                                        {
                                                                            'is-valid': item.errors && !item.errors.end_date,
                                                                        }
                                                                    )}
                                                                    type='date'
                                                                    min={item.start_date}
                                                                    name='end_date'
                                                                    autoComplete='off'
                                                                    onChange={(e) => {
                                                                        values.dateRange[i].end_date = e.target.value;
                                                                        if (values.dateRange[i].errors && values.dateRange[i].errors.end_date) {
                                                                            values.dateRange[i].errors.end_date = null;
                                                                        }
                                                                        props.setFieldValue('dateRange', values.dateRange);
                                                                    }}
                                                                    value={item.end_date}
                                                                />
                                                                {item.errors && item.errors.end_date && (
                                                                    <div className='fv-plugins-message-container'>
                                                                        <span role='alert'>{item.errors.end_date}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {i != 0 && <div className="col-md-1 mt-4">
                                                                <div className="text-danger"
                                                                    onClick={() => {
                                                                        this.handleDeleteRange(values, props, i);
                                                                    }}
                                                                ><Cancel /></div>
                                                            </div>}
                                                        </div>
                                                    )
                                                })

                                                }
                                            </div>

                                            <div className="col-md-3">
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        this.handleAddRange(values, props);

                                                    }}
                                                    className='btn btn-primary mt-4 btn-elevate kt-login__btn-warning'
                                                >
                                                    <AddCircle />
                                                </Button>
                                            </div>
                                            <div className="mr-2 ml-auto">
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className='btn btn-primary mt-4 btn-elevate kt-login__btn-warning'
                                                >
                                                    {loading && <i style={{ margin: '0px 5px' }}
                                                        className={'kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light'} />}
                                                    Export CSV
                                                </Button>
                                            </div>
                                        </div>

                                    </Form>)}
                            </Formik>
                        </div>
                    </div>
                </div>
                <ToastContainer />
                <Portlet className={'shadow-none'}>
                    <PortletBody>
                        {dloading ? <div className="text-center py-3" ><CircularProgress />
                        </div> :
                            <Table striped responsive bordered hover className="table-list-header m-0">
                                <thead>
                                    <tr>
                                        <th className="text-left"><b>Outlet Name</b></th>
                                        <th className="text-center"><b>Project Name</b>
                                        </th>
                                        <th className="text-center">
                                            <b>User Name</b>
                                        </th>

                                        <th className="text-center"><b>Check In Time</b></th>
                                        <th className="text-center"><b>Check Out Time</b></th>
                                        <th className="text-center"><b>Type</b></th>
                                        <th className="text-center"><b>Actions</b></th>
                                    </tr>
                                </thead>

                                <tbody className="text-center">
                                    {reportsData.length > 0 ?
                                        reportsData.map((item, index) =>
                                            <tr key={item.id}>
                                                <td>
                                                    <h6 className={'font-weight-bold text-muted text-left'}>{item.outlet_name}</h6>
                                                    <div className={'text-muted text-left'}>{item.address}</div>
                                                </td>
                                                <td>
                                                    <h6 className={'font-weight-bold text-muted'}>{item.Project ?
                                                        item.Project.title + "(" + item.Project.campaign_id + ")" : ""}</h6>
                                                </td>
                                                <td>
                                                    <h6 className={'font-weight-bold text-muted'}>{item.User.username}</h6>
                                                </td>

                                                <td>
                                                    <h6 className={'font-weight-bold text-muted'}>
                                                        {item.check_in ? moment(item.check_in).format('DD-MM-YYYY hh:mm A') : '-'}
                                                    </h6>
                                                </td>
                                                <td>
                                                    <h6 className={'font-weight-bold text-muted'}>
                                                        {item.check_out ? moment(item.check_out).format('DD-MM-YYYY hh:mm A') : '-'}
                                                    </h6>
                                                </td>

                                                <td className="text-center">
                                                    <h6 className={'font-weight-bold Status_activation'}
                                                    >
                                                        {item.type === 0 ?
                                                            <div className="d-flex align-items-center">
                                                                <span className={'text-info border-bottom border-info text-nowrap'}>Check In</span>
                                                                {item.reason != null && <OverlayTrigger
                                                                    placement="left"
                                                                    overlay={<Tooltip id="documentations-tooltip">{item.reason}</Tooltip>}>
                                                                    <a className="kt-menu__link-icon pl-2 text-info mb-1"
                                                                        style={{ fontSize: '1.3rem' }}
                                                                    ><InfoOutlined /></a>
                                                                </OverlayTrigger>}
                                                            </div>
                                                            :
                                                            (item.type === 1) ?
                                                                <div className="d-flex align-items-center">
                                                                    <span className={'text-success border-bottom border-success text-nowrap'}>Check Out</span>
                                                                    {item.reason != null && <OverlayTrigger
                                                                        placement="left"
                                                                        overlay={<Tooltip id="documentations-tooltip">{item.reason}</Tooltip>}>
                                                                        <a className="kt-menu__link-icon pl-2 text-success mb-1"
                                                                            style={{ fontSize: '1.3rem' }}
                                                                        ><InfoOutlined /></a>
                                                                    </OverlayTrigger>}
                                                                </div>
                                                                : <span className={'text-danger border-bottom border-danger'}>Closed</span>}
                                                    </h6>
                                                </td>
                                                <td className="text-center">
                                                    <OverlayTrigger
                                                        placement="left"
                                                        overlay={<Tooltip id="documentations-tooltip">View</Tooltip>}>
                                                        <a className="kt-menu__link-icon flaticon-eye pr-4 text-warning"
                                                            style={{ fontSize: '1.3rem' }}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                this.handleModal("Reports", item)
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
                                                            <h3 className="text-dark mb-0 mt-4">No Reports have been Found</h3>
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

                {(reportsCount > limit) &&
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center px-4 cus-pagination">
                        <h5 className="text-dark mb-3 mb-md-0">{paginationTexts(activePage, reportsCount, limit)}</h5>
                        <Pagination
                            bsSize={'medium'}
                            activePage={activePage}
                            itemsCountPerPage={limit}
                            totalItemsCount={reportsCount}
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

export default withRouter(connect(mapStateToProps)(Visitations));