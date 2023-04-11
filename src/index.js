/*

=========================================================
* Now UI Kit React - v1.4.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-kit-react
* Copyright 2020 Creative Tim (http://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-kit-react/blob/master/LICENSE.md)

* Designed by www.invisionapp.com Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import store, { persistor } from "./app/store/store";
// IE 11 polyfills
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
// Fonts
import "socicon/css/socicon.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./_metronic/_assets/plugins/line-awesome/css/line-awesome.css";
import "./_metronic/_assets/plugins/flaticon/flaticon.css";
import "./_metronic/_assets/plugins/flaticon2/flaticon.css";
// styles for this kit
import "./index.scss"; // Standard version
import "assets/css/bootstrap.min.css";
import "assets/css/now-ui-kit.css";
import "assets/css/now-ui-kit.min.css";
import "assets/scss/now-ui-kit.scss?v=1.4.0";
import "assets/demo/demo.css?v=1.4.0";
import "assets/demo/nucleo-icons-page-styles.css?v=1.4.0";
import './_metronic/_assets/sass/style.react.scss'
// pages for this kit
import App from './App';

const { PUBLIC_URL } = process.env;

ReactDOM.render(
  <App
  store={store}
  persistor={persistor}
  // basename={PUBLIC_URL}
  />,
  document.getElementById("root")
);
