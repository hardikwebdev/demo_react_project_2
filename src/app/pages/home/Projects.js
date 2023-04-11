/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { createRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
    Portlet,
    PortletBody
} from "../../partials/content/Portlet";
import { Formik } from "formik";
import {
    Button,
    Dropdown,
    Modal,
    Form,
    Col
} from "react-bootstrap";
import {
    getProjectsList, addProjects, editProjects, deleteProjects, getAllUsersList, getAllCategories, getProductStockList, updateStock
} from "../../crud/auth.crud";
import Multiselect from 'multiselect-react-dropdown';
import { PictureAsPdf, OndemandVideo, PlaceSharp, Timeline, MoreHoriz, Edit, Delete, Person, AttachMoney, Add, AccountTree, Remove, Loyalty, BarChart, Layers } from '@material-ui/icons';
import HeaderDropdownToggle from "../../partials/content/CustomDropdowns/HeaderDropdownToggle";
import { TitleComponent } from "../FormComponents/TitleComponent";
import Pagination from 'react-js-pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { paginationTexts } from '../../../_metronic/utils/utils';
import { CircularProgress } from "@material-ui/core";
import clsx from 'clsx';
import moment from 'moment-timezone';

class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectsData: [],
            ProjectsCount: 0,
            userData: [],
            userCount: 0,
            startDate: null,
            endDate: null,
            showAlert: false,
            loading: false,
            searchValue: "",
            limit: 25,
            status: "",
            user_id: '',
            sortBy: 'createdAt',
            sortOrder: 'DESC',
            activePage: 1,
            isFocus: false,
            show: false,
            modalType: "",
            currentProject: null,
            validated: false,
            disabledBtn: false,
            type: "",
            showSub: false,
            currentSub: null,
            categoryFilter: null,
            categoryArray: [],
            product: [],
            dloading: false
        };
        this.inputRef = createRef();
    }


    componentDidMount = async () => {
        if (this.props && this.props.location && this.props.location.state) {
            this.setState({
                dloading: true,
                user_id: this.props.location.state.user_id
            });
            setTimeout(() => {
                this.getProjectsList();
            }, 1000);

        } else {
            this.getProjectsList();
        }
        this.getAllUsersList();
        this.getAllCategories();
    }

    getProjectsList = async (searchData) => {
        this.setState({ dloading: true });
        const { authToken } = this.props;
        var limitV = this.state.limit;
        var sortByV = this.state.sortBy;
        var user_id = this.state.user_id;
        var sortOrderV = this.state.sortOrder;
        var activePage = this.state.activePage;
        var search = (this.state.searchValue !== undefined) ? this.state.searchValue : null;
        var type = (this.state.type === 0 || this.state.type === 1) ? this.state.type : null;
        var categoryFilter = this.state.categoryFilter;
        await getProjectsList(authToken, search, limitV, sortByV,
            sortOrderV, activePage, type, user_id, categoryFilter).then(result => {
                this.setState({
                    dloading: false,
                    projectsData: result.data.payload ? result.data.payload.data.rows : [],
                    ProjectsCount: result.data.payload && result.data.payload.data.count
                });
            }).catch(err => {
                this.setState({
                    dloading: false,
                    projectsData: [],
                    ProjectsCount: 0
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
                userCount: result.data.payload && result.data.payload.data.count
            });

        }).catch(err => {
            this.setState({
                userData: [],
                userCount: 0
            });
            if (err.response && (err.response.data.message === "jwt expired")) {
                window.location.href = "/admin/logout";
            }
        });
    }

    getProductStockList = async (project_id) => {
        const { authToken } = this.props;
        await getProductStockList(authToken, project_id).then(async result => {
            await result.data.payload.data.map(async (item) => {
                await item.Products.map((pItem) => {
                    pItem['update_stock'] = pItem.balance;
                })
            })
            this.setState({
                product: result.data.payload ? result.data.payload.data : [],
                loading: false
            });

        }).catch(err => {
            this.setState({
                product: [],
                loading: false
            });
            if (err.response && (err.response.data.message === "jwt expired")) {
                window.location.href = "/admin/logout";
            }
        });
    }

    getAllCategories = async () => {
        const { authToken } = this.props;
        await getAllCategories(authToken).then(result => {
            this.setState({
                categoryArray: result.data.payload ? result.data.payload.data.rows : []
            });

        }).catch(err => {
            this.setState({
                categoryArray: []
            });
            if (err.response && (err.response.data.message === "jwt expired")) {
                window.location.href = "/admin/logout";
            }
        });
    }


    handleCategoryFilter = (value) => {
        this.setState({ categoryFilter: value });
        setTimeout(() => {
            this.getProjectsList();
        }, 500);
    }

    clear = () => {
        this.setState({ searchValue: "" });
        setTimeout(() => {
            this.getProjectsList();
        }, 500);
    };

    handleSearchChange = event => {
        this.setState({ searchValue: event.target.value });
        if (event.target.value.length === 0) {
            this.getProjectsList();
        }
    };

    handleSorting = (sortBy, sortOrder) => {
        this.setState({
            sortBy: sortBy,
            sortOrder: sortOrder,
        });
        setTimeout(() => {
            this.getProjectsList();
        }, 500);
    }

    handleSelect = (number) => {
        this.setState({ activePage: number });
        setTimeout(() => {
            this.getProjectsList();
        }, 500);
    }

    handleModal = (value, currentProject) => {

        if (value === "UpdateStock") {
            this.setState({ modalType: value, show: true, currentProject, loading: true });
            setTimeout(() => {
                this.getProductStockList(currentProject.id);
            }, 500);
        } else {
            if ((value == "Edit" || value == "EditUser") && currentProject) {
                currentProject.Users = currentProject.Users.length > 0 ? currentProject.Users.filter(user => user != null) : [];
            }
            this.setState({ modalType: value, show: true, currentProject });
        }
    }

    handleClose = () => {
        this.setState({ show: false, showSub: false });
    }

    changeFocus = () => {
        this.setState({ isFocus: true });
    }

    handleChange = (key, value) => {
        this.setState({ [key]: value });
    }

    handleSubmit = () => {
        this.setState({ activePage: 1 });
        setTimeout(() => {
            this.getProjectsList();
        }, 500);
    }

    handleReset = () => {
        window.location.reload();
    }

    handleSwitchChange = async (value, item) => {
        const { authToken } = this.props;
        const { currentProject } = this.state;
        var data = {
            id: currentProject.id,
            title: currentProject.title,
            status: !currentProject.status,
            type: "updateStatus"
        }
        await editProjects(authToken, data).then(result => {
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
            this.getProjectsList();
        }, 500);
    }

    handleEditProjectsSubmit = async (values, setSubmitting) => {
        const { authToken } = this.props;
        const { currentProject } = this.state;
        var postdata = { id: currentProject.id, ...values };
        postdata.title = values.title.trim();

        if (postdata.users && postdata.users.length > 0) {
            postdata.users = postdata.users.map(item => { return item.id });
        }

        editProjects(authToken, postdata).then(result => {
            setSubmitting(false);
            this.handleClose();
            toast.success(result.data.message, {
                className: "green-css"
            });

        }).catch(errors => {
            setSubmitting(false);
            this.handleClose();
            var msg = errors.response ? errors.response.data.message : errors.message;
            toast.error(msg, {
                className: "red-css"
            });
        });

        setTimeout(() => {
            this.getProjectsList();
        }, 500);
    }

    handleAddProjectsSubmit = async (values, setSubmitting) => {
        const { authToken } = this.props;
        var postdata = values;
        postdata.title = values.title.trim();
        const data = new FormData();
        if (postdata.users && postdata.users.length > 0) {
            postdata.users = postdata.users.map(item => { return item.id });
        }
        await addProjects(authToken, postdata).then(result => {
            setSubmitting(false);
            this.handleClose();
            toast.success(result.data.message, {
                className: "green-css"
            });

        }).catch(errors => {
            setSubmitting(false);
            this.handleClose();
            var msg = errors.response ? errors.response.data.message : errors.message;
            toast.error(msg, {
                className: "red-css"
            });
        });
        setTimeout(() => {
            this.getProjectsList();
        }, 500);
    }

    handleDelete = async (event) => {
        this.setState({ disabledBtn: true });
        const { authToken } = this.props;
        var data = {
            id: this.state.currentProject.id
        }
        await deleteProjects(authToken, data).then(result => {
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
            this.setState({ disabledBtn: false });
            this.getProjectsList();
        }, 500);

    }

    updateState = (e, id, type) => {
        var d = null;
        if (type) {
            if (this.state.product.length > 0) {
                var product = this.state.product;
                d = product.map((item, i) => {
                    item.Products.map(pItem => {
                        if (pItem.id == id) {
                            pItem.update_stock = type === "increase" ? pItem.update_stock + 1 : pItem.update_stock - 1;
                        }
                    });
                    return item;
                });
            }

        } else {
            if (this.state.product.length > 0) {
                d = this.state.product.map((item, i) => {
                    item.Products.map(pItem => {
                        if (pItem.id == id) {
                            pItem.update_stock = e.target.value;
                        }
                    });
                    return item;
                });
            }
        }

        this.setState({
            product: d
        });
    }

    preventFloat = (e) => {
        if (e.key === 'e' || e.key === "." || e.key === "+" || e.key === "-") {
            e.preventDefault();
        }
    }

    handleUpdateStock = async (values, setSubmitting) => {
        var updateStockArr = [];

        values.product.map((item => {
            item.Products.filter((it) => {
                if (it.balance != it.update_stock) {
                    var obj = {
                        quantity: it.update_stock - it.balance,
                        originalQuantity: it.balance
                    }
                    if (it.stock_id != 0) {
                        obj.stock_id = it.stock_id
                    } else {
                        obj.product_id = it.id
                    }
                    updateStockArr.push(obj);
                }

            })
        }));

        if (updateStockArr.length > 0) {
            const { authToken } = this.props;
            var postdata = {
                project_id: this.state.currentProject.id,
                products: JSON.stringify(updateStockArr)
            }
            await updateStock(authToken, postdata).then(result => {
                setSubmitting(false);
                this.setState({
                    product: [], currentProject: null
                })
                this.handleClose();
                toast.success(result.data.message, {
                    className: "green-css"
                });

            }).catch(errors => {
                setSubmitting(false);
                this.handleClose();
                this.setState({
                    product: [], currentProject: null
                })
                var msg = errors.response ? errors.response.data.message : errors.message;
                toast.error(msg, {
                    className: "red-css"
                });
            });
            setTimeout(() => {
                this.getProjectsList();
            }, 500);
        }
    }

    renderModalBody = () => {
        const { isFocus, modalType, currentProject, disabledBtn, userData, categoryArray, product, loading } = this.state;
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

        if (modalType === "Add" || modalType === "Edit") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }}>{modalType} Project</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Formik
                        validate={values => {
                            const errors = {};

                            if (!isEdit && values.users.length <= 0) {
                                errors.users = "Please select atleast one user"
                            }

                            if (values.title.trim().length <= 0) {
                                errors.title = "Please provide valid project name"
                            }

                            if (values.description.trim().length <= 0) {
                                errors.description = "Please provide valid description";
                            }

                            if (values.category_id.length <= 0) {
                                errors.category_id = "Please provide valid category";
                            } else if (values.category_id && values.category_id.length > 0 && values.category_id.includes("Select Category")) {
                                errors.category_id = "Please provide valid category";
                            }

                            if (values.start_date.trim().length <= 0) {
                                errors.start_date = "Please provide valid date";
                            }

                            if (values.end_date.trim().length <= 0) {
                                errors.end_date = "Please provide valid date";
                            } else if (values.end_date.trim() < values.start_date.trim()) {
                                errors.end_date = "Please provide valid date";
                            }

                            return errors;
                        }}
                        enableReinitialize
                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            if (isEdit) {
                                this.handleEditProjectsSubmit(values, setSubmitting);
                            } else {
                                this.handleAddProjectsSubmit(values, setSubmitting);
                            }
                        }}
                        validateOnChange={false}
                        validateOnBlur={false}
                        initialValues={{
                            title: isEdit ? currentProject && currentProject.title : '',
                            description: isEdit ? currentProject && currentProject.description : '',
                            users: [],
                            category_id: isEdit ? currentProject && currentProject.category_id ? currentProject.category_id : '' : '',
                            start_date: isEdit ? currentProject && moment(currentProject.start_date).format("YYYY-MM-DD") : '',
                            end_date: isEdit ? currentProject && moment(currentProject.end_date).format("YYYY-MM-DD") : '',
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

                                <Modal.Body className="pt-0">
                                    <div className='fv-row mb-4'>
                                        <label className='form-label mb-0 fw-600 text-dark'>Project Title</label>
                                        <input
                                            required
                                            placeholder='Project title'
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
                                            required
                                            rows={3}
                                            placeholder='Description'
                                            className={clsx(
                                                'form-control form-control-solid rounded pl-4',
                                                { 'is-invalid': touched.description && errors.description },
                                                {
                                                    'is-valid': touched.description && !errors.description,
                                                }
                                            )}
                                            type='text'
                                            name='description'
                                            autoComplete='off'
                                            onFocus={() => this.changeFocus()}
                                            onChange={handleChange}
                                            value={values.description}
                                        />
                                        {touched.description && errors.description && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.description}</span>
                                            </div>
                                        )}
                                    </div>
                                    {!isEdit && <div className='fv-row mb-4'>
                                        <label className='form-label mb-0 fw-600 text-dark'>Select Users</label>
                                        <Multiselect
                                            style={{
                                                searchBox: {
                                                    border: (touched.users && errors.users) ? '1px solid #fd397a' : (touched.users && !errors.users) ? '1px solid #0abb87' : '1px solid #dee2e6',
                                                    borderRadius: '3px',
                                                },
                                                chips: {
                                                    marginBottom: '0px'
                                                }
                                            }}
                                            options={userData}
                                            selectedValues={values.users}
                                            onSelect={(e) => props.setFieldValue("users", e)}
                                            onRemove={(e) => props.setFieldValue("users", e)}
                                            displayValue={'username'}
                                        />
                                        {touched.users && errors.users && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.users}</span>
                                            </div>
                                        )}
                                    </div>}
                                    <div className='fv-row mb-4'>
                                        <label className='form-label mb-0 fw-600 text-dark'>Select Category</label>
                                        <select
                                            className={clsx(
                                                'form-control',
                                                { 'is-invalid': touched.category_id && errors.category_id },
                                                {
                                                    'is-valid': touched.category_id && !errors.category_id,
                                                }
                                            )}
                                            type={"text"}
                                            name={"category_id"}
                                            value={values.category_id}
                                            onChange={handleChange}
                                        >
                                            <option>Select Category</option>
                                            {categoryArray?.map((item, index) =>
                                                <option value={item.id} key={item.id}>{item.title}</option>
                                            )}
                                        </select>
                                        {touched.category_id && errors.category_id && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.category_id}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='row fv-row mb-4'>
                                        <div className="col-12 col-md-6">
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
                                                onFocus={() => this.changeFocus()}
                                                onChange={handleChange}
                                                value={values.start_date}
                                            />
                                            {touched.start_date && errors.start_date && (
                                                <div className='fv-plugins-message-container'>
                                                    <span role='alert'>{errors.start_date}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-12 col-md-6">
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
                                                onFocus={() => this.changeFocus()}
                                                onChange={handleChange}
                                                value={values.end_date}
                                            />
                                            {touched.end_date && errors.end_date && (
                                                <div className='fv-plugins-message-container'>
                                                    <span role='alert'>{errors.end_date}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </Modal.Body>
                                <Modal.Footer>
                                    <Button type="submit" className="ml-auto mr-3" variant="primary" disabled={isSubmitting}>
                                        {isEdit ? "Update" : "Add"}
                                    </Button>
                                </Modal.Footer>
                            </Form>)}
                    </Formik>
                </div >
            );
        } else if (modalType === "Delete") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }} className="text-dark">Delete Project</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Form noValidate>
                        <Modal.Body>
                            <Form.Group as={Col} md="12" className={"text-center"}>
                                <Form.Label style={{ fontWeight: 400 }} className="text-muted">Are you sure you want to delete
                                    this project with <b>{currentProject && currentProject.title}</b> ?</Form.Label>
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
                        <Modal.Title style={{ fontWeight: 700 }} className="text-dark">Change Project Status</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Form noValidate>
                        <Modal.Body>
                            <Form.Group as={Col} md="12" className={"text-center"}>
                                <Form.Label style={{ fontWeight: 400 }} className="text-muted">Are you sure you want to {currentProject.status === 0 ? <b>Activate </b> : <b>Deactivate </b>}
                                    this <b>{currentProject && currentProject.title}</b> project?</Form.Label>
                            </Form.Group>
                        </Modal.Body>
                        <hr className="line-style" />
                        <Modal.Footer>
                            {currentProject.status === 0 ?
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
        } else if (modalType === "EditUser") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }}>Asign Users to Project</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Formik
                        validate={values => {
                            const errors = {};

                            if (values.users.length <= 0) {
                                errors.users = "Please select atleast one user"
                            }

                            return errors;
                        }}
                        enableReinitialize
                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            this.handleEditProjectsSubmit(values, setSubmitting);
                        }}
                        validateOnChange={false}
                        validateOnBlur={false}
                        initialValues={{
                            title: currentProject && currentProject.title,
                            users: currentProject && currentProject.Users,
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

                                <Modal.Body className="pt-0">
                                    <div className='fv-row mb-4'>
                                        <label className='form-label mb-0 fw-600 text-dark'>Select Users</label>
                                        <Multiselect
                                            style={{
                                                searchBox: {
                                                    border: (touched.users && errors.users) ? '1px solid #fd397a' : (touched.users && !errors.users) ? '1px solid #0abb87' : '1px solid #dee2e6',
                                                    borderRadius: '3px',
                                                },
                                                chips: {
                                                    marginBottom: '0px'
                                                }
                                            }}
                                            options={userData}
                                            selectedValues={values.users}
                                            onSelect={(e) => props.setFieldValue("users", e)}
                                            onRemove={(e) => props.setFieldValue("users", e)}
                                            displayValue={'username'}
                                        />
                                        {touched.users && errors.users && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.users}</span>
                                            </div>
                                        )}
                                    </div>

                                </Modal.Body>
                                <Modal.Footer>
                                    <Button type="submit" className="ml-auto mr-3" variant="primary" disabled={isSubmitting}>
                                        Assign
                                    </Button>
                                </Modal.Footer>
                            </Form>)}
                    </Formik>
                </div >
            );
        } else if (modalType === "UpdateStock") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }}>Update Stock</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    {loading ?
                        <div className="text-center py-3" ><CircularProgress />
                        </div> :
                        <Formik
                            validate={values => {
                                const errors = {};

                                if (values.total_stock < 0) {
                                    errors.total_stock = "Please enter valid stock value"
                                }

                                return errors;
                            }}
                            enableReinitialize
                            onSubmit={(values, { setStatus, setSubmitting }) => {
                                this.handleUpdateStock(values, setSubmitting);
                            }}
                            validateOnChange={false}
                            validateOnBlur={false}
                            initialValues={{
                                product: product,
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

                                    <Modal.Body className="pt-0 max-h-300px overflow-auto">
                                        <div className='fv-row mb-4'>
                                            {values?.product?.length > 0 &&
                                                values?.product?.map(item => {
                                                    return (
                                                        <><label className='form-label fw-600 text-muted'>{item.name}</label>
                                                            {item.Products.map(prodItem =>
                                                                <div className="row mb-4">
                                                                    <div className="col-12 col-md-8">
                                                                        <div className="d-flex align-items-center">
                                                                            <div>
                                                                                <img src={prodItem.image_url} className={'w-40 h-40 rounded-circle'} alt='Metronic' />
                                                                            </div>
                                                                            <div className="ml-3">
                                                                                <p className="text-dark font-weight-bold m-0">{prodItem.name}</p>
                                                                                <span href="#" className="text-muted">Balance: {prodItem.balance}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-6 col-md-4">
                                                                        <div className="d-flex align-items-center">
                                                                            <Remove
                                                                                className={clsx("p-1 bg-primary rounded-circle text-white",
                                                                                    prodItem.update_stock === 0 ? "" : "cursor-pointer")}
                                                                                onClick={prodItem.update_stock === 0 ? undefined : (e) => {
                                                                                    this.updateState(e, prodItem.id, "decrease");
                                                                                }}
                                                                            />
                                                                            <input
                                                                                placeholder='Enter Stock'
                                                                                className={clsx(
                                                                                    'form-control form-control-solid mx-3',
                                                                                    // { 'is-invalid': touched.total_stock && errors.total_stock },
                                                                                    // {
                                                                                    //     'is-valid': touched.total_stock && !errors.total_stock,
                                                                                    // }
                                                                                )}
                                                                                type='number'
                                                                                onKeyDown={(e) => this.preventFloat(e)}
                                                                                min={0}
                                                                                name='total_stock'
                                                                                autoComplete='off'
                                                                                onFocus={() => this.changeFocus()}
                                                                                onChange={(e) => {
                                                                                    this.updateState(e, prodItem.id)
                                                                                }}
                                                                                value={prodItem.update_stock}
                                                                            />
                                                                            <Add className="p-1 bg-primary rounded-circle text-white cursor-pointer"
                                                                                // disabled={prodItem.update_stock === prodItem.balance}
                                                                                onClick={(e) => {
                                                                                    this.updateState(e, prodItem.id, "increase");
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    {/* {touched.total_stock && errors.total_stock && (
                                                                    <div className='fv-plugins-message-container'>
                                                                        <span role='alert'>{errors.total_stock}</span>
                                                                    </div>
                                                                )} */}
                                                                </div>)}
                                                        </>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button type="submit" className="ml-auto mr-3" variant="success" disabled={isSubmitting}>
                                            Update
                                        </Button>
                                    </Modal.Footer>
                                </Form>)}
                        </Formik>}
                </div >
            );
        }
    }

    handleStatus = (value) => {
        this.setState({ type: value });
        setTimeout(() => {
            this.getProjectsList();
        }, 500);
    }

    handleUsersStatus = (value) => {
        this.setState({ user_id: value ? value : "" });
        setTimeout(() => {
            this.getProjectsList();
        }, 500);
    }

    handleOutlets = (item) => {
        this.props.history.push({
            pathname: '/admin/project-outlets',
            state: { id: item.id, project_name: item.title }
        })
    }


    render() {
        const { projectsData, ProjectsCount, currentProject, activePage, userData,
            limit, searchValue, dloading, isFocus } = this.state;
        const customStyle = isFocus ? styleSearch : { borderWidth: 2 };

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
                                    <Dropdown drop="down" className="mr-3">
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Status</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => this.handleStatus(1)}>Active</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(0)}>Inactive</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(2)}>All</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown drop="down">
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                            Users</Dropdown.Toggle>
                                        <Dropdown.Menu className="max-h-300px overflow-auto">
                                            {userData?.map((item, index) =>
                                                <Dropdown.Item onClick={() => this.handleUsersStatus(item.id)} key={item.id}>{item.username}</Dropdown.Item>
                                            )}
                                            <Dropdown.Item onClick={() => this.handleUsersStatus()}>All</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <div className="mr-2 ml-auto">
                                        <Button
                                            className='btn btn-primary btn-elevate kt-login__btn-warning'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.handleModal("Add");
                                            }
                                            }
                                        >
                                            Add Projects
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <ToastContainer />

                <Portlet className={'bg-transparent'}>
                    <PortletBody className={'px-4'}>
                        {dloading ? <div className="text-center py-3" ><CircularProgress />
                        </div> :
                            <>{projectsData.length > 0 ?
                                projectsData?.map((item, index) =>
                                    <div className="card p-4 shadow-none mb-5" key={item.id}>
                                        <div className="card-body">
                                            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
                                                <div className="mr-md-4">
                                                    <div className={clsx("rounded p-5", (index % 2 === 0) ? "bg-light-danger" : "bg-light-warning")}>
                                                        <span className={clsx("font-weight-bold", (index % 2 === 0) ? "text-danger" : "text-warning")}>{item.title[0]}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                                        <div className="mr-3">
                                                            <span className="d-flex align-items-center text-dark text-hover-primary font-size-h5 font-weight-bold mr-3 text-break">{item.title
                                                                + "(" + item.campaign_id + ")"}
                                                                <i className="flaticon2-correct text-success icon-md ml-2"></i></span>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <Dropdown className="kt-header__topbar-item kt-header__topbar-item--user cursor-pointer cus-dropdown-bg" drop="down" alignRight>
                                                                <Dropdown.Toggle variant="info" as={HeaderDropdownToggle}>
                                                                    <MoreHoriz />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="edit-options">
                                                                    <div className="d-flex align-items-center px-4 py-2"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            this.handleModal("Edit", item);
                                                                        }}
                                                                    >
                                                                        <Edit />
                                                                        <span className="pl-3"> Edit</span>
                                                                    </div>
                                                                    <div className="d-flex align-items-center px-4 py-2"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            this.handleModal("Delete", item)
                                                                        }}
                                                                    >
                                                                        <Delete />
                                                                        <span className="pl-3">Delete</span>
                                                                    </div>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </div>
                                                    <div className="fw-600 text-muted text-break">{item.description}</div>
                                                    <div className="mt-3">
                                                        <h5 className={'font-weight-bold Status_activation d-inline-block'}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                this.handleModal("ActiveStatus", item)
                                                            }}
                                                        >
                                                            {item.status === 1 ? <span className={'text-success border-bottom border-success'}>Active</span> : <span className={'text-danger border-bottom border-danger'}>Deactive</span>}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center flex-wrap mt-5">
                                                <div className="d-flex align-items-center flex-lg-fill mr-5 my-1">
                                                    <span className="mr-4">
                                                        <Timeline className={clsx(item.isCompleted == 0 ? "text-danger" : "text-success", "font-25")} />
                                                    </span>
                                                    <div className="d-flex flex-column text-dark-75">
                                                        <span className="font-weight-bolder font-size-sm">Project State</span>
                                                        <span className="font-weight-bolder font-size-h5">
                                                            <span className={clsx(item.isCompleted == 0 ? "text-danger" : "text-success", "font-weight-bold")}
                                                            >{item.isCompleted == 0 ? "Ongoing" : "Completed"}</span></span>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center flex-lg-fill mr-5 my-1">
                                                    <span className="mr-4">
                                                        <Person className="text-dark font-25" />
                                                    </span>
                                                    <div className="d-flex flex-column text-dark-75">
                                                        <span className="font-weight-bolder font-size-sm">Total Users</span>
                                                        <span className="font-weight-bolder font-size-h5">
                                                            <span className="text-dark-50 font-weight-bold"
                                                            >{item.Users.length}</span></span>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center flex-lg-fill mr-5 my-1 cursor-pointer">
                                                    <span className="mr-4">
                                                        <PlaceSharp className="text-dark font-25" />
                                                    </span>
                                                    <div className="d-flex flex-column text-dark-75" onClick={(e) => {
                                                        e.preventDefault();
                                                        this.handleOutlets(item);
                                                    }}>
                                                        <span className="font-weight-bolder font-size-sm">Total Outlets</span>
                                                        <span className="font-weight-bolder font-size-h5">
                                                            <span className="text-dark-50 font-weight-bold"

                                                            >{item.outletCount}</span></span>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center flex-lg-fill mr-5 my-1">
                                                    <span className="mr-4">
                                                        <Loyalty className="text-dark font-25" />
                                                    </span>
                                                    <div className="d-flex flex-column text-dark-75">
                                                        <span className="font-weight-bolder font-size-sm">Total Sales</span>
                                                        <span className="font-weight-bolder font-size-h5">
                                                            <span className="text-dark-50 font-weight-bold">{item.total_sales}</span></span>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center flex-lg-fill mr-5 my-1">
                                                    <span className="mr-4">
                                                        <AttachMoney className="text-dark font-25" />
                                                    </span>
                                                    <div className="d-flex flex-column text-dark-75">
                                                        <span className="font-weight-bolder font-size-sm">Total Amount</span>
                                                        <span className="font-weight-bolder font-size-h5">
                                                            <span className="text-dark-50 font-weight-bold">RM {item.total_amount}</span></span>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center flex-lg-fill mr-5 my-1">
                                                    <span className="mr-4">
                                                        <Layers className="text-dark font-25" />
                                                    </span>
                                                    <div className="d-flex flex-column flex-lg-fill">
                                                        <span className="text-dark-75 font-weight-bolder font-size-sm">Total Quantity</span>
                                                        <span className="font-weight-bolder font-size-h5">
                                                            <span className="text-dark-50 font-weight-bold">{item.total_quantity}</span></span>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center flex-lg-fill mr-5 my-1 cursor-pointer">
                                                    <span className="mr-4">
                                                        <BarChart className="text-dark font-25" />
                                                    </span>
                                                    <div className="d-flex flex-column flex-lg-fill">
                                                        <span className="text-dark-75 font-weight-bolder font-size-sm"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                this.handleModal("UpdateStock", item)
                                                            }}
                                                        >Total Stocks</span>
                                                        <span className="font-weight-bolder font-size-h5">
                                                            <span className="text-dark-50 font-weight-bold">{item.total_stock}</span></span>
                                                    </div>
                                                </div>
                                                {item.Users.length ? <div className="d-flex align-items-center mt-3 mt-md-0">
                                                    {(item.Users.length >= 1) && <div className="-ml-10 max-w-30" data-toggle="tooltip" title="" data-original-title="Mark Stone">
                                                        <img alt="Pic" src="/media/avatar/1.png" className="rounded-circle" />
                                                    </div>}
                                                    {(item.Users.length >= 2) && <div className="-ml-10 max-w-30" data-toggle="tooltip" title="" data-original-title="Charlie Stone">
                                                        <img alt="Pic" src="/media/avatar/2.png" className="rounded-circle" />
                                                    </div>}
                                                    {(item.Users.length >= 3) && <div className="-ml-10 max-w-30" data-toggle="tooltip" title="" data-original-title="Luca Doncic">
                                                        <img alt="Pic" src="/media/avatar/3.png" className="rounded-circle" />
                                                    </div>}
                                                    {(item.Users.length >= 4) && <div className="-ml-10 max-w-30" data-toggle="tooltip" title="" data-original-title="Nick Mana">
                                                        <img alt="Pic" src="/media/avatar/4.png" className="rounded-circle" />
                                                    </div>}
                                                    {(item.Users.length >= 5) && <div className="-ml-10 max-w-30" data-toggle="tooltip" title="" data-original-title="Teresa Fox">
                                                        <img alt="Pic" src="/media/avatar/5.png" className="rounded-circle" />
                                                    </div>}
                                                    <div className="ml-3"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.handleModal("EditUser", item)
                                                        }}
                                                    >
                                                        {(item.Users.length > 5) ? <span className={'bg-warning p-2 rounded-circle text-white d-flex justify-content-center align-items-center font-12 cursor-pointer'}>5<Add className="font-12" /></span> : <span className={'bg-warning p-2 rounded-circle text-white d-flex justify-content-center align-items-center cursor-pointer'}><Add /></span>}
                                                    </div>
                                                </div>
                                                    :
                                                    <div className="bg-warning p-2 rounded-circle text-white d-flex justify-content-center align-items-center cursor-pointer"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.handleModal("EditUser", item)
                                                        }}
                                                    >
                                                        <Add />
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                                :
                                <div className="col-md-6 col-lg-4 mx-auto text-center mt-5">
                                    <div className="card card-custom text-center py-5 border-doted-dark bg-transparent">
                                        <div className="card-body">
                                            <span className="bg-light-danger p-3 text-dark rounded">
                                                <AccountTree />
                                            </span>
                                            <h3 className="text-dark mb-0 mt-4">No Projects have been Found</h3>
                                            <span className="mt-2">Simply click above button to add new project</span>
                                        </div>
                                    </div>
                                </div>
                            }
                            </>}
                    </PortletBody>
                </Portlet>


                {(ProjectsCount > limit) &&
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center px-4 cus-pagination">
                        <h5 className="text-dark mb-3 mb-md-0">{paginationTexts(activePage, ProjectsCount, limit)}</h5>
                        <Pagination
                            bsSize={'medium'}
                            activePage={activePage}
                            itemsCountPerPage={limit}
                            totalItemsCount={ProjectsCount}
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

export default withRouter(connect(mapStateToProps)(Projects));