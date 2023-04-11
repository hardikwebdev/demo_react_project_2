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
    getProductList, addProduct, editProduct, deleteProduct, addProductImg, editProductImg, getAllBrandList
} from "../../crud/auth.crud";
import Switch from "react-switch";
import { DropzoneArea } from 'material-ui-dropzone';
import { PictureAsPdf, OndemandVideo, Photo, MoreHoriz, Edit, Delete, Category } from '@material-ui/icons';
import { TitleComponent } from "../FormComponents/TitleComponent";
import Pagination from 'react-js-pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderDropdownToggle from "../../partials/content/CustomDropdowns/HeaderDropdownToggle";
import { paginationTexts } from '../../../_metronic/utils/utils';
import { CircularProgress } from '@material-ui/core';

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productData: [],
            productCount: 0,
            brandData: [],
            brandCount: 0,
            startDate: null,
            endDate: null,
            showAlert: false,
            loading: false,
            searchValue: "",
            limit: 25,
            status: "",
            brand_id: "",
            sortBy: 'createdAt',
            sortOrder: 'DESC',
            activePage: 1,
            isFocus: false,
            show: false,
            modalType: "",
            currentProduct: null,
            validated: false,
            disabledBtn: false,
            isQuestions: false
        };
        this.inputRef = createRef();
    }


    componentDidMount = async () => {
        this.getProductsList();
        this.getAllBrandList();
    }

    getProductsList = async (searchData) => {
        this.setState({ loading: true });
        const { authToken } = this.props;
        var limitV = this.state.limit;
        var sortByV = this.state.sortBy;
        var brand_id = this.state.brand_id;
        var sortOrderV = this.state.sortOrder;
        var activePage = this.state.activePage;
        var search = (this.state.searchValue !== undefined) ? this.state.searchValue : null;
        var status = (this.state.status === 0 || this.state.status === 1) ? this.state.status : null;
        await getProductList(authToken, search, limitV, sortByV,
            sortOrderV, activePage, status, brand_id).then(result => {
                this.setState({
                    loading: false,
                    productData: result.data.payload ? result.data.payload.data.rows : [],
                    productCount: result.data.payload && result.data.payload.data.count
                });
            }).catch(err => {
                this.setState({
                    loading: false,
                    productData: [],
                    productCount: 0
                });
                if (err.response && (err.response.data.message === "jwt expired")) {
                    window.location.href = "/admin/logout";
                }
            });
    }

    clear = () => {
        this.setState({ searchValue: "" });
        setTimeout(() => {
            this.getProductsList();
        }, 500);
    };

    getAllBrandList = async (searchData) => {

        const { authToken } = this.props;

        await getAllBrandList(authToken).then(result => {
            this.setState({
                brandData: result.data.payload ? result.data.payload.data.rows : [],
                brandCount: result.data.payload && result.data.payload.data.count
            });

        }).catch(err => {
            this.setState({
                brandData: [],
                brandCount: 0
            });
            if (err.response && (err.response.data.message === "jwt expired")) {
                window.location.href = "/admin/logout";
            }
        });
    }

    handleSearchChange = event => {
        this.setState({ searchValue: event.target.value });
        if (event.target.value.length === 0) {
            this.getProductsList();
        }
    };

    handleSorting = (sortBy, sortOrder) => {
        this.setState({
            sortBy: sortBy,
            sortOrder: sortOrder,
        });
        setTimeout(() => {
            this.getProductsList();
        }, 500);
    }

    handleSelect = (number) => {
        this.setState({ activePage: number });
        setTimeout(() => {
            this.getProductsList();
        }, 500);
    }

    handleModal = (value, currentProduct) => {
        this.setState({ modalType: value, show: true, currentProduct });
    }

    handleSubCategoryModal = (value, currentSub) => {
        this.setState({ modalType: value, showSub: true, currentSub });
    }

    handleClose = () => {
        this.setState({ show: false, showSub: false });
    }

    changeFocus = () => {
        this.setState({ isFocus: true });
    }

    preventFloat = (e) => {
        if (e.key === 'e' || e.key === "." || e.key === "+" || e.key === "-") {
            e.preventDefault();
        }
    }

    handleChange = (key, value) => {
        this.setState({ [key]: value });
    }
    handleChanges = e => {
        e.preventDefault()
        this.setState({ isQuestions: e.target.checked })
    };

    handleSubmit = () => {
        this.setState({ activePage: 1 });
        setTimeout(() => {
            this.getProductsList();
        }, 500);
    }

    handleReset = () => {
        window.location.reload();
    }

    handleSwitchChange = async (value, item) => {
        const { authToken } = this.props;
        const { currentProduct } = this.state;
        var data = {
            id: currentProduct.id,
            name: currentProduct.name,
            status: !currentProduct.status,
            isQuestions: currentProduct.isQuestions,
            type: "updateStatus"
        }
        await editProduct(authToken, data).then(result => {
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
            this.getProductsList();
        }, 500);
    }

    handleEditProductSubmit = async (values, setSubmitting) => {
        const { authToken } = this.props;
        const { currentProduct } = this.state;
        var postdata = { id: currentProduct.id, ...values };
        postdata.name = values.name.trim()

        if (values.image_url) {
            const data = new FormData();

            data.append('file', values.image_url)

            delete postdata.image_url;

            editProduct(authToken, postdata).then(result => {
                setSubmitting(false);
                if (result.data.success) {
                    var qData = currentProduct.id;
                    editProductImg(authToken, data, qData).then(result => {
                        this.handleClose();
                        toast.success(result.data.message, {
                            className: "green-css"
                        });
                    }).catch(err => console.log(err))
                }

            }).catch(errors => {
                setSubmitting(false);
                this.handleClose();
                var msg = errors.response ? errors.response.data.message : errors.message;
                toast.error(msg, {
                    className: "red-css"
                });
            });
        } else {
            await editProduct(authToken, postdata).then(result => {
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
        }

        setTimeout(() => {
            this.getProductsList();
        }, 500);
    }

    handleAddProductSubmit = async (values, setSubmitting) => {
        const { authToken } = this.props;
        var postdata = values;
        postdata.name = values.name.trim();

        if (values.image_url) {
            const data = new FormData();

            if (values.image_url) {
                data.append('file', values.image_url)
            }

            delete postdata.image_url;

            await addProduct(authToken, postdata).then(result => {
                setSubmitting(false);
                if (result.data.success) {
                    var qData = result.data.payload && result.data.payload.product_id
                    addProductImg(authToken, data, qData).then(result => {
                        this.handleClose();
                        toast.success(result.data.message, {
                            className: "green-css"
                        });
                    }).catch(err => console.log(err))
                }

            }).catch(errors => {
                setSubmitting(false);
                this.handleClose();
                var msg = errors.response ? errors.response.data.message : errors.message;
                toast.error(msg, {
                    className: "red-css"
                });
            });
        } else {
            await addProduct(authToken, postdata).then(result => {
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
        }
        setTimeout(() => {
            this.getProductsList();
        }, 500);
    }

    handleDelete = async (event) => {
        this.setState({ disabledBtn: true });
        const { authToken } = this.props;
        var data = {
            id: this.state.currentProduct.id
        }
        await deleteProduct(authToken, data).then(result => {
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
            this.getProductsList();
        }, 500);

    }

    renderModalBody = () => {
        const { isFocus, modalType, currentProduct, disabledBtn, brandData, isQuestions } = this.state;
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
                        <Modal.Title style={{ fontWeight: 700 }}>{modalType} Product</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Formik
                        validate={values => {
                            const errors = {};

                            if (values.name.trim().length <= 0) {
                                errors.name = "Please provide valid name"
                            }
                            if (values.description.trim().length <= 0) {
                                errors.description = "Please provide valid description"
                            }
                            if (!values.amount) {
                                errors.amount = "Please provide valid amount";
                            }
                            if (!values.brand_id) {
                                errors.brand_id = "Please select valid brand";
                            }

                            return errors;
                        }}
                        enableReinitialize
                        onSubmit={(values, { setStatus, setSubmitting }) => {

                            if (isEdit) {
                                this.handleEditProductSubmit(values, setSubmitting);
                            } else {
                                this.handleAddProductSubmit(values, setSubmitting);
                            }

                        }}
                        validateOnChange={false}
                        validateOnBlur={false}
                        initialValues={{
                            name: isEdit ? currentProduct && currentProduct.name : '',
                            description: isEdit ? currentProduct && currentProduct.description : '',
                            amount: isEdit ? currentProduct && currentProduct.amount : '',
                            brand_id: isEdit ? currentProduct && currentProduct.brand_id : '',
                            image_url: isEdit ? currentProduct && currentProduct.image_url : null,
                            isQuestions: isEdit ? currentProduct && currentProduct.isQuestions : 0,
                        }}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            values,
                            errors,
                            touched,
                            status,
                            isSubmitting,
                            ...props
                        }) => (
                            <Form noValidate={true}
                                onSubmit={handleSubmit}
                            >
                                <Modal.Body className="pt-0">
                                    <div className='fv-row mb-4'>
                                        <label className='form-label mb-0 fw-600 text-dark'>Product name</label>
                                        <input
                                            required
                                            placeholder='Product name'
                                            className={clsx(
                                                'form-control form-control-solid',
                                                { 'is-invalid': touched.name && errors.name },
                                                {
                                                    'is-valid': touched.name && !errors.name,
                                                }
                                            )}
                                            type='text'
                                            name='name'
                                            autoComplete='off'
                                            onFocus={() => this.changeFocus()}
                                            onChange={handleChange}
                                            value={values.name}
                                        />
                                        {touched.name && errors.name && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.name}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='fv-row mb-4'>
                                        <label className='form-label mb-0 fw-600 text-dark'>Product description</label>
                                        <input
                                            required
                                            placeholder='Product description'
                                            className={clsx(
                                                'form-control form-control-solid',
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
                                    <div className='fv-row mb-4'>
                                        <label className='form-label mb-0 fw-600 text-dark'>Select Brand</label>
                                        <select
                                            className={clsx(
                                                'form-control',
                                                { 'is-invalid': touched.brand_id && errors.brand_id },
                                                {
                                                    'is-valid': touched.brand_id && !errors.brand_id,
                                                }
                                            )}
                                            type={"text"}
                                            name={"brand_id"}
                                            value={values.brand_id}
                                            onChange={handleChange}
                                        >
                                            <option>Select Brand</option>
                                            {brandData?.map((item, index) =>
                                                <option value={item.id} key={item.id}>{item.name}</option>
                                            )}
                                        </select>
                                        {touched.brand_id && errors.brand_id && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.brand_id}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='fv-row mb-4'>
                                        <label className='form-label mb-0 fw-600 text-dark'>Product amount</label>
                                        <input
                                            required
                                            placeholder='Product amount'
                                            className={clsx(
                                                'form-control form-control-solid',
                                                { 'is-invalid': touched.amount && errors.amount },
                                                {
                                                    'is-valid': touched.amount && !errors.amount,
                                                }
                                            )}
                                            type='number'
                                            name='amount'
                                            autoComplete='off'
                                            onFocus={() => this.changeFocus()}
                                            onChange={handleChange}
                                            value={values.amount}
                                        />
                                        {touched.amount && errors.amount && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.amount}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="fv-row mb-4 ml-4">
                                        <input
                                            name="isQuestions"
                                            onChange={(e) => {
                                                props.setFieldValue("isQuestions", e.target.checked)
                                            }}
                                            type="checkbox"
                                            checked={values.isQuestions}
                                            className={"form-check-input mt-2 text-dark"}
                                        />
                                        <label className="control-label text-dark">Questionnaires</label>
                                    </div>
                                    <div className='fv-row mb-4'>
                                        <label className='form-label mb-0 fw-600 text-dark'>Product image</label>
                                        <DropzoneArea
                                            dropzoneText={(isEdit && currentProduct.image_url) ?
                                                "Drag and drop a image here for replacing your existing thumbnail" :
                                                "Drag and drop a image here or click"}
                                            dropzoneClass={status ? "dropzone dropzone-default min-drop p-2 custom-border" : "dropzone dropzone-default min-drop p-2"}
                                            dropzoneParagraphClass={status ? "dropzone-msg-title custom-border" : "dropzone-msg-title"}
                                            acceptedFiles={['image/*']}
                                            filesLimit={1}
                                            getPreviewIcon={handlePreviewIcon}
                                            showAlerts={['error']}
                                            onChange={(files) => props.setFieldValue("image_url", files[0])}
                                        />
                                        {status && (<div className="invalid-msg">{status}</div>)}
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
                </div >
            );
        } else if (modalType === "Delete") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }}>Delete Product</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Form noValidate>
                        <Modal.Body>
                            <Form.Group as={Col} md="12" className={"text-center"}>
                                <Form.Label style={{ fontWeight: 400 }}>Are you sure you want to delete
                                    this product with <b>{currentProduct && currentProduct.name}</b> ?</Form.Label>
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
                        <Modal.Title style={{ fontWeight: 700 }} className="text-dark">Change Product Status</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Form noValidate>
                        <Modal.Body>
                            <Form.Group as={Col} md="12" className={"text-center"}>
                                <Form.Label style={{ fontWeight: 400 }} className="text-muted">Are you sure you want to {currentProduct.status === 0 ? <b>Activate </b> : <b>Deactivate </b>}
                                    this Product with <b>{currentProduct && currentProduct.name}</b> ?</Form.Label>
                            </Form.Group>
                        </Modal.Body>
                        <hr className="line-style" />
                        <Modal.Footer>
                            {currentProduct.status === 0 ?
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

    handleStatus = (value) => {
        this.setState({ status: value });
        setTimeout(() => {
            this.getProductsList();
        }, 500);
    }

    handleBrandStatus = (value) => {
        this.setState({ brand_id: value ? value : "" });
        setTimeout(() => {
            this.getProductsList();
        }, 500);
    }

    render() {
        const { productData, productCount, activePage, brandData,
            limit, searchValue, loading, isFocus } = this.state;
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
                                    <Dropdown drop="down" className={'mr-3'}>
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
                                            Brands</Dropdown.Toggle>
                                        <Dropdown.Menu className="max-h-300px overflow-auto">
                                            {brandData?.map((item, index) =>
                                                <Dropdown.Item onClick={() => this.handleBrandStatus(item.id)} key={item.id}>{item.name}</Dropdown.Item>
                                            )}
                                            <Dropdown.Item onClick={() => this.handleBrandStatus()}>All</Dropdown.Item>
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
                                            Add Product
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <ToastContainer />
                <Portlet className={'bg-transparent shadow-none'}>
                    <PortletBody className={'px-4'}>
                        {loading ? <div className="text-center py-3" ><CircularProgress />
                        </div> :
                            <div className="row">
                                {productData.length > 0 ?
                                    productData?.map((item, index) =>
                                        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6" key={item.id}>
                                            <div className="card card-custom gutter-b card-stretch">
                                                <div className="card-body pt-0">
                                                    <div className="d-flex justify-content-end py-2">
                                                        <Dropdown className="kt-header__topbar-item kt-header__topbar-item--user cursor-pointer cus-dropdown-bg" drop="down" alignRight>
                                                            <Dropdown.Toggle variant="info" as={HeaderDropdownToggle}>
                                                                <MoreHoriz />
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu className="edit-options">
                                                                <div className="d-flex align-items-center px-4 py-2"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        if (item.status === 1) {
                                                                            this.handleModal("Edit", item);
                                                                        }
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
                                                    <div className="d-flex align-items-center">
                                                        <div className="mt-lg-0 mt-3 text-center w-100">
                                                            {item.image_url ?
                                                                <img src={item.image_url} className={'w-100 h-185px rounded'} alt='Metronic' />
                                                                :
                                                                <img src={('/media/no-image.jpg')} className={'w-100 h-185px rounded border object-fit-contain'} alt='Metronic' />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-dark font-weight-bold mr-2">Name:</span>
                                                            <span className="text-muted">{item.name}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-dark font-weight-bold mr-2">Amount:</span>
                                                            <span className="text-muted">RM {item.amount}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-cente mb-3">
                                                            <span className="text-dark font-weight-bold mr-2">Status:</span>
                                                            <h5 className={'font-weight-bold Status_activation'}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    this.handleModal("ActiveStatus", item)
                                                                }}
                                                            >
                                                                {item.status === 1 ? <span className={'text-success border-bottom border-success'}>Active</span> : <span className={'text-danger border-bottom border-danger'}>Deactive</span>}
                                                            </h5>
                                                        </div>
                                                        <div className="d-flex flex-column justify-content-between mb-3">
                                                            <span className="text-dark font-weight-bold mr-2">Description:</span>
                                                            <span className="text-muted">{item.description}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                    :
                                    <div className="col-md-6 col-lg-4 mx-auto text-center mt-5">
                                        <div className="card card-custom text-center py-5 border-doted-dark bg-transparent">
                                            <div className="card-body">
                                                <span className="bg-light-danger p-3 text-dark rounded">
                                                    <Category />
                                                </span>
                                                <h3 className="text-dark mb-0 mt-4">No Products have been Found</h3>
                                                <span className="mt-2">Simply click above button to add new product</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </PortletBody>
                </Portlet>


                {(productCount > limit) &&
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center px-4 cus-pagination">
                        <h5 className="text-dark mb-3 mb-md-0">{paginationTexts(activePage, productCount, limit)}</h5>
                        <Pagination
                            bsSize={'medium'}
                            activePage={activePage}
                            itemsCountPerPage={limit}
                            totalItemsCount={productCount}
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

export default connect(mapStateToProps)(Products);