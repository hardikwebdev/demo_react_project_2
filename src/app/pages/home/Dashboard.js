import React, { createRef } from "react";
import { connect } from "react-redux";
import {
  Portlet,
  PortletBody
} from "../../partials/content/Portlet";
import { TitleComponent } from "../FormComponents/TitleComponent";
import { dashboardData, getAPIstatus, changeAPIstatus, changeAPItoAutoOrManual } from '../../crud/auth.crud';
import Switch from "react-switch";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dData: [],
      checked: false,
      text: "",
      disabled: false,
      cron_status: false,
      cronStatusText: ""
    };
    this.inputRef = createRef();
  }

  componentDidMount() {
  }

  render() {
    const { dData, text, disabled, cronStatusText, cron_status } = this.state;
    return (
      <div>
        <TitleComponent title={this.props.title} icon={this.props.icon} />
        <ToastContainer />
        
        <div className="row m-5">
          <div className="col-xl-12">
            <div className="row row-full-height">
              <div className="col-md-4">
                <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-brand">
                  <PortletBody fluid={true}>
                    <div className="row">
                      <div className="col-auto">
                        <div className="sbox lbluebox">
                          <i className="fa fa-user"></i>
                        </div>
                      </div>
                      <div className="col text-right">
                        <div className="mt-4"></div>
                        <div className="totaltext">Today's Request</div>
                        <div className="mb-2"></div>
                        <div className="totalcounts">{dData.todayReq ? dData.todayReq : 0}</div>
                      </div>
                    </div>
                  </PortletBody>
                </Portlet>
              </div>
              <div className="kt-space-20" />
              <div className="col-md-4">
                <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-brand">
                  <PortletBody fluid={true}>
                    <div className="row">
                      <div className="col-auto">
                        <div className="sbox lredbox">
                          <i className="fa fa-user"></i>
                        </div>
                      </div>
                      <div className="col text-right">
                        <div className="mt-4"></div>
                        <div className="totaltext">Weekly Request</div>
                        <div className="mb-2"></div>
                        <div className="totalcounts">{dData.weeklyReq ? dData.weeklyReq : 0}</div>
                      </div>


                    </div>
                  </PortletBody>
                </Portlet>
              </div>
              <div className="kt-space-20" />
              <div className="col-md-4">
                <Portlet className="kt-portlet--height-fluid kt-portlet--border-bottom-brand">
                  <PortletBody fluid={true}>
                    <div className="row">
                      <div className="col-auto">
                        <div className="sbox lgreenbox">
                          <i className="fa fa-user-check"></i>
                        </div>
                      </div>
                      <div className="col text-right">
                        <div className="mt-4"></div>
                        <div className="totaltext">Monthly Request</div>
                        <div className="mb-2"></div>
                        <div className="totalcounts">{dData.monthlyReq ? dData.monthlyReq : 0}</div>
                      </div>
                    </div>
                  </PortletBody>
                </Portlet>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}


const mapStateToProps = ({ auth: { authToken } }) => ({
  authToken
});

export default connect(mapStateToProps)(Dashboard);