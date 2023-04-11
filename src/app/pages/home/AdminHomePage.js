import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
// import Dashboard from "./Dashboard";
import Users from "./Users";
// import UpdateProfile from "./UpdateProfile";
import Projects from "./Projects";
import Brands from "./Brands";
import BrandsVariant from "./BrandsVariant";
import Outlets from "./Outlets";
import ProjectOutlets from "./ProjectOutlets";
import UpdateProfile from "./UpdateProfile";
import Products from "./Products";
import Stocks from "./Stocks";
import Visitations from "./Visitations";
import TradeRequest from "./TradeRequest";
import GeneralConfig from "./GeneralConfig";
import Reports from "./Reports";
import ReportDetails from "./ReportDetails";
import Category from "./Category";
import Roles from "./Roles";
import Regions from "./Regions";
import EffectiveUsers from "./EffectiveUsers";
import OutletReports from "./OutletReport";
import ExportCSV from "./ExportCSV";
import AdminUser from "./AdminUser";
import Questionnaires from "./Questionnaires";

import { LayoutSplashScreen } from "../../../_metronic";

export default function AdminHomePage(props) {
  return (
    <Suspense fallback={<LayoutSplashScreen userLastLocation={props.userLastLocation} />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          props.isAdmin === true ? <Redirect exact from="/admin/login" to="/admin/users" /> :
            props.isAdmin === false && props.hasLoginAccess === 1 && <Redirect exact from="/admin/login" to="/admin/reports" />
        }
        {props.isAdmin &&
          (
            <Switch><Route exact path="/admin/projects" component={() => <Projects title={" Admin | Projects"} />} />
              <Route exact path="/admin/users" component={() => <Users title={" Admin | Users"} />} />
              <Route exact path="/admin/adminusers" component={() => <AdminUser title={" Admin | Admin Users"} />} />
              <Route exact path="/admin/brands" component={() => <Brands title={" Admin | Brands"} />} />
              <Route exact path="/admin/brands-variant" component={() => <BrandsVariant title={" Admin | Brands Variant"} />} />
              <Route exact path="/admin/outlets" component={() => <Outlets title={" Admin | Outlets"} />} />
              <Route exact path="/admin/roles" component={() => <Roles title={" Admin | Roles"} />} />
              <Route exact path="/admin/regions" component={() => <Regions title={" Admin | Regions"} />} />
              <Route exact path="/admin/collected-users" component={() => <EffectiveUsers title={" Admin | Collected Users"} />} />
              <Route exact path="/admin/category" component={() => <Category title={" Admin | Category"} />} />
              <Route exact path="/admin/products" component={() => <Products title={" Admin | Products"} />} />
              <Route exact path="/admin/stocks" component={() => <Stocks title={" Admin | Stocks"} />} />
              <Route exact path="/admin/visitations" component={() => <Visitations title={" Admin | Visitations"} />} />
              <Route exact path="/admin/trade-request" component={() => <TradeRequest title={" Admin | Trade Request"} />} />
              <Route exact path="/admin/general-config" component={() => <GeneralConfig title={" Admin | General Config"} />} />
              <Route exact path="/admin/project-outlets" component={() => <ProjectOutlets title={" Admin | Project Outlets"} />} />
              <Route exact path="/admin/reports" component={() => <Reports title={" Admin | Reports"} />} />
              <Route exact path="/admin/report-details" component={() => <ReportDetails title={" Admin | Report Details"} />} />
              <Route exact path="/admin/update-profile" component={() => <UpdateProfile title={" Admin | Update Profile"} />} />
              <Route exact path="/admin/outlet-reports" component={() => <OutletReports title={" Admin | Outlet Reports"} />} />
              <Route exact path="/admin/csv-reports" component={() => <ExportCSV title={" Admin | CSV Reports"} />} />
              <Route exact path="/admin/questionnaires" component={() => <Questionnaires title={" Admin | Questionnaires"} />} />
              <Redirect exact from="/*/" to="/admin/users" />
            </Switch>)}
        <Route exact path="/admin/reports" component={() => <Reports title={" Admin | Reports"} />} />
        <Route exact path="/admin/report-details" component={() => <ReportDetails title={" Admin | Report Details"} />} />
        <Route exact path="/admin/update-profile" component={() => <UpdateProfile title={" Admin | Update Profile"} />} />
        <Route exact path="/admin/outlet-reports" component={() => <OutletReports title={" Admin | Outlet Reports"} />} />
        <Route exact path="/admin/csv-reports" component={() => <ExportCSV title={" Admin | CSV Reports"} />} />

        <Redirect exact from="/*/" to="/admin/reports" />
      </Switch>
    </Suspense>
  );
}
