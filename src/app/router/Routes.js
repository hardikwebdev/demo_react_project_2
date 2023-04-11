/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/pages/auth/AuthPage`, `src/pages/home/HomePage`).
 */

import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { useLastLocation } from "react-router-last-location";
import AdminHomePage from "../pages/home/AdminHomePage";
import ErrorsPage from "../pages/errors/ErrorsPage";
import LogoutPage from "../pages/auth/Logout";
import { LayoutContextProvider } from "../../_metronic";
import Layout from "../../_metronic/layout/Layout";
import * as routerHelpers from "../router/RouterHelpers";
import AuthPage from "../pages/auth/AuthPage";

export const Routes = withRouter(({ history }) => {
    const lastLocation = useLastLocation();
    routerHelpers.saveLastLocation(lastLocation);
    const { isAuthorized, menuConfig, userLastLocation, isAdmin, urls, hasLoginAccess } = useSelector(
        ({ auth, urls, builder: { menuConfig } }) => ({
            menuConfig,
            urls: urls,
            isAdmin: auth.user && auth.user.role_id === 0,
            hasLoginAccess: auth.user && auth.user.allowed_dashboard_login,
            isAuthorized: auth.user != null,
            userLastLocation: routerHelpers.getLastLocation()
        }),
        shallowEqual
    );
    
    return (
        /* Create `LayoutContext` from current `history` and `menuConfig`. */
        <LayoutContextProvider history={history} menuConfig={menuConfig}>

            <Switch>
                <Route exact path="/" component={AuthPage} />

                <Route path="/error" component={ErrorsPage} />
                <Route path="/admin/logout" component={LogoutPage} />

                {(!isAuthorized) ? (
                    /* Redirect to `/auth` when user is not authorized */
                    <AuthPage />
                ) : (
                    <Layout isAdmin={isAdmin} hasLoginAccess={hasLoginAccess}>
                        <AdminHomePage userLastLocation={userLastLocation} isAdmin={isAdmin} hasLoginAccess={hasLoginAccess} />
                    </Layout>
                )}
            </Switch>
        </LayoutContextProvider >
    );
});
