import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ConversationService from "@/services/conversationServices";

const initialState = {
  loading: false,
  error: null,
  message: "",
  activeConversations: [],
  activeConversationMessageMap: new Map(),
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
    },
    modifyActiveConversationMessageMap: (state, action) => {
      const { message = {} } = action?.payload || {};
      if (state.selectedConversationId) {

        // FIX: Ensure we are working with a Map instance
        const map = state.activeConversationMessageMap instanceof Map
          ? state.activeConversationMessageMap
          : new Map(Object.entries(state.activeConversationMessageMap));

        const messageArray = map.get(message.roomId) || [];
        messageArray.push(message);
        map.set(message.roomId, messageArray);

        // Finally, assign the updated map back to the state
        state.activeConversationMessageMap = map;
      }
    },
  },
  extraReducers: {
    [getActiveConversations.pending]: (state, action) => {
      state["loading"] = true;
    },
    [getActiveConversations.fulfilled]: (state, action) => {
      const { message = "", data = [] } = action?.payload || {};
      state["message"] = message;
      state["loading"] = false;
      state["activeConversations"] = data;
    },
    [getActiveConversations.rejected]: (state, action) => {
      state["message"] = "Failed to get active conversations!";
      state["error"] = action.payload?.error?.message;
      state["loading"] = false;
    },
  },
});

const { reducer: conversationReducer } = conversationSlices;

export const { setActiveConversation, modifyActiveConversationMessageMap } =
  conversationSlices.actions;
export default conversationReducer;
