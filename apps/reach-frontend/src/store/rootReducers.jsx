import { combineReducers } from "redux";

import loginReducer from "./slices/loginSlices";
import userReducer from "./slices/userSlices";
import conversationReducer from "./slices/conversationSlices";

const appReducer = combineReducers({
  login: loginReducer,
  user: userReducer,
  conversation: conversationReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "user/logout/fulfilled") {
    localStorage.removeItem("persist:root");
    state = undefined;
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
