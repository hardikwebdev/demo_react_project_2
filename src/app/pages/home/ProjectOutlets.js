import React, { createRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
    Portlet,
    PortletBody,
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
    getAllList, assignOutlet, unassignOutlet, getProjectOutletList,
} from "../../crud/auth.crud";
import Multiselect from 'multiselect-react-dropdown';
import { PlaceSharp } from '@material-ui/icons';
import { TitleComponent } from "../FormComponents/TitleComponent";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ProjectOutlets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            show: false,
            modalType: "",
            type: "",
            outletData: [],
            allOutlets: [],
            project_name: "",
            selectedDay: "",
            allOutletsArr: [],
            sundayArr: [],
            tuesdayArr: [],
            wedArr: [],
            thursdayArr: [],
            fridayArr: [],
            saturdayArr: [],
            currentSelected: null
        };
        this.inputRef = createRef();
    }


    componentDidMount = async () => {
        if (this.props && this.props.location && this.props.location.state) {
            this.setState({
                project_id: this.props.location.state.id, project_name: this.props.location.state.project_name
            });
            setTimeout(() => {
                this.getOutletList();
            }, 1000);

        } else {
            this.getOutletList();
        }
        this.getAllList();
    }

    getOutletList = async (searchData) => {
        const { authToken } = this.props;
        var project_id = this.state.project_id;
        await getProjectOutletList(authToken, project_id).then(async result => {
            var data = result.data.payload;
            var sundayArr = [];
            var tuesdayArr = [];
            var wedArr = [];
            var thursdayArr = [];
            var fridayArr = [];
            var saturdayArr = [];
            await data.map(item => {
                if (item.day === "sunday") {
                    sundayArr = item.Outlets;
                } else if (item.day === "tuesday") {
                    tuesdayArr = item.Outlets;
                } else if (item.day === "wednesday") {
                    wedArr = item.Outlets;
                } else if (item.day === "thursday") {
                    thursdayArr = item.Outlets;
                } else if (item.day === "friday") {
                    fridayArr = item.Outlets;
                } else if (item.day === "saturday") {
                    saturdayArr = item.Outlets;
                }
            });
            this.setState({
                outletData: result.data.payload ? result.data.payload : [],
                sundayArr, tuesdayArr, wedArr, thursdayArr, fridayArr, saturdayArr
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

    getAllList = async (searchData) => {
        const { authToken } = this.props;
        await getAllList(authToken).then(result => {
            this.setState({
                allOutlets: result.data.payload ? result.data.payload.data.rows : [],
                allOutletsArr: result.data.payload ? result.data.payload.data.rows : [],
            });

        }).catch(err => {
            this.setState({
                allOutlets: [],
            });
            if (err.response && (err.response.data.message === "jwt expired")) {
                window.location.href = "/admin/logout";
            }
        });
    }

    handleModal = (value, day, currentSelected) => {
        if (value === "Assign") {
            const { allOutlets, outletData, allOutletsArr } = this.state;

            var s = outletData?.map((item) => {
                if (item.day === day) {
                    return item;
                }
            }).filter(item => item != undefined);
            const result = allOutletsArr.filter((item) => item?.outlet_days?.includes(day));
            const result1 = s.length > 0 ? result.filter(item1 =>
                !s[0].Outlets.some(item2 => (item2.id === item1.id))) : result;

            this.setState({ modalType: value, show: true, selectedDay: day, allOutlets: result1 });
        } else {
            this.setState({ modalType: value, show: true, selectedDay: day, currentSelected });
        }
    }

    handleClose = () => {
        this.setState({ show: false });
    }

    handleAddSubmit = async (values, setSubmitting) => {
        const { authToken } = this.props;
        const { project_id, selectedDay } = this.state;
        var postdata = { ...values, project_id, selectedDay };
        await assignOutlet(authToken, postdata).then(result => {
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
            this.getOutletList();
        }, 500);
    }

    handleDelete = async (event) => {
        const { authToken } = this.props;
        var data = {
            id: this.state.currentSelected.id,
            project_id: this.state.project_id,
            day: this.state.selectedDay
        }
        await unassignOutlet(authToken, data).then(result => {
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
            this.getOutletList();
        }, 500);

    }

    renderModalBody = () => {
        const { allOutlets, project_name, modalType, currentSelected } = this.state;

        if (modalType === "Assign") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }}>Asign Outlets to Project</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Formik
                        validate={values => {
                            const errors = {};

                            if (values.outlets.length <= 0) {
                                errors.outlets = "Please select atleast one outlet"
                            }

                            return errors;
                        }}
                        enableReinitialize
                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            this.handleAddSubmit(values, setSubmitting);
                        }}
                        validateOnChange={false}
                        validateOnBlur={false}
                        initialValues={{
                            title: project_name,
                            outlets: [],
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
                                        <label className='form-label mb-0 fw-600 text-dark'>Select Outlets</label>
                                        <Multiselect
                                            style={{
                                                searchBox: {
                                                    border: (touched.outlets && errors.outlets) ? '1px solid #fd397a' : (touched.outlets
                                                        && !errors.outlets) ? '1px solid #0abb87' : '1px solid #dee2e6',
                                                    borderRadius: '3px',
                                                },
                                                chips: {
                                                    marginBottom: '0px'
                                                }
                                            }}
                                            options={allOutlets}
                                            selectedValues={values.outlets}
                                            onSelect={(e) => props.setFieldValue("outlets", e)}
                                            onRemove={(e) => props.setFieldValue("outlets", e)}
                                            displayValue={'outlet_name'}
                                        />
                                        {touched.outlets && errors.outlets && (
                                            <div className='fv-plugins-message-container'>
                                                <span role='alert'>{errors.outlets}</span>
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
                </div>
            );
        } else if (modalType === "Delete") {
            return (
                <div>
                    <Modal.Header closeButton style={{ padding: '0px 0px 0px 20px' }}>
                        <Modal.Title style={{ fontWeight: 700 }}>Delete Outlet</Modal.Title>
                    </Modal.Header>
                    <hr style={{ borderWidth: 2 }} />
                    <Form noValidate>
                        <Modal.Body>
                            <Form.Group as={Col} md="12" className={"text-center"}>
                                <Form.Label style={{ fontWeight: 400 }}>Are you sure you want to delete
                                    this outlet from project <b>{project_name}</b> ?</Form.Label>
                            </Form.Group>
                        </Modal.Body>
                        <hr className="line-style" />
                        <Modal.Footer>
                            <Button className="ml-auto mr-3 w-auto" variant="danger"
                                onClick={(e) => this.handleDelete(e)}>
                                Delete
                            </Button>
                        </Modal.Footer>
                    </Form>
                </div>
            );
        }
    }

    render() {
        const { outletData, loading, project_name, sundayArr, tuesdayArr, wedArr, thursdayArr, fridayArr, saturdayArr } = this.state;

        return (
            <div>
                <TitleComponent title={this.props.title} icon={this.props.icon} />
                <div className="row">
                    <div className="col-md-12">
                        <div className="kt-section bg-white px-4 py-2 border-top">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <button type="button" className='btn btn-primary btn-elevate kt-login__btn-primary'
                                        onClick={() => this.props.history.goBack()}>
                                        <i className="flaticon2-left-arrow mr-2 font-15" />Back
                                    </button>
                                </div>
                                <div className="font-weight-bold font-25  text-center col-10">
                                    {project_name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />

                <Portlet className={'bg-transparent'}>
                    <PortletBody className={'px-4'}>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="card card-custom gutter-b card-stretch">
                                    <div className="card-body pt-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h3 className="text-dark font-weight-bold mb-0">Sunday</h3>

                                            <div className="mr-2 ml-auto">
                                                <button
                                                    disabled={loading}
                                                    className='btn btn-primary btn-elevate kt-login__btn-warning'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.handleModal("Assign", "sunday");
                                                    }
                                                    }
                                                >
                                                    {loading && <i style={{ margin: '0px 5px' }}
                                                        className={'kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light'} />}
                                                    Assign Outlet
                                                </button>
                                            </div>
                                        </div>
                                        <div className="overflow-auto h-300px">
                                            {sundayArr.length > 0 ?
                                                sundayArr?.map((item, index) =>
                                                    <div className="mt-4" id="accordion" key={item.id}>
                                                        <div className={clsx("d-flex align-items-center px-3 py-2", (index % 2 === 0) ? "bg-light-primary" : "bg-light-success")}>
                                                            <div className="mr-4 mt-lg-0 mt-3">
                                                                <div className="w-40">

                                                                    {item.outlet_url ?
                                                                        <img src={item.outlet_url} className={'rounded-circle h-40'} alt='Metronic' />
                                                                        :
                                                                        <img src={('/media/location-circle.png')} className={'rounded-circle'} alt='Metronic' />
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <h3 className="text-dark font-weight-bold mb-0">{item.outlet_name}</h3>
                                                                <span className="text-dark mb-0">{item.address}</span>
                                                            </div>
                                                            <button className="btn bg-transparent shadow-none text-dark ml-auto cus-arrow" data-toggle="collapse" data-target={'#sunday' + item.id} aria-expanded="false" aria-controls={'sunday' + item.id}>
                                                                <i className="fas fa-chevron-down arrow-down pr-0"></i>
                                                            </button>
                                                        </div>
                                                        <div id={'sunday' + item.id} className="collapse p-4" aria-labelledby="headingOne" data-parent="#accordion">
                                                            <div className="d-flex justify-content-between">
                                                                <div className="d-flex flex-column mb-3">
                                                                    <span className="text-dark font-weight-bold mr-2">Owner:</span>
                                                                    <span className="text-muted">{item.owner_name + "(" + item.owner_contact + ")"}</span>
                                                                    <span className="text-muted">{item.owner_email}</span>
                                                                </div>
                                                                <div className="d-flex flex-column mb-3">
                                                                    <span className="text-dark font-weight-bold mr-2">Person Incharge:</span>
                                                                    <span className="text-muted">{item.person_name + "(" + item.person_contact + ")"}</span>
                                                                    <span className="text-muted">{item.person_email}</span>
                                                                </div>

                                                                <div className="d-flex mb-3">
                                                                    <OverlayTrigger
                                                                        placement="left"
                                                                        overlay={<Tooltip id="documentations-tooltip">Remove Outlet from project</Tooltip>}>
                                                                        <a className="kt-menu__link-icon flaticon2-rubbish-bin-delete-button text-danger" 
                                                                            style={{ fontSize: '1.3rem' }}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                this.handleModal("Delete", "sunday", item)
                                                                            }}></a>
                                                                    </OverlayTrigger>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                <div className="col-lg-8 mx-auto text-center mt-5">
                                                    <div className="card card-custom text-center py-5 border-doted-dark bg-transparent">
                                                        <div className="card-body">
                                                            <span className="bg-light-danger p-3 text-dark rounded">
                                                                <PlaceSharp className="text-dark font-25" />
                                                            </span>
                                                            <h3 className="text-dark mb-0 mt-4">No Outlets have been assigned</h3>
                                                            <span className="mt-2">Simply click above button to assign outlet</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="card card-custom gutter-b card-stretch">
                                    <div className="card-body pt-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h3 className="text-dark font-weight-bold mb-0">Tuesday</h3>
                                            <div className="mr-2 ml-auto">
                                                <button
                                                    disabled={loading}
                                                    className='btn btn-primary btn-elevate kt-login__btn-warning'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.handleModal("Assign", "tuesday");
                                                    }
                                                    }
                                                >
                                                    {loading && <i style={{ margin: '0px 5px' }}
                                                        className={'kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light'} />}
                                                    Assign Outlet
                                                </button>
                                            </div>

                                        </div>
                                        <div className="overflow-auto h-300px">
                                            {tuesdayArr.length > 0 ?
                                                tuesdayArr?.map((item, index) =>
                                                    <div className="mt-4" id="accordion" key={item.id}>
                                                        <div className={clsx("d-flex align-items-center px-3 py-2", (index % 2 === 0) ? "bg-light-primary" : "bg-light-success")}>
                                                            <div className="mr-4 mt-lg-0 mt-3">
                                                                <div className="w-40">

                                                                    {item.outlet_url ?
                                                                        <img src={item.outlet_url} className={'rounded-circle h-40'} alt='Metronic' />
                                                                        :
                                                                        <img src={('/media/location-circle.png')} className={'rounded-circle'} alt='Metronic' />
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <h3 className="text-dark font-weight-bold mb-0">{item?.outlet_name}</h3>
                                                                <span className="text-dark mb-0">{item.address}</span>
                                                            </div>
                                                            <button className="btn bg-transparent shadow-none text-dark ml-auto cus-arrow" data-toggle="collapse" data-target={'#tuesday' + item.id} aria-expanded="false" aria-controls={'tuesday' + item.id}>
                                                                <i className="fas fa-chevron-down arrow-down pr-0"></i>
                                                            </button>
                                                        </div>
                                                        <div id={'tuesday' + item.id} className="collapse p-4" aria-labelledby="headingOne" data-parent="#accordion">
                                                            <div className="d-flex justify-content-between">
                                                                <div className="d-flex flex-column mb-3">
                                                                    <span className="text-dark font-weight-bold mr-2">Owner:</span>
                                                                    <span className="text-muted">{item.owner_name + "(" + item.owner_contact + ")"}</span>
                                                                    <span className="text-muted">{item.owner_email}</span>
                                                                </div>
                                                                <div className="d-flex flex-column mb-3">
                                                                    <span className="text-dark font-weight-bold mr-2">Person Incharge:</span>
                                                                    <span className="text-muted">{item.person_name + "(" + item.person_contact + ")"}</span>
                                                                    <span className="text-muted">{item.person_email}</span>
                                                                </div>

                                                                <div className="d-flex mb-3">
                                                                    <OverlayTrigger
                                                                        placement="left"
                                                                        overlay={<Tooltip id="documentations-tooltip">Remove Outlet from project</Tooltip>}>
                                                                        <a className="kt-menu__link-icon flaticon2-rubbish-bin-delete-button text-danger" 
                                                                            style={{ fontSize: '1.3rem' }}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                this.handleModal("Delete", "tuesday", item)
                                                                            }}></a>
                                                                    </OverlayTrigger>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                <div className="col-lg-8 mx-auto text-center mt-5">
                                                    <div className="card card-custom text-center py-5 border-doted-dark bg-transparent">
                                                        <div className="card-body">
                                                            <span className="bg-light-danger p-3 text-dark rounded">
                                                                <PlaceSharp className="text-dark font-25" />
                                                            </span>
                                                            <h3 className="text-dark mb-0 mt-4">No Outlets have been assigned</h3>
                                                            <span className="mt-2">Simply click above button to assign outlet</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="card card-custom gutter-b card-stretch">
                                    <div className="card-body pt-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h3 className="text-dark font-weight-bold mb-0">Wednesday</h3>

                                            <div className="mr-2 ml-auto">
                                                <button
                                                    disabled={loading}
                                                    className='btn btn-primary btn-elevate kt-login__btn-warning'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.handleModal("Assign", "wednesday");
                                                    }
                                                    }
                                                >
                                                    {loading && <i style={{ margin: '0px 5px' }}
                                                        className={'kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light'} />}
                                                    Assign Outlet
                                                </button>
                                            </div>
                                        </div>
                                        <div className="overflow-auto h-300px">
                                            {wedArr.length > 0 ?
                                                wedArr?.map((item, index) =>
                                                    <div className="mt-4" id="accordion" key={item.id}>
                                                        <div className={clsx("d-flex align-items-center px-3 py-2", (index % 2 === 0) ? "bg-light-primary" : "bg-light-success")}>
                                                            <div className="mr-4 mt-lg-0 mt-3">
                                                                <div className="w-40">

                                                                    {item.outlet_url ?
                                                                        <img src={item.outlet_url} className={'rounded-circle h-40'} alt='Metronic' />
                                                                        :
                                                                        <img src={('/media/location-circle.png')} className={'rounded-circle'} alt='Metronic' />
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <h3 className="text-dark font-weight-bold mb-0">{item.outlet_name}</h3>
                                                                <span className="text-dark mb-0">{item.address}</span>
                                                            </div>
                                                            <button className="btn bg-transparent shadow-none text-dark ml-auto cus-arrow" data-toggle="collapse" data-target={'#wednesday' + item.id} aria-expanded="false" aria-controls={'wednesday' + item.id}>
                                                                <i className="fas fa-chevron-down arrow-down pr-0"></i>
                                                            </button>
                                                        </div>
                                                        <div id={'wednesday' + item.id} className="collapse p-4" aria-labelledby="headingOne" data-parent="#accordion">
                                                            <div className="d-flex justify-content-between">
                                                                <div className="d-flex flex-column mb-3">
                                                                    <span className="text-dark font-weight-bold mr-2">Owner:</span>
                                                                    <span className="text-muted">{item.owner_name + "(" + item.owner_contact + ")"}</span>
                                                                    <span className="text-muted">{item.owner_email}</span>
                                                                </div>
                                                                <div className="d-flex flex-column mb-3">
                                                                    <span className="text-dark font-weight-bold mr-2">Person Incharge:</span>
                                                                    <span className="text-muted">{item.person_name + "(" + item.person_contact + ")"}</span>
                                                                    <span className="text-muted">{item.person_email}</span>
                                                                </div>

                                                                <div className="d-flex mb-3">
                                                                    <OverlayTrigger
                                                                        placement="left"
                                                                        overlay={<Tooltip id="documentations-tooltip">Remove Outlet from project</Tooltip>}>
                                                                        <a className="kt-menu__link-icon flaticon2-rubbish-bin-delete-button text-danger" 
                                                                            style={{ fontSize: '1.3rem' }}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                this.handleModal("Delete", "wednesday", item)
                                                                            }}></a>
                                                                    </OverlayTrigger>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                <div className="col-lg-8 mx-auto text-center mt-5">
                                                    <div className="card card-custom text-center py-5 border-doted-dark bg-transparent">
                                                        <div className="card-body">
                                                            <span className="bg-light-danger p-3 text-dark rounded">
                                                                <PlaceSharp className="text-dark font-25" />
                                                            </span>
                                                            <h3 className="text-dark mb-0 mt-4">No Outlets have been assigned</h3>
                                                            <span className="mt-2">Simply click above button to assign outlet</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="card card-custom gutter-b card-stretch">
                                    <div className="card-body pt-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h3 className="text-dark font-weight-bold mb-0">Thursday</h3>

                                            <div className="mr-2 ml-auto">
                                                <button
                                                    disabled={loading}
                                                    className='btn btn-primary btn-elevate kt-login__btn-warning'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.handleModal("Assign", "thursday");
                                                    }
                                                    }
                                                >
                                                    {loading && <i style={{ margin: '0px 5px' }}
                                                        className={'kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light'} />}
                                                    Assign Outlet
                                                </button>
                                            </div>
                                        </div>
                                        <div className="overflow-auto h-300px">
                                            {thursdayArr.length > 0 ?
                                                thursdayArr?.map((item, index) =>
                                                    <div className="mt-4" id="accordion" key={item.id}>
                                                        <div className={clsx("d-flex align-items-center px-3 py-2", (index % 2 === 0) ? "bg-light-primary" : "bg-light-success")}>
                                                            <div className="mr-4 mt-lg-0 mt-3">
                                                                <div className="w-40">

                                                                    {item.outlet_url ?
                                                                        <img src={item.outlet_url} className={'rounded-circle h-40'} alt='Metronic' />
                                                                        :
                                                                        <img src={('/media/location-circle.png')} className={'rounded-circle'} alt='Metronic' />
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <h3 className="text-dark font-weight-bold mb-0">{item.outlet_name}</h3>
                                                                <span className="text-dark mb-0">{item.address}</span>
                                                            </div>
                                                            <button className="btn bg-transparent shadow-none text-dark ml-auto cus-arrow" data-toggle="collapse" data-target={'#thursday' + item.id} aria-expanded="false" aria-controls={'thursday' + item.id}>
                                                                <i className="fas fa-chevron-down arrow-down pr-0"></i>
                                                            </button>
                                                        </div>
                                                        <div id={'thursday' + item.id} className="collapse p-4" aria-labelledby="headingOne" data-parent="#accordion">
                                                            <div className="d-flex justify-content-between">
                                                                <div className="d-flex flex-column mb-3">
                                                                    <span className="text-dark font-weight-bold mr-2">Owner:</span>
                                                                    <span className="text-muted">{item.owner_name + "(" + item.owner_contact + ")"}</span>
                                                                    <span className="text-muted">{item.owner_email}</span>
                                                                </div>
                                                                <div className="d-flex flex-column mb-3">
                                                                    <span className="text-dark font-weight-bold mr-2">Person Incharge:</span>
                                                                    <span className="text-muted">{item.person_name + "(" + item.person_contact + ")"}</span>
                                                                    <span className="text-muted">{item.person_email}</span>
                                                                </div>

                                                                <div className="d-flex mb-3">
                                                                    <OverlayTrigger
                                                                        placement="left"
                                                                        overlay={<Tooltip id="documentations-tooltip">Remove Outlet from project</Tooltip>}>
                                                                        <a className="kt-menu__link-icon flaticon2-rubbish-bin-delete-button text-danger" 
                                                                            style={{ fontSize: '1.3rem' }}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                this.handleModal("Delete", "thursday", item)
                                                                            }}></a>
                                                                    </OverlayTrigger>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                                : <div className="col-lg-8 mx-auto text-center mt-5">
                                                    <div className="card card-custom text-center py-5 border-doted-dark bg-transparent">
                                                        <div className="card-body">
                                                            <span className="bg-light-danger p-3 text-dark rounded">
                                                                <PlaceSharp className="text-dark font-25" />
                                                            </span>
                                                            <h3 className="text-dark mb-0 mt-4">No Outlets have been assigned</h3>
                                                            <span className="mt-2">Simply click above button to assign outlet</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="card card-custom gutter-b card-stretch">
                                    <div className="card-body pt-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h3 className="text-dark font-weight-bold mb-0">Friday</h3>

                                            <div className="mr-2 ml-auto">
                                                <button
                                                    disabled={loading}
                                                    className='btn btn-primary btn-elevate kt-login__btn-warning'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.handleModal("Assign", "friday");
                                                    }
                                                    }
                                                >
                                                    {loading && <i style={{ margin: '0px 5px' }}
                                                        className={'kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light'} />}
                                                    Assign Outlet
                                                </button>
                                            </div>
                                        </div>
                                        <div className="overflow-auto h-300px">
                                            {fridayArr.length > 0 ?
                                                fridayArr?.map((item, index) =>
                                                    <div className="mt-4" id="accordion" key={item.id}>
                                                        <div className={clsx("d-flex align-items-center px-3 py-2", (index % 2 === 0) ? "bg-light-primary" : "bg-light-success")}>
                                                            <div className="mr-4 mt-lg-0 mt-3">
                                                                <div className="w-40">

                                                                    {item.outlet_url ?
                                                                        <img src={item.outlet_url} className={'rounded-circle h-40'} alt='Metronic' />
                                                                        :
                                                                        <img src={('/media/location-circle.png')} className={'rounded-circle'} alt='Metronic' />
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <h3 className="text-dark font-weight-bold mb-0">{item.outlet_name}</h3>
                                                                <span className="text-dark mb-0">{item.address}</span>
                                                            </div>
                                                            <button className="btn bg-transparent shadow-none text-dark ml-auto cus-arrow" data-toggle="collapse"
                                                                data-target={'#friday' + item.id} aria-expanded="false" aria-controls={'friday' + item.id}>
                                                                <i className="fas fa-chevron-down arrow-down pr-0 arrow-down pr-0"></i>
                                                            </button>
                                                        </div>
                                                        <div id={'friday' + item.id} className="collapse p-4" aria-labelledby="headingOne" data-parent="#accordion">
                                                            <div className="d-flex justify-content-between">
                                                                <div className="d-flex flex-column mb-3">
                                                                    <span className="text-dark font-weight-bold mr-2">Owner:</span>
                                                                    <span className="text-muted">{item.owner_name + "(" + item.owner_contact + ")"}</span>
                                                                    <span className="text-muted">{item.owner_email}</span>
                                                                </div>
                                                                <div className="d-flex flex-column mb-3">
                                                                    <span className="text-dark font-weight-bold mr-2">Person Incharge:</span>
                                                                    <span className="text-muted">{item.person_name + "(" + item.person_contact + ")"}</span>
                                                                    <span className="text-muted">{item.person_email}</span>
                                                                </div>
                                                                <div className="d-flex mb-3">
                                                                    <OverlayTrigger
                                                                        placement="left"
                                                                        overlay={<Tooltip id="documentations-tooltip">Remove Outlet from project</Tooltip>}>
                                                                        <a className="kt-menu__link-icon flaticon2-rubbish-bin-delete-button text-danger" 
                                                                            style={{ fontSize: '1.3rem' }}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                this.handleModal("Delete", "friday", item)
                                                                            }}></a>
                                                                    </OverlayTrigger>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                <div className="col-lg-8 mx-auto text-center mt-5">
                                                    <div className="card card-custom text-center py-5 border-doted-dark bg-transparent">
                                                        <div className="card-body">
                                                            <span className="bg-light-danger p-3 text-dark rounded">
                                                                <PlaceSharp className="text-dark font-25" />
                                                            </span>
                                                            <h3 className="text-dark mb-0 mt-4">No Outlets have been assigned</h3>
                                                            <span className="mt-2">Simply click above button to assign outlet</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="card card-custom gutter-b card-stretch">
                                    <div className="card-body pt-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h3 className="text-dark font-weight-bold mb-0">Saturday</h3>

                                            <div className="mr-2 ml-auto">
                                                <button
                                                    disabled={loading}
                                                    className='btn btn-primary btn-elevate kt-login__btn-warning'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.handleModal("Assign", "saturday");
                                                    }
                                                    }
                                                >
                                                    {loading && <i style={{ margin: '0px 5px' }}
                                                        className={'kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light'} />}
                                                    Assign Outlet
                                                </button>
                                            </div>
                                        </div>
                                        <div className="overflow-auto h-300px">
                                            {saturdayArr.length > 0 ?
                                                saturdayArr?.map((item, index) =>
                                                    <div className="mt-4" id="accordion" key={item.id}>
                                                        <div className={clsx("d-flex align-items-center px-3 py-2", (index % 2 === 0) ? "bg-light-primary" : "bg-light-success")}>
                                                            <div className="mr-4 mt-lg-0 mt-3">
                                                                <div className="w-40">

                                                                    {item.outlet_url ?
                                                                        <img src={item.outlet_url} className={'rounded-circle h-40'} alt='Metronic' />
                                                                        :
                                                                        <img src={('/media/location-circle.png')} className={'rounded-circle'} alt='Metronic' />
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column">
                                                                <h3 className="text-dark font-weight-bold mb-0">{item.outlet_name}</h3>
                                                                <span className="text-dark mb-0">{item.address}</span>
                                                            </div>
                                                            <button className="btn bg-transparent shadow-none text-dark ml-auto cus-arrow" data-toggle="collapse"
                                                                data-target={'#saturday' + item.id} aria-expanded="false" aria-controls={'saturday' + item.id}>
                                                                <i className="fas fa-chevron-down arrow-down pr-0 arrow-down pr-0"></i>
                                                            </button>
                                                        </div>
                                                        <div id={'saturday' + item.id} className="collapse p-4" aria-labelledby="headingOne" data-parent="#accordion">
                                                            <div className="d-flex justify-content-between">
                                                                <div className="d-flex flex-column mb-3">
                                                                    <span className="text-dark font-weight-bold mr-2">Owner:</span>
                                                                    <span className="text-muted">{item.owner_name + "(" + item.owner_contact + ")"}</span>
                                                                    <span className="text-muted">{item.owner_email}</span>
                                                                </div>
                                                                <div className="d-flex flex-column mb-3">
                                                                    <span className="text-dark font-weight-bold mr-2">Person Incharge:</span>
                                                                    <span className="text-muted">{item.person_name + "(" + item.person_contact + ")"}</span>
                                                                    <span className="text-muted">{item.person_email}</span>
                                                                </div>

                                                                <div className="d-flex mb-3">
                                                                    <OverlayTrigger
                                                                        placement="left"
                                                                        overlay={<Tooltip id="documentations-tooltip">Remove Outlet from project</Tooltip>}>
                                                                        <a className="kt-menu__link-icon flaticon2-rubbish-bin-delete-button text-danger" 
                                                                            style={{ fontSize: '1.3rem' }}
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                this.handleModal("Delete", "saturday", item)
                                                                            }}></a>
                                                                    </OverlayTrigger>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                <div className="col-lg-8 mx-auto text-center mt-5">
                                                    <div className="card card-custom text-center py-5 border-doted-dark bg-transparent">
                                                        <div className="card-body">
                                                            <span className="bg-light-danger p-3 text-dark rounded">
                                                                <PlaceSharp className="text-dark font-25" />
                                                            </span>
                                                            <h3 className="text-dark mb-0 mt-4">No Outlets have been assigned</h3>
                                                            <span className="mt-2">Simply click above button to assign outlet</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PortletBody>
                </Portlet>
                <Modal centered size={"lg"} show={this.state.show} onHide={() => {
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

export default withRouter(connect(mapStateToProps)(ProjectOutlets));