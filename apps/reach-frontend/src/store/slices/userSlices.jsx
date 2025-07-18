import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import UserService from "@/services/userServices";

const initialState = {
  loading: false,
  pendingFriendRequests: [],
  friendList: [],
  error: null,
  message: "",
};

export const sendFriendRequest = createAsyncThunk(
  "user/sendFriendRequest",
  async (body, { rejectWithValue }) => {
    try {
      const res = await UserService.sendFriendRequest(body);
      return res?.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data);
    }
  },
);

export const getPendingFriendRequests = createAsyncThunk(
  "user/getPendingFriendRequest",
  async (body, { rejectWithValue }) => {
    try {
      const res = await UserService.getPendingFriendRequests(body);
      return res?.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data);
    }
  },
);

export const acceptFriendRequest = createAsyncThunk(
  "user/acceptFriendRequest",
  async (body, { rejectWithValue }) => {
    try {
      const res = await UserService.acceptFriendRequest(body);
      return res?.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data);
    }
  },
);

export const rejectFriendRequest = createAsyncThunk(
  "user/rejectFriendRequest",
  async (body, { rejectWithValue }) => {
    try {
      const res = await UserService.rejectFriendRequest(body);
      return res?.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data);
    }
  },
);

export const getFriendList = createAsyncThunk(
  "user/getFriendList",
  async (body, { rejectWithValue }) => {
    try {
      const res = await UserService.getFriendList();
      return res?.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data);
    }
  },
);

const userSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(sendFriendRequest.pending, (state, action) => {
        let newState = {
          loading: true,
        };
        return newState;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        const { status = false, message = "" } = action?.payload || {};
        if (status === "success") {
          state["message"] = "Friend Request Sent Successfully!";
        } else {
          state["message"] = message;
        }

        state["loading"] = false;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        let newState = {
          message: "Failed to send friend request!",
          error: action.payload?.error?.message,
          loading: false,
        };
        return newState;
      })
      .addCase(getPendingFriendRequests.pending, (state, action) => {
        let newState = {
          loading: true,
        };
        return newState;
      })
      .addCase(getPendingFriendRequests.fulfilled, (state, action) => {
        const {
          status = false, message = "", data: pendingRequests = [],
        } = action?.payload || {};
        if (status === "success") {
          state["pendingFriendRequests"] = pendingRequests;
        } else {
          state["message"] = message;
        }
        state["loading"] = false;
      })
      .addCase(getPendingFriendRequests.rejected, (state, action) => {
        let newState = {
          message: "Failed to get pending friend requests!",
          error: action.payload?.error?.message,
          loading: false,
        };
        return newState;
      })
      .addCase(acceptFriendRequest.pending, (state, action) => {
        let newState = {
          loading: true,
        };
        return newState;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        const { status = false, message = "" } = action?.payload || {};
        if (status === "success") {
          state["message"] = "Friend Request Accepted Successfully!";
        } else {
          state["message"] = message;
        }
        state["loading"] = false;
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        let newState = {
          message: "Failed to accept friend request!",
          error: action.payload?.error?.message,
          loading: false,
        };
        return newState;
      })
      .addCase(rejectFriendRequest.pending, (state, action) => {
        let newState = {
          loading: true,
        };
        return newState;
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        const { status = false, message = "" } = action?.payload || {};
        if (status === "success") {
          state["message"] = "Friend Request Rejected Successfully!";
        } else {
          state["message"] = message;
        }
        state["loading"] = false;
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        let newState = {
          message: "Failed to reject friend request!",
          error: action.payload?.error?.message,
          loading: false,
        };
        return newState;
      })
      .addCase(getFriendList.pending, (state, action) => {
        let newState = {
          loading: true,
        };
        return newState;
      })
      .addCase(getFriendList.fulfilled, (state, action) => {
        const { status = false, message = "", data: friendList = [],
        } = action?.payload || {};
        if (status === "success") {
          state["friendList"] = friendList;
        } else {
          state["message"] = message;
        }
        state["loading"] = false;
      })
      .addCase(getFriendList.rejected, (state, action) => {
        let newState = {
          message: "Failed to get friend list!",
          error: action.payload?.error?.message,
          loading: false,
        };
        return newState;
      });
  },
});

const { reducer: userReducer } = userSlice;

export default userReducer;
