import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ConversationService from "@/services/conversationServices";

const initialState = {
  loading: false,
  error: null,
  message: "",
  activeConversations: [],
  activeConversationMessageList: [],
  selectedConversationId: null,
};

export const getActiveConversations = createAsyncThunk(
  "conversations/getActiveConversations",
  async (body, { rejectWithValue }) => {
    try {
      const res = await ConversationService.getActiveConversations();
      return res;
    } catch (e) {
      return rejectWithValue(e?.response?.data);
    }
  },
);

const conversationSlices = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.selectedConversationId = action?.payload || null;
      state.activeConversationMessageList = [];
    },
    modifyActiveConversationMessageList: (state, action) => {
      const { message = {} } = action?.payload || {};
      if (state.selectedConversationId) {
        state.activeConversationMessageList.push(message);
      }
    },
  },
  extraReducers: {
    [getActiveConversations.pending]: (state, action) => {
      let newState = {
        loading: true,
      };
      return newState;
    },
    [getActiveConversations.fulfilled]: (state, action) => {
      const { message = "", data = [] } = action?.payload || {};
      state["message"] = message;
      state["loading"] = false;
      state["activeConversations"] = data;
    },
    [getActiveConversations.rejected]: (state, action) => {
      let newState = {
        message: "Failed to get active conversations!",
        error: action.payload?.error?.message,
        loading: false,
      };
      return newState;
    },
  },
});

const { reducer: conversationReducer } = conversationSlices;

export const { setActiveConversation, modifyActiveConversationMessageList } =
  conversationSlices.actions;
export default conversationReducer;
