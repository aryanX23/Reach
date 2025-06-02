import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import LoginService from "../../services/loginServices";

const initialState = {
  loginDetails: {
    authenticated: false,
    accessToken: "",
    refreshToken: "",
    error: false,
    message: "",
    userInfo: {
      userId: "",
      name: "",
      email: "",
    },
  },
  loading: false,
};

export const logoutUser = createAsyncThunk("user/logout", async () => {
  window.sessionStorage.clear();
  localStorage.clear();
  return true;
});

export const registerUser = createAsyncThunk(
  "user/register",
  async (body, { rejectWithValue }) => {
    try {
      const res = await LoginService.registerUser(body);
      return res?.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data);
    }
  },
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (body, { rejectWithValue }) => {
    try {
      const res = await LoginService.loginUser(body);
      return res?.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data);
    }
  },
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    resetDetails: (state) => {
      return initialState;
    },
    setAccessToken: (state, action) => {
      state.loginDetails.accessToken = action?.payload?.accessToken || "";
    },
  },
  extraReducers: {
    [loginUser.pending]: (state, action) => {
      let newState = {
        loginDetails: {
          authenticated: false,
          accessToken: "",
          refreshToken: "",
          error: false,
        },
        loading: true,
      };
      return newState;
    },
    [loginUser.fulfilled]: (state, action) => {
      const {
        ACCESS_TOKEN: accessToken = "",
        REFRESH_TOKEN: refreshToken = "",
        userId = "",
        name = "",
        email = "",
        status = false,
      } = action?.payload || {};
      if (status === "success") {
        state["loginDetails"] = {
          authenticated: true,
          accessToken,
          refreshToken,
          userInfo: {
            userId,
            name,
            email,
          },
        };
      }
      state["loading"] = false;
    },
    [loginUser.rejected]: (state, action) => {
      let newState = {
        loginDetails: {
          authenticated: false,
          accessToken: "",
          refreshToken: "",
          error: action.payload?.error?.message,
        },
        loading: false,
      };
      return newState;
    },
    [registerUser.pending]: (state, action) => {
      let newState = {
        loading: true,
      };
      return newState;
    },
    [registerUser.fulfilled]: (state, action) => {
      const { status = false, message = "" } = action?.payload || {};
      if (status === "success") {
        state["loginDetails"] = {
          authenticated: false,
          message,
        };
      }
      state["loading"] = false;
    },
    [registerUser.rejected]: (state, action) => {
      let newState = {
        loginDetails: {
          authenticated: false,
          accessToken: "",
          refreshToken: "",
          error: action.payload?.error?.message,
        },
        loading: false,
      };
      return newState;
    },
    [logoutUser.fulfilled]: (state, action) => {
      return initialState;
    },
  },
});

export const { resetDetails, setAccessToken } = loginSlice.actions;

const { reducer: loginReducer } = loginSlice;

export const selectToken = (state) => {
  return {
    accessToken: state.login.loginDetails.accessToken,
    refreshToken: state.login.loginDetails.refreshToken,
  };
};
export default loginReducer;
