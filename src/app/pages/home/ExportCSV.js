/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { createRef } from "react";
import { Table } from "react-bootstrap";
import { connect } from "react-redux";
import {
    Portlet,
    PortletBody
} from "../../partials/content/Portlet";
import { withRouter } from "react-router-dom";
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
import { getCSVRequestList, resubmitRequest, deleteCSV } from "../../crud/auth.crud";
import moment from 'moment-timezone';
import { DropzoneArea } from 'material-ui-dropzone';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { TitleComponent } from "../FormComponents/TitleComponent";
import Pagination from 'react-js-pagination';
import { InsertDriveFile, MoreHoriz, Edit, Delete, BrandingWatermark } from '@material-ui/icons';
import Switch from "react-switch";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderDropdownToggle from "../../partials/content/CustomDropdowns/HeaderDropdownToggle";
import { paginationTexts } from '../../../_metronic/utils/utils';
import { CircularProgress } from "@material-ui/core";

var pwdValid = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
var space = /\s/;

class Reports extends React.Component {

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
            currentRequest: null,
            validated: false,
            disabledBtn: false,
            activeTab: 0,
            user_id: "",
            project_id: "",
            outlet_id: "",
            report_type: "",
            type: "",
            userData: [],
            projectData: [],
            outletData: [],
            dloading: false
        };
        this.inputRef = createRef();
        this.refreshInterval = null;

    }


    componentDidMount = async () => {
        this.getCSVRequestList();
    }

    getCSVRequestList = async (values) => {
        this.setState({ dloading: true });
        const { authToken, user } = this.props;
        const { limit, sortBy, sortOrder, activePage, status, type, report_type } = this.state;

        var statusF = (this.state.status != 4) ? this.state.status : null;
        var start_date = values && values.start_date;
        var end_date = values && values.end_date;
        var user_id = user.id;
        var user_role = user.role_id;
        var allowed_user = user.allowed_dashboard_login;
        await getCSVRequestList(authToken, limit, sortBy,
            sortOrder, activePage, statusF, report_type, type, start_date, end_date, user_id, user_role, allowed_user).then(result => {
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

    handleStatus = (value) => {
        this.setState({ status: value });
        setTimeout(() => {
            this.getCSVRequestList();
        }, 500);
    }

    handleReportFilter = (value) => {
        this.setState({ report_type: value });
        setTimeout(() => {
            this.getCSVRequestList();
        }, 500);
    }

    handleTypeFilter = (value) => {
        this.setState({ type: value });
        setTimeout(() => {
            this.getCSVRequestList();
        }, 500);
    }

    handleSorting = (sortBy, sortOrder) => {
        this.setState({
            sortBy: sortBy,
            sortOrder: sortOrder,
        });
        setTimeout(() => {
            this.getCSVRequestList();
        }, 500);
    }

    handleSelect = (number) => {
        this.setState({ activePage: number });
        setTimeout(() => {
            this.getCSVRequestList();
        }, 500);
    }

    handleReset = () => {
        window.location.reload();
    }

    downloadCSV = async (url) => {
        var parts = url.split("/");
        var result = parts[parts.length - 1];
        var a = document.createElement('a');
        a.href = url;
        a.download = result;
        document.body.append(a);
        a.click();
        a.remove();
        toast.success("CSV file downloaded successfully!", {
            className: "green-css"
        });
    }

    deleteCSV = async (item) => {
        const { authToken } = this.props;
        const { currentRequest } = this.state;

        await deleteCSV(authToken, currentRequest).then(result => {
            this.handleClose();
            toast.success(result.data.message, {
                className: "green-css"
            });

        }).catch(errors => {
            var msg = errors.response ? errors.response.data.message : errors.message;
            this.handleClose();
            toast.error(msg, {
                className: "red-css"
            });
        });
        setTimeout(() => {
            this.getCSVRequestList();
        }, 500);
    }

    resubmitRequest = async (item) => {
        const { authToken } = this.props;
        const { currentRequest } = this.state;

        await resubmitRequest(authToken, currentRequest).then(result => {
            this.handleClose();
            toast.success(result.data.message, {
                className: "green-css"
            });

        }).catch(errors => {
            var msg = errors.response ? errors.response.data.message : errors.message;
            this.handleClose();
            toast.error(msg, {
                className: "red-css"
            });
        });
        setTimeout(() => {
            this.getCSVRequestList();
        }, 500);
    }

    handleDateRange = async (values, setSubmitting) => {
        setTimeout(() => {
            setSubmitting(false);
            this.getCSVRequestList(values);
        }, 500);
    }

    handleModal = (value, currentRequest) => {
        this.setState({ modalType: value, show: true, currentRequest });
    }

    handleClose = () => {
        this.setState({ show: false, disabledBtn: false });
    }

    renderModalBody = () => {
        const { modalType, disabledBtn } = this.state;

        if (modalType === "Delete") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }} className="text-dark">Delete CSV</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Form noValidate>
                        <Modal.Body>
                            <Form.Group as={Col} md="12" className={"text-center"}>
                                <Form.Label style={{ fontWeight: 400 }} className="text-muted">
                                    Are you sure you want to delete
                                    this CSV file ?</Form.Label>
                            </Form.Group>
                        </Modal.Body>
                        <hr className="line-style" />
                        <Modal.Footer>
                            <Button className="ml-auto mr-3 w-auto" variant="danger" disabled={disabledBtn}
                                onClick={(e) => this.deleteCSV(e)}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Form>
                </div>
            );
        } else if (modalType === "Resubmit") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }} className="text-dark">Resubmit CSV Request</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Form noValidate>
                        <Modal.Body>
                            <Form.Group as={Col} md="12" className={"text-center"}>
                                <Form.Label style={{ fontWeight: 400 }} className="text-muted">
                                    Are you sure you want to resubmit CSV request ?</Form.Label>
                            </Form.Group>
                        </Modal.Body>
                        <hr className="line-style" />
                        <Modal.Footer>
                            <Button className="ml-auto mr-3 w-auto" variant="danger" disabled={disabledBtn}
                                onClick={(e) => this.resubmitRequest(e)}>
                                Resubmit Request
                            </Button>
                        </Modal.Footer>
                    </Form>
                </div>
            );
        }
    }
    render() {
        const { reportsData, reportsCount, activePage, limit, dloading, isFocus } = this.state;

        return (
            <div>
                <TitleComponent title={this.props.title} icon={this.props.icon} />
                <div className="row">
                    <div className="col-md-12">
                        <div className="kt-section bg-white px-4 py-2 border-top">
                            <Formik
                                validate={values => {
                                    const errors = {};

                                    if (values.start_date.trim().length <= 0) {
                                        errors.start_date = "Please provide valid start date";
                                    }

                                    if (values.end_date.trim().length <= 0) {
                                        errors.end_date = "Please provide valid end date";
                                    }

                                    if (new Date(values.start_date).getTime() > new Date(values.end_date).getTime()) {
                                        errors.end_date = "Start date can't be greater than selected end date";
                                    }

                                    return errors;
                                }}
                                enableReinitialize
                                onSubmit={(values, { setStatus, setSubmitting }) => {
                                    this.handleDateRange(values, setSubmitting);
                                }}
                                validateOnChange={false}
                                validateOnBlur={false}
                                initialValues={{
                                    start_date: '',
                                    end_date: '',
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
                                        <div className='row fv-row mb-2 px-4 align-items-start'>
                                            <div className="">
                                                <label className='form-label mb-0 fw-600 text-dark'>Start Date</label>
                                                <input
                                                    className={clsx(
                                                        'form-control form-control-solid',
                                                        { 'is-invalid': touched.start_date && errors.start_date },
                                                        {
                                                            'is-valid': touched.start_date && !errors.start_date,
                                                        }
                                                    )}
                                                    type='date'
                                                    name='start_date'
                                                    autoComplete='off'
                                                    onChange={handleChange}
                                                />
                                                {touched.start_date && errors.start_date && (
                                                    <div className='fv-plugins-message-container'>
                                                        <span role='alert'>{errors.start_date}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mx-sm-3">
                                                <label className='form-label mb-0 fw-600 text-dark'>End Date</label>
                                                <input
                                                    className={clsx(
                                                        'form-control form-control-solid',
                                                        { 'is-invalid': touched.end_date && errors.end_date },
                                                        {
                                                            'is-valid': touched.end_date && !errors.end_date,
                                                        }
                                                    )}
                                                    type='date'
                                                    min={values.start_date}
                                                    name='end_date'
                                                    autoComplete='off'
                                                    onChange={handleChange}
                                                    value={values.end_date}
                                                />
                                                {touched.end_date && errors.end_date && (
                                                    <div className='fv-plugins-message-container'>
                                                        <span role='alert'>{errors.end_date}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className='btn btn-primary mb-0 ml-3 mt-4 ml-sm-0 btn-elevate kt-login__btn-warning'
                                            >
                                                Search
                                            </Button>
                                            <Dropdown drop="down" className="ml-3">
                                                <Dropdown.Toggle variant="success" id="dropdown-basic" className="mb-0 mt-4">
                                                    Status</Dropdown.Toggle>
                                                <Dropdown.Menu className="max-h-300px overflow-auto">
                                                    <Dropdown.Item onClick={() => this.handleStatus(0)}>Pending</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.handleStatus(1)}>Processing</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.handleStatus(2)}>Completed</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.handleStatus(3)}>Failed</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.handleStatus(4)}>All</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            <Dropdown drop="down" className="ml-3">
                                                <Dropdown.Toggle variant="info" id="dropdown-basic" className="mb-0 mt-4">
                                                    Report Type</Dropdown.Toggle>
                                                <Dropdown.Menu className="max-h-300px overflow-auto">
                                                    <Dropdown.Item onClick={() => this.handleReportFilter("order")}>Order</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.handleReportFilter("outlet")}>Outlet</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.handleReportFilter("")}>All</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            <Dropdown drop="down" className="ml-3">
                                                <Dropdown.Toggle variant="success" id="dropdown-basic" className="mb-0 mt-4">
                                                    Type</Dropdown.Toggle>
                                                <Dropdown.Menu className="max-h-300px overflow-auto">
                                                    <Dropdown.Item onClick={() => this.handleTypeFilter("custom")}>Custom</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.handleTypeFilter("automatic")}>Automatic</Dropdown.Item>
                                                    <Dropdown.Item onClick={() => this.handleTypeFilter("")}>All</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            <div className="mr-2 ml-sm-auto ml-3">
                                                <Button type="button" className='btn btn-info mt-4 btn-elevate mb-0 kt-login__btn-info'
                                                    onClick={this.handleReset}>
                                                    Reset</Button>
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
                                        <th className="text-center"><b>Report Type</b>
                                        </th>
                                        <th className="text-center">
                                            <b>Region</b>
                                        </th>
                                        <th className="text-center">
                                            <b>Type</b>
                                        </th>
                                        <th className="text-center"><b>Start Date</b></th>
                                        <th className="text-center"><b>End Date</b></th>
                                        <th className="text-center"><b>Created Date</b></th>
                                        <th className="text-center"><b>Status</b></th>
                                        <th className="text-center"><b>Actions</b></th>
                                    </tr>
                                </thead>

                                <tbody className="text-center">
                                    {reportsData.length > 0 ?
                                        reportsData.map((item, index) =>
                                            <tr key={item.id}>
                                                <td>
                                                    <h6 className={'font-weight-bold text-muted'}>{item.report_type}</h6>
                                                </td>
                                                <td>
                                                    <h6 className={'font-weight-bold text-muted'}>{item.User.ParentRegion ?  item.User.ParentRegion.name : "-"}</h6>
                                                </td>
                                                <td>
                                                    <h6 className={'font-weight-bold text-muted'}>{item.type}</h6>
                                                </td>
                                                <td>
                                                    <h6 className={'font-weight-bold text-muted'}>{item.start_date ? moment(item.start_date).format('DD-MM-YYYY hh:mm A') : "-"}</h6>
                                                </td>
                                                <td>
                                                    <h6 className={'font-weight-bold text-muted'}>{item.end_date ? moment(item.end_date).format('DD-MM-YYYY hh:mm A') : "-"}</h6>
                                                </td>
                                                <td>
                                                    <h6 className={'font-weight-bold text-muted'}>{moment(item.createdAt).format('DD-MM-YYYY hh:mm A')}</h6>
                                                </td>

                                                <td className="text-center">
                                                    <h6 className={'font-weight-bold Status_activation'}
                                                    >
                                                        {item.status === 0 ?
                                                            <span className={'text-info border-bottom border-info'}>Pending</span> :
                                                            (item.status === 1) ?
                                                                <span className={'text-success border-bottom border-success'}>Processing</span>
                                                                : (item.status === 2) ?
                                                                    <span className={'text-success border-bottom border-success'}>Completed</span> :
                                                                    <span className={'text-danger border-bottom border-danger'}>Failed</span>}
                                                    </h6>
                                                </td>
                                                <td className="text-center">
                                                    {(item.status === 2 || item.status === 3) ?
                                                        (item.status === 2) ? (
                                                            <> <OverlayTrigger
                                                                placement="left"
                                                                overlay={<Tooltip id="documentations-tooltip">{"Download"}</Tooltip>}>
                                                                <a className={"kt-menu__link-icon flaticon-download pr-4 text-success"}
                                                                    style={{ fontSize: '1.3rem' }}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        this.downloadCSV(item.file_url)
                                                                    }}></a>

                                                            </OverlayTrigger>
                                                                <OverlayTrigger
                                                                    placement="left"
                                                                    overlay={<Tooltip id="documentations-tooltip">{"Delete CSV"}</Tooltip>}>
                                                                    <a className={"kt-menu__link-icon flaticon2-rubbish-bin-delete-button text-danger"}
                                                                        style={{ fontSize: '1.3rem' }}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            this.handleModal("Delete", item)
                                                                        }}></a>

                                                                </OverlayTrigger></>
                                                        ) : (
                                                            <> <OverlayTrigger
                                                                placement="left"
                                                                overlay={<Tooltip id="documentations-tooltip">{"Resubmit Request"}</Tooltip>}>
                                                                <a className="kt-menu__link-icon flaticon-settings pr-4 text-warning"
                                                                    style={{ fontSize: '1.3rem' }}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        this.handleModal("Resubmit", item)
                                                                    }}></a></OverlayTrigger>
                                                                <OverlayTrigger
                                                                    placement="left"
                                                                    overlay={<Tooltip id="documentations-tooltip">{"Delete CSV"}</Tooltip>}>
                                                                    <a className={"kt-menu__link-icon flaticon2-rubbish-bin-delete-button text-danger"}
                                                                        style={{ fontSize: '1.3rem' }}
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            this.handleModal("Delete", item)
                                                                        }}></a>

                                                                </OverlayTrigger>
                                                            </>
                                                        ) : "-"
                                                    }
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
                            </Table>
                        }
                    </PortletBody>
                </Portlet>

                {
                    (reportsCount > limit) &&
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
                    </div>
                }
                <Modal centered size="md" show={this.state.show} onHide={() => {
                    this.handleClose();
                }} style={{ opacity: 1 }}>
                    {this.renderModalBody()}
                </Modal>
            </div >
        );
    }
}

const styleSearch = {
    borderColor: "#E3E3E3", borderWidth: 2, borderLeftWidth: 0, borderRightWidth: 0
}

const mapStateToProps = ({ auth: { authToken, user } }) => ({
    authToken, user
});

export default withRouter(connect(mapStateToProps)(Reports));