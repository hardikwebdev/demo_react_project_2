import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { TextField } from "@material-ui/core";
import clsx from "clsx";
import * as auth from "../../store/ducks/auth.duck";
import { login } from "../../crud/auth.crud";
import { TitleComponent } from "../FormComponents/TitleComponent";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [loadingButtonStyle, setLoadingButtonStyle] = useState({
    paddingRight: "2.5rem"
  });

  const enableLoading = () => {
    setLoading(true);
    setLoadingButtonStyle({ paddingRight: "3.5rem" });
  };

  const disableLoading = () => {
    setLoading(false);
    setLoadingButtonStyle({ paddingRight: "2.5rem" });
  };

  return (
    <>
      <TitleComponent title={props.title} icon={props.icon} />
      <div>

        <div className="kt-login__body mt-5">
          <div className="kt-login__form bg-white rounded shadow p-5">
            <Formik
              initialValues={{
                email: "",
                password: ""
              }}
              validate={values => {
                const errors = {};

                if (!values.email) {
                  // https://github.com/formatjs/react-intl/blob/master/docs/API.md#injection-api
                  errors.email = "Email " + intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD"
                  });
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Email " + intl.formatMessage({
                    id: "AUTH.VALIDATION.INVALID_FIELD"
                  });
                }

                if (!values.password) {
                  errors.password = "Password " + intl.formatMessage({
                    id: "AUTH.VALIDATION.REQUIRED_FIELD"
                  });
                }

                return errors;
              }}
              onSubmit={(values, { setStatus, setSubmitting }) => {
                enableLoading();
                setTimeout(() => {
                  login(values.email, values.password)
                    .then(result => {
                      var data = result.data && result.data.payload;
                      disableLoading();
                      props.login(data);
                    })
                    .catch((errors) => {
                      var msg = errors.response ? errors.response.data.message : errors.message;
                      disableLoading();
                      setSubmitting(false);
                      toast.error(msg, {
                        className: "red-css"
                      });
                    });
                }, 1000);
              }}
            >
              {({
                values,
                status,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting
              }) => (
                <form
                  noValidate={true}
                  autoComplete="off"
                  className="kt-form form w-100"
                  onSubmit={handleSubmit}
                  id='kt_login_signin_form'
                >
                  {status && (
                    <div role="alert" className="alert alert-danger">
                      <div className="alert-text">{status}</div>
                    </div>
                  )}

                  <div className='text-center mb-4'>
                    {/* begin::Link */}
                    <h2 className='text-dark fw-600 mb-3'>Login Account</h2>
                    {/* end::Link */}
                  </div>

                  {/* begin::Form group */}
                  <div className='fv-row mb-10'>
                    <label className='form-label fs-6 fw-600 text-dark'>Email</label>
                    <input
                      placeholder='Email'
                      className={clsx(
                        'form-control form-control-lg form-control-solid',
                        { 'is-invalid': touched.email && errors.email },
                        {
                          'is-valid': touched.email && !errors.email,
                        }
                      )}
                      type='email'
                      name='email'
                      autoComplete='off'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                    />
                    {touched.email && errors.email && (
                      <div className='fv-plugins-message-container'>
                        <span role='alert'>{errors.email}</span>
                      </div>
                    )}
                  </div>
                  {/* end::Form group */}

                  {/* begin::Form group */}
                  <div className='fv-row mb-10'>
                    <div className='d-flex justify-content-between mt-4'>
                      <div className='d-flex flex-stack mb-2'>
                        {/* begin::Label */}
                        <label className='form-label fw-600 text-dark fs-6 mb-0'>Password</label>
                        {/* end::Label */}
                        {/* begin::Link */}

                        {/* end::Link */}
                      </div>
                    </div>
                    <input
                      name='password'
                      type='password'
                      placeholder='Password'
                      autoComplete='off'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      className={clsx(
                        'form-control form-control-lg form-control-solid',
                        {
                          'is-invalid': touched.password && errors.password,
                        },
                        {
                          'is-valid': touched.password && !errors.password,
                        }
                      )}
                    />
                    {/* <Link
                      to='/admin/forgot-password'
                      className='link-primary fs-6 fw-600 text-right'
                      style={{ marginLeft: '5px' }}
                    >
                      Forgot Password?
                    </Link> */}
                    {touched.password && errors.password && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                          <span role='alert'>{errors.password}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* end::Form group */}

                  {/* begin::Action */}
                  <div className='text-center'>
                    <button
                      type='submit'
                      id='kt_sign_in_submit'
                      className='btn btn-lg btn-primary w-100 mt-4'
                      disabled={isSubmitting}
                    >
                      Continue
                    </button>
                  </div>

                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

export default injectIntl(
  connect(
    null,
    auth.actions
  )(Login)
);
