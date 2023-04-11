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
import {
    getUsersList, addUser, editUser, deleteUser, getParentRegionsList, handleUserStatus
} from "../../crud/auth.crud";
import moment from 'moment-timezone';
import { DropzoneArea } from 'material-ui-dropzone';
import { TitleComponent } from "../FormComponents/TitleComponent";
import Pagination from 'react-js-pagination';
import { PictureAsPdf, OndemandVideo, Assessment, MoreHoriz, Edit, Delete, Person, CameraAltOutlined, Close, BrandingWatermark } from '@material-ui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { paginationTexts } from '../../../_metronic/utils/utils';
import { withRouter } from "react-router-dom";
import FormData from 'form-data';
import { CircularProgress } from "@material-ui/core";

var pwdValid = /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
var space = /\s/;

class AdminUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            userCount: 0,
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
            currentUser: null,
            validated: false,
            disabledBtn: false,
            activeTab: 0,
            setHeaderData: this.setHeaderData,
            roleArray: [],
            regionArray: [],
            selectedURL: '',
            loginData: [],
            loginCount: 0,
            loginLimit: 10,
            activeLoginPage: 1,
            currentParentRegion: "",
            selectedStatus: "Status",
            selectedRegion: "Region"
        };
        this.inputRef = createRef();

    }

    componentDidMount = async () => {
        this.getUsersList();
        this.getAllRegionList();
    }
    getAllRegionList = async () => {
        const { authToken } = this.props;
        await getParentRegionsList(authToken).then(result => {
            this.setState({
                regionArray: result.data.payload ? result.data.payload.data.rows : []
            });

        }).catch(err => {
            this.setState({
                regionArray: []
            });
            if (err.response && (err.response.data.message === "jwt expired")) {
                window.location.href = "/admin/logout";
            }
        });
    }

    getUsersList = async (searchData) => {
        this.setState({ loading: true });
        const { authToken } = this.props;

        var limitV = this.state.limit;
        var sortByV = this.state.sortBy;
        var sortOrderV = this.state.sortOrder;
        var activePage = this.state.activePage;
        var startDate = this.state.startDate;
        var endDate = this.state.endDate;
        var status = (this.state.status === 0 || this.state.status === 1) ? this.state.status : null;
        var search = (this.state.searchValue !== undefined) ? this.state.searchValue : null; //searchData !== undefined ? searchData : null;
        var admin_users = 1;
        var region_id = this.state.currentParentRegion;
        await getUsersList(authToken, search, limitV, sortByV,
            sortOrderV, activePage, startDate, endDate, status, admin_users, region_id).then(result => {
                this.setState({
                    userData: result.data.payload ? result.data.payload.data.rows : [],
                    userCount: result.data.payload && result.data.payload.data.count,
                    loading: false
                });

            }).catch(err => {
                this.setState({
                    userData: [],
                    userCount: 0,
                    loading: false
                });
                if (err.response && (err.response.data.message === "jwt expired")) {
                    window.location.href = "/admin/logout";
                }
            });
    }

    clear = () => {
        this.setState({ searchValue: "" });
        setTimeout(() => {
            this.getUsersList();
        }, 500);
    };

    handleSearchChange = event => {
        this.setState({ searchValue: event.target.value, currentParentRegion: "", status: "" });
        if (event.target.value.length === 0) {
            this.getUsersList();
        }
    };

    handleStatus = (value, val) => {
        val = val !== "Status" ? "Status: " + val : "Status";
        this.setState({ status: value, selectedStatus: val, selectedRegion: "Region", currentParentRegion: "" });
        setTimeout(() => {
            this.getUsersList();
        }, 500);
    }

    handleSorting = (sortBy, sortOrder) => {
        this.setState({
            sortBy: sortBy,
            sortOrder: sortOrder,
        });
        setTimeout(() => {
            this.getUsersList();
        }, 500);
    }

    handleSelect = (number, type) => {
        this.setState({ activePage: number });
        setTimeout(() => {
            this.getUsersList();
        }, 500);
    }

    handleModal = (value, currentUser, url) => {
        this.setState({ modalType: value, show: true, currentUser, selectedURL: url });
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
        const { currentUser } = this.state;
        var data = {
            id: currentUser.id,
            status: !currentUser.status,
            type: "updateStatus"
        }
        await handleUserStatus(authToken, data).then(result => {
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
            this.getUsersList();
        }, 500);
    }

    handleChange = (key, value) => {
        this.setState({ [key]: value });
    }

    handleSubmit = () => {
        this.setState({ activePage: 1 });
        setTimeout(() => {
            this.getUsersList();
        }, 500);
    }

    handleReset = () => {
        window.location.reload();
    }

    handleEditUserSubmit = async (values, setSubmitting, key) => {
        const { authToken } = this.props;
        var data = {
            id: this.state.currentUser.id,
        }
        if (key) {
            data = { ...data, password: values.password.trim() }
        } else {
            data = {
                ...data,
                region_id: values.region_id, username: values.username.trim(),
                email: values.email.trim(),
                contact_number: values.contact_number,
                allowed_dashboard_login: 1
            }
        }
        await editUser(authToken, data).then(result => {
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
            this.getUsersList();
        }, 500);
    }

    handleAddUserSubmit = async (values, setSubmitting) => {
        const { authToken } = this.props;
        const data = new FormData();
        var postdata = values;

        postdata.username = values.username.trim();
        postdata.email = values.email.trim();
        postdata.contact_number = values.contact_number;
        postdata.password = values.password.trim();
        postdata.allowed_dashboard_login = 1;

        if (postdata.profile_picture) {
            data.append('file', postdata.profile_picture);
            delete postdata.profile_picture;
        }
        data.append('data', JSON.stringify(postdata));

        await addUser(authToken, data).then(result => {
            setSubmitting(false);
            if (result.data.success) {
                this.handleClose();
                toast.success(result.data.message, {
                    className: "green-css"
                });
            }

        }).catch(errors => {
            setSubmitting(false);
            this.handleClose();
            var msg = errors.response ? errors.response.data.message : errors.message;
            toast.error(msg, {
                className: "red-css"
            });
        });
        setTimeout(() => {
            this.getUsersList();
        }, 500);
    }

    handleParentRegion = (value, val) => {
        val = val !== "Region" ? "Region: " + val : "Region";
        this.setState({ currentParentRegion: value, selectedRegion: val, selectedStatus: "Status", status: "" });
        setTimeout(() => {
            this.getUsersList();
        }, 500);
    }

    handleDelete = async (event) => {
        this.setState({ disabledBtn: true });
        const { authToken } = this.props;
        var data = {
            id: this.state.currentUser.id
        }
        await deleteUser(authToken, data).then(result => {
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
            this.getUsersList();
        }, 500);

    }

    handleActiveTab = (value) => {
        this.setState({
            activeTab: value
        })
    }

    preventFloat = (e) => {
        if (e.key === 'e' || e.key === "." || e.key === "+" || e.key === "-") {
            e.preventDefault();
        }
    }

    renderModalBody = () => {
        const { isFocus, modalType, currentUser, disabledBtn, activeTab, regionArray, roleArray, loginData, loginCount,
            loginLimit, activeLoginPage } = this.state;
        const customStyle = isFocus ? { borderRadius: 0, borderWidth: 2, backgroundColor: 'transparent', borderColor: "#E3E3E3", color: "black" }
            : { borderRadius: 0, borderWidth: 2, backgroundColor: 'transparent', color: 'black' };
        const handlePreviewIcon = (fileObject, classes) => {
            const { type } = fileObject.file

            const iconProps = {
                className: classes.image,
            }

            if (type.startsWith("video/")) return <OndemandVideo {...iconProps} />
            if (type.startsWith("image/")) return <img className={classes.previewImg} role="presentation" src={fileObject.data} />
            if (type === "application/pdf") return <PictureAsPdf {...iconProps} />
        }

        const isEdit = modalType === "Edit" ? true : false;
        if (modalType === "Add") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }}>{modalType} User</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Formik
                        enableReinitialize
                        validateOnChange={false}
                        validateOnBlur={false}
                        validate={values => {
                            const errors = {};

                            if (!values.email) {
                                // https://github.com/formatjs/react-intl/blob/master/docs/API.md#injection-api
                                errors.email = "Please provide email address"
                            } else if (
                                !/^[0-9a-zA-Z]{1}[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                            ) {
                                errors.email = "Please provide valid email address"
                            }
                            if (values.username.trim().length <= 0) {
                                errors.username = "Please provide valid username"
                            }
                            if (values.contact_number.toString().length < 8) {
                                errors.contact_number = "Please enter atleast 8 to 12 digit number"
                            } else if (values.contact_number.toString().length > 12) {
                                errors.contact_number = "Please enter atleast 8 to 12 digit number"
                            }
                            if (!values.password) {
                                errors.password = "Please enter valid password";
                            }

                            if (!pwdValid.test(values.password)
                            ) {
                                errors.password = "Password must contain at least 8 characters, one uppercase, one number and one special case character "
                            } else if (space.test(values.password)
                            ) {
                                errors.password = "Password can't contain space"
                            }
                            if (
                                !pwdValid.test(values.confirmPwd)
                            ) {
                                errors.confirmPwd = "Confirm Password must contain at least 8 characters, one uppercase, one number and one special case character "
                            } else if (space.test(values.confirmPwd)
                            ) {
                                errors.password = "Confirm Password can't contain space"
                            } else if (values.password !== values.confirmPwd) {
                                errors.confirmPwd =
                                    "Password and Confirm Password didn't match.";
                            }

                            if (values.region_id.length <= 0 || values.region_id.includes("Select Region")) {
                                errors.region_id = "Please select valid region"
                            } else if (values.region_id && values.region_id.length > 0 && values.region_id.includes("Select Region")) {
                                errors.role_id = "Please provide valid region";
                            }

                            return errors;
                        }}
                        // enableReinitialize
                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            this.handleAddUserSubmit(values, setSubmitting);
                        }}
                        // validateOnChange={false}
                        // validateOnBlur={false}
                        initialValues={{
                            username: isEdit ? currentUser && (currentUser.username != null ? currentUser.username : '') : '',
                            email: isEdit ? currentUser && currentUser.email : '',
                            profile_picture: isEdit ? currentUser && currentUser.profile_picture : null,
                            contact_number: isEdit ? currentUser && currentUser.contact_number : '',
                            password: isEdit ? '' : currentUser && currentUser.password,
                            confirmPwd: isEdit ? currentUser && currentUser.confirmPwd : '',
                            region_id: isEdit ? currentUser && currentUser.region_id ? currentUser.region_id : '' : '',
                            allowed_dashboard_login: false
                        }}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            values,
                            touched,
                            status,
                            errors,
                            isSubmitting,
                            ...props
                        }) => (
                            <Form noValidate={true}
                                onSubmit={handleSubmit}
                            >
                                <Modal.Body className="row pt-0">
                                    <div className='fv-row mb-4 col-lg-12'>
                                        <label className='form-label fs-6 fw-600 text-dark'>Username</label>
                                        <input
                                            required
                                            placeholder='Username'
                                            className={clsx(
                                                'form-control form-control-solid',
                                                { 'is-invalid': touched.username && errors.username },
                                                {
                                                    'is-valid': touched.username && !errors.username,
                                                }
                                            )}
                                            type='username'
                                            name='username'
                                            autoComplete='off'
                                            onFocus={() => this.changeFocus()}
                                            onChange={handleChange}
                                            value={values.username}
                                        />
                                        {touched.username && errors.username && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.username}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='fv-row mb-4 col-lg-6'>
                                        <label className='form-label fs-6 fw-600 text-dark'>Email</label>
                                        <input
                                            required
                                            placeholder='Email'
                                            className={clsx(
                                                'form-control form-control-solid',
                                                { 'is-invalid': touched.email && errors.email },
                                                {
                                                    'is-valid': touched.email && !errors.email,
                                                }
                                            )}
                                            type='email'
                                            name='email'
                                            autoComplete='off'
                                            onFocus={() => this.changeFocus()}
                                            onChange={handleChange}
                                            value={values.email}
                                        />
                                        {touched.email && errors.email && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.email}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='fv-row mb-4 col-lg-6'>
                                        <label className='form-label fs-6 fw-600 text-dark'>Contact Number</label>
                                        <input
                                            required
                                            placeholder='Contact Number'
                                            className={clsx(
                                                'form-control form-control-solid',
                                                { 'is-invalid': touched.contact_number && errors.contact_number },
                                                {
                                                    'is-valid': touched.contact_number && !errors.contact_number,
                                                }
                                            )}
                                            type='number'
                                            onKeyDown={(e) => this.preventFloat(e)}
                                            name='contact_number'
                                            autoComplete='off'
                                            onFocus={() => this.changeFocus()}
                                            onChange={handleChange}
                                            value={values.contact_number}
                                        />
                                        {touched.contact_number && errors.contact_number && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.contact_number}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className='fv-row mb-4 col-lg-6'>
                                        <label className='form-label fs-6 fw-600 text-dark'>Password</label>
                                        <input
                                            required
                                            placeholder={isEdit ? "........" : "Password"}
                                            className={clsx(
                                                'form-control form-control-solid',
                                                { 'is-invalid': touched.password && errors.password },
                                                {
                                                    'is-valid': touched.password && !errors.password,
                                                }
                                            )}
                                            type='password'
                                            name='password'
                                            autoComplete='off'
                                            onFocus={() => this.changeFocus()}
                                            onChange={handleChange}
                                            value={values.password}
                                        />
                                        {touched.password && errors.password && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.password}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className='fv-row mb-4 col-lg-6'>
                                        <label className='form-label fs-6 fw-600 text-dark'>Confirm Password</label>
                                        <input
                                            required
                                            placeholder={isEdit ? "........" : "Confirm Password"}
                                            className={clsx(
                                                'form-control form-control-solid',
                                                { 'is-invalid': touched.confirmPwd && errors.confirmPwd },
                                                {
                                                    'is-valid': touched.confirmPwd && !errors.confirmPwd,
                                                }
                                            )}
                                            type='password'
                                            name='confirmPwd'
                                            autoComplete='off'
                                            onFocus={() => this.changeFocus()}
                                            onChange={handleChange}
                                            value={values.confirmPwd}
                                        />
                                        {touched.confirmPwd && errors.confirmPwd && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.confirmPwd}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='fv-row mb-4 col-lg-6'>
                                        <label className='form-label mb-0 fw-600 text-dark'>Select Region</label>
                                        <select
                                            className={clsx(
                                                'form-control',
                                                { 'is-invalid': touched.region_id && errors.region_id },
                                                {
                                                    'is-valid': touched.region_id && !errors.region_id,
                                                }
                                            )}
                                            type={"text"}
                                            name={"region_id"}
                                            value={values.region_id}
                                            onChange={handleChange}
                                        >
                                            <option>Select Region</option>
                                            {regionArray?.map((item, index) =>
                                                <option value={item.id} key={item.id}>{item.name}</option>
                                            )}
                                        </select>
                                        {touched.region_id && errors.region_id && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.region_id}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='fv-row mb-4 col-lg-6'>
                                        <label className='form-label mb-0 fw-600 text-dark'>Profile Image</label>
                                        <DropzoneArea
                                            dropzoneText={(isEdit && currentUser.profile_picture) ?
                                                "Drag and drop a image here for replacing your existing thumbnail" :
                                                "Drag and drop a image here or click"}
                                            dropzoneClass={status ? "dropzone dropzone-default min-drop p-2 custom-border" : "dropzone dropzone-default min-drop p-2"}
                                            dropzoneParagraphClass={status ? "dropzone-msg-title custom-border" : "dropzone-msg-title"}
                                            acceptedFiles={['image/*']}
                                            filesLimit={1}
                                            getPreviewIcon={handlePreviewIcon}
                                            showAlerts={['error']}
                                            onChange={(files) => props.setFieldValue("profile_picture", files[0])}
                                        />
                                        {status && (<div className="invalid-msg">{status}</div>)}
                                    </div>
                                </Modal.Body>
                                <hr className="line-style" />
                                <Modal.Footer>
                                    <Button type="submit" className="ml-auto mr-3" variant="primary" disabled={isSubmitting}>
                                        Add
                                    </Button>
                                </Modal.Footer>
                            </Form>)}
                    </Formik>
                </div>
            );
        } else if (modalType === "Edit") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: 'padding: 30px 20px 0px 20px;' }}>
                        {/* <Modal.Title style={{ fontWeight: 700 }}>{modalType} User</Modal.Title> */}
                        <div className={'row align-items-center'}>
                            <div className={(activeTab === 0) ? "col-auto text-center tab-text modal-tab-active" :
                                "col-auto text-center tab-text"} onClick={() => this.handleActiveTab(0)}>Edit Profile</div>
                            <div className={(activeTab === 1) ?
                                "col-auto text-center tab-text modal-tab-active" :
                                "col-auto text-center tab-text"} onClick={() => this.handleActiveTab(1)}>Change Password</div>
                        </div>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    {(activeTab === 0) ?
                        <div className={"tab-pane show active"} id="kt_user_edit_tab_1" role="tabpanel">
                            <Formik
                                enableReinitialize
                                validateOnChange={false}
                                validateOnBlur={false}
                                validate={values => {
                                    const errors = {};

                                    if (!values.email) {
                                        // https://github.com/formatjs/react-intl/blob/master/docs/API.md#injection-api
                                        errors.email = "Please provide email address"
                                    } else if (
                                        !/^[0-9a-zA-Z]{1}[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                    ) {
                                        errors.email = "Please provide valid email address"
                                    }
                                    if (values.username.trim().length <= 0) {
                                        errors.username = "Please provide valid username"
                                    }
                                    if (values.contact_number.toString().length < 8) {
                                        errors.contact_number = "Please enter atleast 8 to 12 digit number"
                                    } else if (values.contact_number.toString().length > 12) {
                                        errors.contact_number = "Please enter atleast 8 to 12 digit number"
                                    }
                                    if (values.region_id.length <= 0) {
                                        errors.region_id = "Please select valid region"
                                    } else if (values.region_id && values.region_id.length > 0 && values.region_id.includes("Select Region")) {
                                        errors.region_id = "Please provide valid region";
                                    }

                                    return errors;
                                }}
                                onSubmit={(values, { setStatus, setSubmitting }) => {
                                    this.handleEditUserSubmit(values, setSubmitting);
                                }}
                                initialValues={{
                                    email: isEdit ? currentUser && currentUser.email : '',
                                    username: isEdit ? currentUser && (currentUser.username != null ? currentUser.username : '') : '',
                                    contact_number: isEdit ? currentUser && currentUser.contact_number : '',
                                    region_id: isEdit ? currentUser && currentUser.region_id ? currentUser.region_id : '' : ''
                                }}
                            >
                                {({
                                    handleSubmit,
                                    handleChange,
                                    values,
                                    touched,
                                    errors,
                                    isSubmitting,
                                    ...props
                                }) => (
                                    <Form noValidate={true}
                                        onSubmit={handleSubmit}
                                    >
                                        <Modal.Body className="pt-0">
                                            <div className='fv-row mb-4'>
                                                <label className='form-label mb-0 fw-600 text-dark'>Username</label>
                                                <input
                                                    required
                                                    placeholder='Username'
                                                    className={clsx(
                                                        'form-control form-control-solid',
                                                        { 'is-invalid': touched.username && errors.username },
                                                        {
                                                            'is-valid': touched.username && !errors.username,
                                                        }
                                                    )}
                                                    type='text'
                                                    name='username'
                                                    autoComplete='off'
                                                    onFocus={() => this.changeFocus()}
                                                    onChange={handleChange}
                                                    value={values.username}
                                                />
                                                {touched.username && errors.username && (
                                                    <div className='fv-plugins-message-container'>
                                                        <span role='alert'>{errors.username}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='fv-row mb-4'>
                                                <label className='form-label mb-0 fw-600 text-dark'>Email</label>
                                                <input
                                                    required
                                                    placeholder='Email'
                                                    className={clsx(
                                                        'form-control form-control-solid',
                                                        { 'is-invalid': touched.email && errors.email },
                                                        {
                                                            'is-valid': touched.email && !errors.email,
                                                        }
                                                    )}
                                                    type='email'
                                                    name='email'
                                                    autoComplete='off'
                                                    onFocus={() => this.changeFocus()}
                                                    onChange={handleChange}
                                                    value={values.email}
                                                />
                                                {touched.email && errors.email && (
                                                    <div className='fv-plugins-message-container'>
                                                        <span role='alert'>{errors.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='fv-row mb-4'>
                                                <label className='form-label mb-0 fw-600 text-dark'>Contact Number</label>
                                                <input
                                                    required
                                                    placeholder='Contact Number'
                                                    className={clsx(
                                                        'form-control form-control-solid',
                                                        { 'is-invalid': touched.contact_number && errors.contact_number },
                                                        {
                                                            'is-valid': touched.contact_number && !errors.contact_number,
                                                        }
                                                    )}
                                                    type='number'
                                                    onKeyDown={(e) => this.preventFloat(e)}
                                                    name='contact_number'
                                                    autoComplete='off'
                                                    onFocus={() => this.changeFocus()}
                                                    onChange={handleChange}
                                                    value={values.contact_number}
                                                />
                                                {touched.contact_number && errors.contact_number && (
                                                    <div className='fv-plugins-message-container'>
                                                        <span role='alert'>{errors.contact_number}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='fv-row mb-4'>
                                                <label className='form-label mb-0 fw-600 text-dark'>Select Region</label>
                                                <select
                                                    className={clsx(
                                                        'form-control',
                                                        { 'is-invalid': touched.region_id && errors.region_id },
                                                        {
                                                            'is-valid': touched.region_id && !errors.region_id,
                                                        }
                                                    )}
                                                    type={"text"}
                                                    name={"region_id"}
                                                    value={values.region_id}
                                                    onChange={handleChange}
                                                >
                                                    <option>Select Region</option>
                                                    {regionArray?.map((item, index) =>
                                                        <option value={item.id} key={item.id}>{item.name}</option>
                                                    )}
                                                </select>
                                                {touched.region_id && errors.region_id && (
                                                    <div className='fv-plugins-message-container'>
                                                        <span role='alert'>{errors.region_id}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Modal.Body>
                                        <hr className="line-style" />
                                        <Modal.Footer>
                                            <Button type="submit" className="ml-auto mr-3" variant="primary" disabled={isSubmitting}>
                                                Update
                                            </Button>
                                        </Modal.Footer>
                                    </Form>)}
                            </Formik>
                        </div>
                        :
                        <div className={"tab-pane show active"} id="kt_user_edit_tab_1" role="tabpanel">
                            <Formik
                                enableReinitialize
                                validateOnChange={false}
                                validateOnBlur={false}
                                validate={values => {
                                    const errors = {};

                                    if (!values.password) {
                                        errors.password = "Please enter valid password";
                                    }

                                    if (!pwdValid.test(values.password)
                                    ) {
                                        errors.password = "Password must contain at least 8 characters, one uppercase, one number and one special case character "
                                    } else if (space.test(values.password)
                                    ) {
                                        errors.password = "Password can't contain space"
                                    }
                                    if (
                                        !pwdValid.test(values.confirmPwd)
                                    ) {
                                        errors.confirmPwd = "Confirm Password must contain at least 8 characters, one uppercase, one number and one special case character "
                                    } else if (space.test(values.confirmPwd)
                                    ) {
                                        errors.password = "Confirm Password can't contain space"
                                    } else if (values.password !== values.confirmPwd) {
                                        errors.confirmPwd =
                                            "Password and Confirm Password didn't match.";
                                    }

                                    return errors;
                                }}
                                onSubmit={(values, { setStatus, setSubmitting }) => {
                                    this.handleEditUserSubmit(values, setSubmitting, 'isPassword');
                                }}
                                initialValues={{
                                    password: isEdit ? '' : currentUser && currentUser.password,
                                    confirmPwd: isEdit ? '' : currentUser && currentUser.confirmPwd,
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
                                                <label className='form-label mb-0 fw-600 text-dark'>Password</label>
                                                <input
                                                    required
                                                    placeholder={isEdit ? "........" : "Password"}
                                                    className={clsx(
                                                        'form-control form-control-solid',
                                                        { 'is-invalid': touched.password && errors.password },
                                                        {
                                                            'is-valid': touched.password && !errors.password,
                                                        }
                                                    )}
                                                    type='password'
                                                    name='password'
                                                    autoComplete='off'
                                                    onFocus={() => this.changeFocus()}
                                                    onChange={handleChange}
                                                    value={values.password}
                                                />
                                                {touched.password && errors.password && (
                                                    <div className='fv-plugins-message-container'>
                                                        <span role='alert'>{errors.password}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className='fv-row mb-4'>
                                                <label className='form-label mb-0 fw-600 text-dark'>Confirm Password</label>
                                                <input
                                                    required
                                                    placeholder={isEdit ? "........" : "Confirm Password"}
                                                    className={clsx(
                                                        'form-control form-control-solid',
                                                        { 'is-invalid': touched.confirmPwd && errors.confirmPwd },
                                                        {
                                                            'is-valid': touched.confirmPwd && !errors.confirmPwd,
                                                        }
                                                    )}
                                                    type='password'
                                                    name='confirmPwd'
                                                    autoComplete='off'
                                                    onFocus={() => this.changeFocus()}
                                                    onChange={handleChange}
                                                    value={values.confirmPwd}
                                                />
                                                {touched.confirmPwd && errors.confirmPwd && (
                                                    <div className='fv-plugins-message-container'>
                                                        <span role='alert'>{errors.confirmPwd}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </Modal.Body>
                                        <hr className="line-style" />
                                        <Modal.Footer>
                                            <Button type="submit" className="ml-auto mr-3" variant="primary" disabled={isSubmitting}>
                                                Update
                                            </Button>
                                        </Modal.Footer>
                                    </Form>)}
                            </Formik>
                        </div>
                    }

                </div >
            );
        } else if (modalType === "Delete") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }} className="text-dark">Delete User</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Form noValidate>
                        <Modal.Body>
                            <Form.Group as={Col} md="12" className={"text-center"}>
                                <Form.Label style={{ fontWeight: 400 }} className="text-muted">Are you sure you want to delete
                                    this user with <b className="text-dark">{currentUser && currentUser.email}</b> ?</Form.Label>
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
                        <Modal.Title style={{ fontWeight: 700 }} className="text-dark">Change User Status</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Form noValidate>
                        <Modal.Body>
                            <Form.Group as={Col} md="12" className={"text-center"}>
                                <Form.Label style={{ fontWeight: 400 }} className="text-muted">Are you sure you want to {currentUser.status === 0 ? <b>Activate </b> : <b>Deactivate </b>}
                                    this user with <b>{currentUser && currentUser.username}</b> ?</Form.Label>
                            </Form.Group>
                        </Modal.Body>
                        <hr className="line-style" />
                        <Modal.Footer>
                            {currentUser.status === 0 ?
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
        const { headerData, setHeaderData } = this.context;
        const { userData, userCount, activePage, limit, searchValue, loading, isFocus, startDate, endDate, regionArray, selectedStatus, selectedRegion } = this.state;
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
                                            {selectedStatus}</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => this.handleStatus(1, "Active")}>Active</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(0, "Inactive")}>Inactive</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(2, "Status")}>All</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown drop="down" className="ml-3">
                                        <Dropdown.Toggle variant="info" id="dropdown-basic">
                                            {selectedRegion}</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {regionArray?.map((item, index) =>
                                                <Dropdown.Item onClick={() => this.handleParentRegion(item.id, item.name)}>{item.name}</Dropdown.Item>
                                            )}
                                            <Dropdown.Item onClick={() => this.handleParentRegion("", "Region")}>All</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <div className="mr-2 ml-auto">
                                        <Button
                                            className='btn btn-primary'
                                            onClick={(e) => this.handleModal("Add")}
                                        >Add User
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
                                        <span className="pl-md-5"><b>Name</b></span>
                                        <i className='flaticon2-up ml-2 ctriggerclick arrow-icons'
                                            style={{ fontSize: 10 }} onClick={() => this.handleSorting('username', 'ASC')} />
                                        <i className='flaticon2-down ctriggerclick arrow-icons'
                                            style={{ fontSize: 10 }} onClick={() => this.handleSorting('username', 'DESC')} />
                                    </th>
                                    <th width="15%" className="text-center"><b>Email</b></th>
                                    <th width="20%" className="text-center"><b>Region</b></th>
                                    <th width="20%" className="text-center"><b>Status</b></th>
                                    <th width="15%" className="text-center"><b>Action</b></th>
                                </tr>
                            </thead>

                            <tbody>
                                {userData.length > 0 ?
                                    userData.map((item, index) =>
                                        <tr key={item.id}>
                                            <td>
                                                <h6 className={'font-weight-bold text-muted pl-md-5'}>{item.username}</h6>
                                            </td>
                                            <td className="text-center">
                                                <h6 className={'font-weight-bold text-muted'}>{item.email}</h6>
                                            </td>
                                            <td className="text-center">
                                                <h6 className={'font-weight-bold text-muted'}>{item.ParentRegion ? item.ParentRegion.name : "-"}</h6>
                                            </td>
                                            <td className="text-center">
                                                <h6 className={'font-weight-bold Status_activation'}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.handleModal("ActiveStatus", item)
                                                    }}
                                                >
                                                    {item.status == 1 ? <span className={'text-success border-bottom border-success'}>Active</span> : <span className={'text-danger border-bottom border-danger'}>Deactive</span>}
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
                                                            <Person />
                                                        </span>
                                                        <h3 className="text-dark mb-0 mt-4">No Users have been Found</h3>
                                                        <span className="mt-2">Simply click above button to add new user</span>
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

                {(userCount > limit) &&
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center px-4 cus-pagination">
                        <h5 className="text-dark mb-3 mb-md-0">{paginationTexts(activePage, userCount, limit)}</h5>
                        <Pagination
                            bsSize={'medium'}
                            activePage={activePage}
                            itemsCountPerPage={limit}
                            totalItemsCount={userCount}
                            pageRangeDisplayed={5}
                            onChange={this.handleSelect}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                    </div>}
                <Modal centered size={this.state.modalType == 'Delete' ? "md" : this.state.modalType == 'Logs' ? "xl" : "lg"} show={this.state.show} onHide={() => {
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

export default withRouter(connect(mapStateToProps)(AdminUser));