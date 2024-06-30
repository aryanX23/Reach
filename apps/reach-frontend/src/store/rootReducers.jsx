import { combineReducers } from "redux";

import loginReducer from "./slices/loginSlices";

const appReducer = combineReducers({
    login: loginReducer,
});

const rootReducer = (state, action) => {
    if (action.type === 'user/logout/fulfilled') {
        localStorage.removeItem('persist:root')
        state = undefined;
        return appReducer(undefined, action)
    }

    return appReducer(state, action)
}

export default rootReducer;