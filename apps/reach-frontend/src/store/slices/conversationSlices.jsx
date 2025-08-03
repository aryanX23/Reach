import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import ConversationService from "@/services/conversationServices";
import MessagesService from "@/services/messagesService";

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

export const getMessagesForConversation = createAsyncThunk(
  "conversations/getMessagesForConversation",
  async ({ conversationId, messageRange, messageFetchDirection, lastMessageTimestamp }, { rejectWithValue }) => {
    try {
      const res = await MessagesService.getMessageForConversation({
        conversationId,
        messageRange,
        messageFetchDirection,
        lastMessageTimestamp,
      });

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
  extraReducers: (builder) => {
    builder
      .addCase(getActiveConversations.pending, (state) => {
        state["loading"] = true;
      })
      .addCase(getActiveConversations.fulfilled, (state, action) => {
        const { message = "", data = [] } = action?.payload || {};
        state["message"] = message;
        state["loading"] = false;
        state["activeConversations"] = data;
      })
      .addCase(getActiveConversations.rejected, (state, action) => {
        state["message"] = "Failed to get active conversations!";
        state["error"] = action.payload?.error?.message;
        state["loading"] = false;
      })
      .addCase(getMessagesForConversation.pending, (state) => {
        state["loading"] = true;
      })
      .addCase(getMessagesForConversation.fulfilled, (state, action) => {
        const { message = "", data = {} } = action?.payload || {};
        state["message"] = message;
        state["loading"] = false;

        const { conversationId, messages = [], messageRange, messageFetchDirection, lastMessageTimestamp } = data?.data || {};
        if (conversationId) {
          const map = state.activeConversationMessageMap instanceof Map
            ? state.activeConversationMessageMap
            : new Map(Object.entries(state.activeConversationMessageMap));

          let existingMessageArr = map.get(conversationId) || [];

          if (messageFetchDirection === "newer") {
            existingMessageArr.push(...messages);
          } else {
            existingMessageArr = [...messages, ...existingMessageArr];
          }
          map.set(conversationId, existingMessageArr);
          state["activeConversationMessageMap"] = map;
        }
      })
      .addCase(getMessagesForConversation.rejected, (state, action) => {
        state["message"] = "Failed to get messages for conversation!";
        state["error"] = action.payload?.error?.message;
        state["loading"] = false;
      }
      );
  },
});

const { reducer: conversationReducer } = conversationSlices;

export const { setActiveConversation, modifyActiveConversationMessageMap } =
  conversationSlices.actions;
export default conversationReducer;
