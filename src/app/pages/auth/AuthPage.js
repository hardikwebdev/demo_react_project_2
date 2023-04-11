import React from "react";
import { Link, Switch, Route, Redirect } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic";
import "../../../_metronic/_assets/sass/pages/login/login-1.scss";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import ChangePassword from './ChangePassword';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AuthPage() {

  return (
    <>
      <div className="kt-grid kt-grid--ver kt-grid--root">
        <ToastContainer />
        <div
          id="kt_login"
          className="kt-grid kt-grid--hor kt-grid--root kt-login kt-login--v1"
        >
          <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--desktop kt-grid--ver-desktop kt-grid--hor-tablet-and-mobile">
            <div className="kt-grid__item kt-grid__item--fluid  kt-grid__item--order-tablet-and-mobile-1  kt-login__wrapper"  
            style={{
                backgroundImage: `url(${toAbsoluteUrl("/media/bg/14.png")})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPositionY: 'bottom',
                backgroundAttachment: 'fixed',
              }}>
              <Switch>
                <Route path="/admin/login" component={(props) => <Login title={"Login"} {...props}/>} />

                <Route
                  path="/admin/forgot-password"
                  component={(props) => <ForgotPassword title={"Forgot Password"} {...props} />}
                />
                <Route
                  path="/admin/changePassword"
                  component={(props) => <ChangePassword title={"Change Password"} {...props} />}
                />
                <Redirect from="/admin" exact={true} to="/admin/login" />
                <Redirect to="/admin/login" />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
