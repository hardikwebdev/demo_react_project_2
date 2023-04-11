/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { createRef } from "react";
import { connect } from "react-redux";
import {
    Portlet,
    PortletBody
} from "../../partials/content/Portlet";
import { withRouter } from "react-router-dom";
import {
    Dropdown,
    Button
} from "react-bootstrap";
import { getTradeList, getAllUsersList, getAllProjectsList } from "../../crud/auth.crud";
import moment from 'moment-timezone';
import { TitleComponent } from "../FormComponents/TitleComponent";
import Pagination from 'react-js-pagination';
import { Person, Image } from '@material-ui/icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { paginationTexts } from '../../../_metronic/utils/utils';
import { CircularProgress } from '@material-ui/core';

class TradeRequest extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tradeData: [],
            tradeCount: 0,
            searchValue: "",
            limit: 25,
            status: 0,
            sortBy: 'createdAt',
            sortOrder: 'DESC',
            activePage: 1,
            isFocus: false,
            user_id: "",
            project_id: "",
            userData: [],
            projectData: [],
            loading: false
        };
        this.inputRef = createRef();

    }


    componentDidMount = async () => {
        this.getTradeList();
        this.getAllUsersList();
        this.getAllProjectsList();
    }

    getTradeList = async (searchData) => {
        this.setState({ loading: true });
        const { authToken } = this.props;

        var limitV = this.state.limit;
        var sortByV = this.state.sortBy;
        var sortOrderV = this.state.sortOrder;
        var activePage = this.state.activePage;
        var user_id = this.state.user_id;
        var project_id = this.state.project_id;
        var status = this.state.status;
        var search = (this.state.searchValue !== undefined) ? this.state.searchValue : null;
        await getTradeList(authToken, search, limitV, sortByV,
            sortOrderV, activePage, status, user_id, project_id).then(result => {
                this.setState({
                    loading: false,
                    tradeData: result.data.payload ? result.data.payload.data.rows : [],
                    tradeCount: result.data.payload && result.data.payload.data.count
                });

            }).catch(err => {
                this.setState({
                    loading: false,
                    tradeData: [],
                    tradeCount: 0
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

    handleUsersStatus = (value) => {
        this.setState({ user_id: value ? value : "", project_id: "", outlet_id: "" });
        setTimeout(() => {
            this.getTradeList();
        }, 500);
    }

    handleProjectStatus = (value) => {
        this.setState({ project_id: value ? value : "", user_id: "", outlet_id: "" });
        setTimeout(() => {
            this.getTradeList();
        }, 500);
    }

    clear = () => {
        this.setState({ searchValue: "", status: 0 });
        setTimeout(() => {
            this.getTradeList();
        }, 500);
    };

    handleSearchChange = event => {
        this.setState({ searchValue: event.target.value, status: 3 });
        if (event.target.value.length === 0) {
            this.setState({ status: 0 });
            this.getTradeList();
        }
    };

    handleStatus = (value) => {
        this.setState({ status: value });
        setTimeout(() => {
            this.getTradeList();
        }, 500);
    }

    handleSelect = (number) => {
        this.setState({ activePage: number });
        setTimeout(() => {
            this.getTradeList();
        }, 500);
    }

    changeFocus = () => {
        this.setState({ isFocus: true });
    }

    handleSubmit = () => {
        this.setState({ activePage: 1 });
        setTimeout(() => {
            this.getTradeList();
        }, 500);
    }

    handleReset = () => {
        window.location.reload();
    }

    render() {
        const { tradeData, tradeCount, activePage, limit, searchValue, isFocus, userData, projectData, loading } = this.state;
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
                                    <Dropdown drop="down" className="mr-3">
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Type</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => this.handleStatus(0)}>Pending</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(1)}>Approved</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(2)}>Rejected</Dropdown.Item>
                                            <Dropdown.Item onClick={() => this.handleStatus(3)}>All</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown drop="down" className="mr-3">
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                            Users</Dropdown.Toggle>
                                        <Dropdown.Menu className="max-h-300px overflow-auto">
                                            {userData?.map((item, index) =>
                                                <Dropdown.Item onClick={() => this.handleUsersStatus(item.id)} key={item.id}>{item.username}</Dropdown.Item>
                                            )}
                                            <Dropdown.Item onClick={() => this.handleUsersStatus()}>All</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Dropdown drop="down" className="mr-3">
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Project</Dropdown.Toggle>
                                        <Dropdown.Menu className="max-h-300px overflow-auto">
                                            {projectData?.map((item, index) =>
                                                <Dropdown.Item onClick={() => this.handleProjectStatus(item.id)} key={item.id}>{item.title}</Dropdown.Item>
                                            )}
                                            <Dropdown.Item onClick={() => this.handleProjectStatus()}>All</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
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
                                {tradeData.length > 0 ?
                                    tradeData.map((item, index) =>
                                        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6" key={item.id}>
                                            <div className="card card-custom gutter-b card-stretch">
                                                <div className="card-body pt-4 px-0">
                                                    <div className="border-bottom border-secondary px-3 mx-1">
                                                        <div className="d-flex justify-content-between align-items-start h-125px overflow-auto">
                                                            <div>
                                                                {item.TradeProducts.length > 0 &&
                                                                    item.TradeProducts?.map((items, index) =>
                                                                        <div key={items.id}>
                                                                            <div className="mb-1">
                                                                                <span className="text-dark">{items.product_name} x {items.quantity}</span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                            <div>
                                                                <div className="text-dark"> {moment(item.updatedAt).format('DD-MM-YYYY')}</div>
                                                                <div className="text-dark"> {moment(item.updatedAt).format('hh:mm A')}</div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center my-3">
                                                            <span className="text-primary font-weight-bold mr-2">Total: {item.totalQuantity}</span>
                                                            {item.image_url &&
                                                                <a href={item.image_url} target="_blank"
                                                                    className="text-primary font-weight-bold mr-2 cursor-pointer"><Image />
                                                                </a>}
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 px-3 mx-1">
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-dark font-weight-bold mr-2">User Name:</span>
                                                            <span className="text-muted">{item.username} ({item.system_id})</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-dark font-weight-bold mr-2">Project Name:</span>
                                                            <span className="text-muted">{item.Project.title} ({item.Project.campaign_id})</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-dark font-weight-bold mr-2">Campaign Id:</span>
                                                            <span className="text-muted">{item.campaign_id}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <span className="text-dark font-weight-bold mr-2">Type:</span>
                                                            {item.TradeProducts[0].status == 0 ? <span className="text-white bg-warning rounded-pill py-1 px-3">Pending</span> :
                                                                item.TradeProducts[0].status == 1 ? <span className="text-white bg-success rounded-pill py-1 px-3">Approved</span> :
                                                                    <span className="text-white bg-danger rounded-pill py-1 px-3">Rejected</span>}
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
                                                    <Person />
                                                </span>
                                                <h3 className="text-dark mb-0 mt-4">No Trade Request have been Found</h3>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>}
                    </PortletBody>
                </Portlet>

                {(tradeCount > limit) &&
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center px-4 cus-pagination">
                        <h5 className="text-dark mb-3 mb-md-0">{paginationTexts(activePage, tradeCount, limit)}</h5>
                        <Pagination
                            bsSize={'medium'}
                            activePage={activePage}
                            itemsCountPerPage={limit}
                            totalItemsCount={tradeCount}
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

export default withRouter(connect(mapStateToProps)(TradeRequest));