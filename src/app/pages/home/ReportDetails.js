/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { createRef } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { updateOrderStatus } from "../../crud/auth.crud";
import moment from 'moment-timezone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ReportDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            details: null,
            project_name: "",
            currentType: "",
            isAdmin: false,
        };
        this.inputRef = createRef();

    }

    componentDidMount = async () => {
        if (this.props && this.props.location && this.props.location.state) {
            this.setState({
                details: this.props.location.state.detail, project_name: this.props.location.state.project_name, isAdmin: this.props.location.state.isAdmin === true ? true : false
            });

        }
    }

    handleOrder = async (e, type) => {
        const { authToken } = this.props;
        const { details } = this.state;
        var data = {
            id: details.id,
            status: type === "Reject" ? 2 : 1
        }
        await updateOrderStatus(authToken, data).then(result => {
            toast.success(result.data.message, {
                className: "green-css"
            });
            this.props.history.goBack();
        }).catch(err => {
            var msg = err.response ? err.response.data.message : err.message;
            toast.error(msg, {
                className: "red-css"
            });
        });
    }

    render() {
        const { details, project_name, isAdmin } = this.state;

        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="kt-section bg-white px-4 py-2 border-top">
                            <div className="row align-items-center">
                                <div className="col-auto">
                                    <button type="button" className='btn btn-primary btn-elevate kt-login__btn-primary'
                                        onClick={() => this.props.history.goBack()}>
                                        <i className="flaticon2-left-arrow mr-2 font-15" />
                                        <span className="align-middle">Back</span>
                                    </button>
                                </div>
                                <div className="font-weight-bold font-25 text-center col-md-10 text-break">
                                    {project_name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mx-3">
                    <div className="col-xl-4">
                        <div className="card card-custom">
                            <div className="card-body pt-4">
                                <div className="row justify-content-center">
                                    <div className="col-12">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h3 className="font-weight-bold mt-2 text-black">{details?.isEffective == 0 ? 'Non-Effective Contact' : 'Effective Contact'}</h3>
                                            {details?.isEffective == 1 && <div>
                                                {details?.isVerified == 1 ?
                                                    <button className="btn btn-success rounded-pill py-2 px-4">Verified</button>
                                                    :
                                                    <button className="btn btn-danger w-auto rounded-pill py-2 px-4">Non Verified</button>
                                                }
                                            </div>
                                            }
                                        </div>
                                        {details?.isEffective == 1 && isAdmin && <div className="mt-4">
                                            <div className="text-muted font-weight-bold font-size-sm pb-1">{details?.effective_name} {details?.effective_contact && <span className="text-primary">({details?.effective_contact})</span>}</div>
                                            <div className="text-muted font-weight-bold font-size-sm pb-3">{details?.effective_email}</div>
                                        </div>
                                        }
                                        <div className="border-bottom w-100"></div>
                                        <div className="mt-4">
                                            <h5 className="text-dark font-weight-bold pb-3">Basic Contact Info.</h5>
                                            <div className="d-flex align-items-cente mb-3">
                                                <span className="text-dark font-weight-bold mr-2">Gender:</span>
                                                <span className="text-primary">{details?.gender}</span>
                                            </div>
                                            <div className="d-flex align-items-cente mb-3">
                                                <span className="text-dark font-weight-bold mr-2">Age:</span>
                                                <span className="text-primary">{details?.age_group}</span>
                                            </div>
                                            <div className="d-flex align-items-cente mb-3">
                                                <span className="text-dark font-weight-bold mr-2">Group Segment:</span>
                                                <span className="text-primary">{details?.group_segment}</span>
                                            </div>
                                            <div className="d-flex align-items-cente mb-3">
                                                <span className="text-dark font-weight-bold mr-2 text-nowrap">Brand Variant:</span>
                                                <span className="text-primary">{details?.brands_variant.length > 0 ?
                                                    details?.brands_variant.map((items, indx) => {
                                                        return <span key={indx}>{(details.brands_variant.length - 1 == indx) ? items : items
                                                            + ", "}</span>
                                                    }) : "-"}</span>
                                            </div>
                                            <div className="d-flex align-items-cente mb-3">
                                                <span className="text-dark font-weight-bold mr-2">Race Group:</span>
                                                <span className="text-primary">{details?.race_group ? details?.race_group:"-" }</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-8">
                        <div className="card card-custom">
                            <div className="card-body">
                                <div className="row justify-content-center">
                                    <div className="col-12 mb-5">
                                        <div className="d-flex flex-column flex-md-row justify-content-between pb-3 pb-md-0">
                                            <h1 className="font-weight-bold my-4 text-black">ORDER DETAILS</h1>
                                            {details?.status != 0 && <div class="d-flex flex-column align-items-md-end justify-content-center">
                                                <span class="d-flex flex-column align-items-md-end opacity-70">
                                                    <span className="font-weight-bold text-black">Order Status</span>
                                                    <span className={`font-weight-bold ${details?.status === 1 ? "text-success" : "text-danger"}`}>{details?.status === 1 ? "Completed" : "Void"}</span>
                                                </span>
                                            </div>}
                                        </div>
                                        <div className="border-bottom w-100"></div>
                                        <div className="col-12 d-flex flex-column flex-md-row justify-content-between my-3">
                                            <div className="d-flex flex-column flex-root">
                                                <span className="font-weight-bold mb-2 text-black">OUTLET NAME</span>
                                                <span className="opacity-70">{details?.outlet_name}</span>
                                            </div>
                                            <div className="d-flex flex-column flex-root mt-4 mt-md-0">
                                                <span className="font-weight-bold mb-2 text-black">ORDER DATE.</span>
                                                <span className="opacity-70">{moment(details?.createdAt).format('DD-MM-YYYY hh:mm A')}</span>
                                            </div>
                                            <div className="d-flex flex-column flex-root mt-4 mt-md-0">
                                                <span className="font-weight-bold mb-2 text-black">OUTLET ADDRESS</span>
                                                <span className="opacity-70">{details?.Outlet?.address}</span>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-12">
                                        <div className="border-bottom w-100"></div>
                                        <div className="table table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th className="pl-0 font-weight-bold text-muted text-uppercase text-nowrap">Ordered Items</th>
                                                        <th className="text-right font-weight-bold text-muted text-uppercase text-nowrap">Qty</th>
                                                        <th className="text-right font-weight-bold text-muted text-uppercase text-nowrap">Unit Price</th>
                                                        <th className="text-right pr-0 font-weight-bold text-muted text-uppercase text-nowrap">Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {details?.OrderDetails && details?.OrderDetails?.map((item) => {
                                                        return (<tr className="font-weight-bold">
                                                            <td className="border-0 pl-0 pt-7 d-flex flex-column flex-md-row align-items-center">
                                                                <img src={item?.Product?.image_url} className="h-40 w-40 mr-3" style={{ objectFit: 'cover' }} />

                                                                {item?.product_name}</td>
                                                            <td className="text-right pt-7 align-middle">{item?.quantity}</td>
                                                            <td className="text-right pt-7 align-middle">RM {item?.amount}</td>
                                                            <td className="text-primary pr-0 pt-7 text-right align-middle">RM {item?.total_amount}</td>
                                                        </tr>)
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                {details?.status === 0 &&
                                    <div className="row justify-content-center">
                                        <div className="col-md-11 text-right">
                                            <button type="button" className="btn btn-danger font-weight-bold w-auto mr-3"
                                                onClick={() => this.handleModal(true, "Reject")}>Reject</button>
                                            <button type="button" className="btn btn-success font-weight-bold"
                                                onClick={() => this.handleModal(true, "Approve")}>Approve</button>
                                        </div>
                                    </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const styleSearch = {
    borderColor: "#E3E3E3", borderWidth: 2, borderLeftWidth: 0, borderRightWidth: 0
}

const mapStateToProps = ({ auth: { authToken } }) => ({
    authToken
});

export default withRouter(connect(mapStateToProps)(ReportDetails));
