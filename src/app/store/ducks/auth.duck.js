import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { put, takeLatest } from "redux-saga/effects";
import { getUserByToken } from "../../crud/auth.crud";
import * as routerHelpers from "../../router/RouterHelpers";

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API"
};

const initialAuthState = {
  user: undefined,
  authToken: undefined
};

export const reducer = persistReducer(
  { storage, key: "demo2-auth", whitelist: ["user", "authToken"] },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        const { user } = action.payload;
        const authToken = user.token;

        return { authToken, user };
      }

      case actionTypes.Logout: {
        routerHelpers.forgotLastLocation();
        return initialAuthState;
      }

      case actionTypes.UserRequested: {
        const { user } = action.payload;
        const authToken = user.token;

        return { authToken, user };
      }

      case actionTypes.UserLoaded: {
        const { user } = action.payload;
        const authToken = user.token;

        return { authToken, user };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: user => ({ type: actionTypes.Login, payload: { user } }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: user => ({ type: actionTypes.UserRequested, payload: { user } }),
  fulfillUser: user => ({ type: actionTypes.UserLoaded, payload: { user } })
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga(res) {
    var user = res.payload.user;
    yield put(actions.requestUser(user));
  });

  yield takeLatest(actionTypes.UserRequested, function* userRequested(res) {
    const token = res.payload.user.token;
    const result = yield getUserByToken(token);
    const user = result.data && result.data.payload;
    yield put(actions.fulfillUser(user));
  });
}