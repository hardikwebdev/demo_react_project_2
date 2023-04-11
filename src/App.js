/**
 * Entry application component used to compose providers and render Routes.
 *
 * Note: Because of
 */

import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { LastLocationProvider } from "react-router-last-location";
import { Routes } from "./app/router/Routes";
import { I18nProvider, LayoutSplashScreen, ThemeProvider } from "./_metronic";
import AppContextProvider from "app/AppContextProvider";

export default function App({ store, persistor, basename }) {
  return (
    /* Provide Redux store */
    <Provider store={store} loading={<LayoutSplashScreen />}>
      {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
      <PersistGate persistor={persistor}>
        {/* Add high level `Suspense` in case if was not handled inside the React tree. */}
        <React.Suspense fallback={<LayoutSplashScreen />}>
          {/* Override `basename` (e.g: `homepage` in `package.json`) */}
          <BrowserRouter basename={basename}>
            {/*This library only returns the location that has been active before the recent location change in the current window lifetime.*/}
            <LastLocationProvider>
              {/* Provide Metronic theme overrides. */}
              <ThemeProvider>
                {/* Provide `react-intl` context synchronized with Redux state.  */}
                <I18nProvider>
                  <AppContextProvider>
                    {/* Render routes with provided `Layout`. */}
                    <Routes />
                  </AppContextProvider>
                </I18nProvider>
              </ThemeProvider>
            </LastLocationProvider>
          </BrowserRouter>
        </React.Suspense>
      </PersistGate>
    </Provider>
  );
}
