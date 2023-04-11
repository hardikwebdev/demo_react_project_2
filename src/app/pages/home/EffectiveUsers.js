/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { createRef } from "react";
import { Table, Dropdown, Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import {
    Portlet,
    PortletBody
} from "../../partials/content/Portlet";
import { getEffectiveUsersList, exportEffectiveUsersCSV } from "../../crud/auth.crud";
import { TitleComponent } from "../FormComponents/TitleComponent";
import Pagination from 'react-js-pagination';
import { Person } from '@material-ui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { paginationTexts } from '../../../_metronic/utils/utils';
import { CircularProgress } from '@material-ui/core';
import {Formik} from 'formik';
import clsx from "clsx";
import moment from "moment";

class EffectiveUsers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            effectiveUsersData: [],
            effectiveUsersCount: 0,
            searchValue: "",
            limit: 25,
            status: "",
            sortBy: 'createdAt',
            sortOrder: 'DESC',
            activePage: 1,
            isFocus: false,
            loading: false,
            dloading: false,
            isEffective: ''
        };
        this.inputRef = createRef();

    }


    componentDidMount = async () => {
        this.getEffectiveUsersList();
    }

    getEffectiveUsersList = async (searchData) => {
        this.setState({ dloading: true });
        const { authToken } = this.props;

        var limitV = this.state.limit;
        var sortByV = this.state.sortBy;
        var sortOrderV = this.state.sortOrder;
        var activePage = this.state.activePage;
        var search = (this.state.searchValue !== undefined) ? this.state.searchValue : null;
        var isEffective = (this.state.isEffective != 2) ? this.state.isEffective : null;
        await getEffectiveUsersList(authToken, search, limitV, sortByV,
            sortOrderV, activePage, isEffective).then(result => {
                this.setState({
                    dloading: false,
                    effectiveUsersData: result.data.payload ? result.data.payload.effectiveData : [],
                    effectiveUsersCount: result.data.payload && result.data.payload.effectiveCount
                });

            }).catch(err => {
                this.setState({
                    dloading: false,
                    effectiveUsersData: [],
                    effectiveUsersCount: 0
                });
                if (err.response && (err.response.data.message === "jwt expired")) {
                    window.location.href = "/admin/logout";
                }
            });
    }

    clear = () => {
        this.setState({ searchValue: "" });
        setTimeout(() => {
            this.getEffectiveUsersList();
        }, 500);
    };

    handleSearchChange = event => {
        this.setState({ searchValue: event.target.value });
        if (event.target.value.length === 0) {
            this.getEffectiveUsersList();
        }
    };

    handleStatus = (value) => {
        this.setState({ isEffective: value });
        setTimeout(() => {
            this.getEffectiveUsersList();
        }, 500);
    }

    handleSelect = (number) => {
        this.setState({ activePage: number });
        setTimeout(() => {
            this.getEffectiveUsersList();
        }, 500);
    }

    changeFocus = () => {
        this.setState({ isFocus: true });
    }

    handleSubmit = () => {
        this.setState({ activePage: 1 });
        setTimeout(() => {
            this.getEffectiveUsersList();
        }, 500);
    }

    handleReset = () => {
        window.location.reload();
    }

    exportEffectiveUsersCSV = async (values, setSubmitting) => {
        const { authToken } = this.props;
        this.setState({ loading: true });
        var data = { ...values }
        await exportEffectiveUsersCSV(authToken, data).then(result => {

            this.setState({ loading: false });
            if (result.data.success === true) {
                var data = result.data.payload.url;

                var a = document.createElement('a');
                a.href = data;
                a.download = "EXPORT_EFFECTIVE_USERS.csv"
                document.body.append(a);
                a.click();
                a.remove();
                toast.success(result.data.message, {
                    className: "green-css"
                });
            } else {
                toast.error(result.data.message, {
                    className: "red-css"
                });
            }
        }).catch(err => {
            var msg = err.response ? err.response.message : err.message;
            toast.error(msg, {
                className: "red-css"
            });
            this.setState({ loading: false });
        });
    }

    render() {
        const { effectiveUsersData, effectiveUsersCount, activePage, limit, searchValue, isFocus, loading, dloading } = this.state;
        const customStyle = isFocus ? styleSearch
            : { borderWidth: 2 };

        return (
            <div>
                <TitleComponent title={this.props.title} icon={this.props.icon} />
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
                                    <Dropdown drop="down">
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Contact Type</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => this.handleStatus(1)}>Effective Users</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(0)}>Non-Effective Users</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(2)}>All</Dropdown.Item>
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
                                    const errors = {};
                                    var maxDate = null;

                                    if (values.start_date.trim().length <= 0) {
                                        errors.start_date = "Please provide valid start date";
                                    } else {
                                        maxDate = moment(values.start_date).add(30, 'days').format('YYYY-MM-DD hh:mm:ss');
                                    }

                                    if (values.end_date.trim().length <= 0) {
                                        errors.end_date = "Please provide valid end date";
                                    } else if (new Date(maxDate).getTime() < new Date(values.end_date).getTime()) {
                                        errors.end_date = "End date can't be greater than 30 days from selected start date";
                                    }

                                    return errors;
                                }}
                                enableReinitialize
                                onSubmit={(values, { setStatus, setSubmitting }) => {
                                    this.exportEffectiveUsersCSV(values, setSubmitting);
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
                                        <div className='row fv-row mb-1'>
                                            <div className="col-md-3">
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
                                                    onChange={(e) => {
                                                        props.setFieldValue('start_date', e.target.value);
                                                        props.setFieldValue('end_date', moment(e.target.value).add(30, 'days').format('yyyy-MM-DD'));
                                                    }}
                                                />
                                                {touched.start_date && errors.start_date && (
                                                    <div className='fv-plugins-message-container'>
                                                        <span role='alert'>{errors.start_date}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-3">
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
                                            <div className="mr-2 ml-auto">
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className='btn btn-primary btn-elevate kt-login__btn-warning'
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
                        </div> : <Table striped responsive bordered hover className="table-list-header m-0">
                            <thead>
                                <tr>
                                    <th><b>Project Name</b>
                                    </th>
                                    <th><b>Outlet Name</b>
                                    </th>
                                    <th><b>User Name</b>
                                    </th>
                                    <th><b>Customer Basic Info</b>
                                    </th>
                                    <th><b>Brand Variant</b>
                                    </th>
                                    <th><b>Effective Contact</b>
                                    </th>
                                    <th><b>Effective Contact Info</b>
                                    </th>
                                    <th><b>Contact Tags</b>
                                    </th>

                                </tr>
                            </thead>

                            <tbody>
                                {effectiveUsersData.length > 0 ?
                                    effectiveUsersData.map((item, index) =>
                                        <tr key={item.id}>
                                            <td>
                                                <h6 className={'font-weight-bold text-muted'}>{item.Project ? item.Project.title : "-"}</h6>
                                            </td>
                                            <td>
                                                <h6 className={'font-weight-bold text-muted'}>{item.Outlet ? item.Outlet.outlet_name : "-"}</h6>
                                                <div className={'text-muted text-left'}>{item.Outlet.address}</div>
                                            </td>
                                            <td>
                                                <h6 className={'font-weight-bold text-muted'}>{item.User ? item.User.username + "(" + item.User.system_id + ")" : "-"}</h6>
                                            </td>
                                            <td>
                                                <h6 className={'font-weight-bold text-muted'}>{item.gender + "(" + item.age_group + ")"}</h6>
                                                <div className={'text-muted text-left'}>{item.group_segment}</div>
                                                <div className={'text-muted text-left'}>{item.race_group}</div>
                                            </td>
                                            <td>
                                                <h6 className={'font-weight-bold text-muted'}>{item.brands_variant.length > 0 ?
                                                    item.brands_variant.map((items, indx) => {
                                                        return <span key={indx}>{(item.brands_variant.length - 1 == indx) ? items : items
                                                            + ", "}</span>
                                                    }) : <div className={'text-muted text-center'}>-</div>}
                                                </h6>
                                            </td>
                                            <td>
                                                <h6 className={'font-weight-bold text-muted'}>{item.isEffective == 0 ? "No" : "Yes"}</h6>
                                            </td>
                                            <td>
                                                {item.effective_email ?
                                                    <><h6 className={'font-weight-bold text-muted'}>{item.effective_name + " (" + item.effective_contact + ")"}</h6>
                                                        <h6 className={'text-muted'}>{item.effective_email}</h6>
                                                    </> : <div className={'text-muted text-center'}>-</div>}
                                            </td>
                                            <td>
                                                <h6 className={'font-weight-bold text-muted'}>
                                                    {item.contact_tags && item.contact_tags.length > 0 ?
                                                        item.contact_tags.map((items, indx) => {
                                                            return <span key={indx}>{(item.contact_tags.length - 1 == indx) ? items : items
                                                                + ", "}</span>
                                                        }) : <div className={'text-muted text-center'}>-</div>}
                                                </h6>
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

                {(effectiveUsersCount > limit) &&
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center px-4 cus-pagination">
                        <h5 className="text-dark mb-3 mb-md-0">{paginationTexts(activePage, effectiveUsersCount, limit)}</h5>
                        <Pagination
                            bsSize={'medium'}
                            activePage={activePage}
                            itemsCountPerPage={limit}
                            totalItemsCount={effectiveUsersCount}
                            pageRangeDisplayed={5}
                            onChange={this.handleSelect}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                    </div>}
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

export default connect(mapStateToProps)(EffectiveUsers);