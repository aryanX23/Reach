import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { sendFriendRequest } from "@/store/slices/userSlices";
import {
  getActiveConversations,
  setActiveConversation,
} from "@/store/slices/conversationSlices";
import { showErrorToast, showSuccessToast } from "@/utils/ToastUtil/toastUtil";

const MessageItem = ({
  name,
  message,
  time,
  avatar = "https://avatar.iran.liara.run/public/30",
  unread,
  conversationId,
}) => {
  const dispatch = useDispatch();
  const selectActiveConversationId = useSelector(
    (state) => state.conversation.selectedConversationId,
  );

  const handleSetActive = useCallback(
    (conversationId) => {
      dispatch(setActiveConversation(conversationId));
    },
    [dispatch],
  );

  return (
    <div
      className={`flex items-center p-4 hover:bg-gray-100 border-b-2 border-t-slate-400 cursor-pointer ${selectActiveConversationId === conversationId ? "bg-gray-100" : ""}`}
      onClick={() => handleSetActive(conversationId)}
    >
      <img src={avatar} alt={name} className="w-10 h-10 rounded-full mr-3" />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold">{name}</span>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">{message}</p>
      </div>
      {unread && (
        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs m-2">
          {unread}
        </div>
      )}
    </div>
  );
};

function MessageList() {
  const dispatch = useDispatch();

  const activeConversations = useSelector(
    (state) => state.conversation.activeConversations,
  );

  const [searchId, setSearchId] = useState("");
  const [open, setOpen] = useState(false);

  const handleSendFriendRequest = useCallback(async () => {
    const { payload = {} } = await dispatch(
      sendFriendRequest({ id: searchId }),
    );
    const { status = "", message = "", code = "" } = payload || {};

    if (status === "success") {
      showSuccessToast(message);
    } else if (status === "fail") {
      showErrorToast(message);
    } else {
      showErrorToast("Something went wrong, Pls try again!");
    }

    // Close the popover after sending the friend request
    setOpen(false);
  }, [searchId, dispatch]);

  useEffect(() => {
    dispatch(getActiveConversations());
  }, [dispatch]);

  return (
    <div className="w-full md:w-80 bg-white border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Messages</h2>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="text-blue-500 text-1xl font-medium">
            Add Friends +
          </PopoverTrigger>
          <PopoverContent className="w-full md:w-96 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="hash"
                  className="block text-sm font-medium text-gray-700"
                >
                  <span className="text-lg font-semibold tracking-tight mb-2 block text-gray-900">
                    Search by ID
                  </span>
                </label>
                <input
                  type="text"
                  id="hash"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm p-2"
                  placeholder="Enter Identification Number"
                />
              </div>
              <button
                onClick={handleSendFriendRequest}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-120px)] md:h-[calc(100vh-60px)]">
        {activeConversations?.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No active conversations</p>
          </div>
        )}
        {activeConversations?.map((conversation) => (
          <MessageItem
            key={conversation?.conversationId}
            name={conversation?.user?.fullName || "Unknown"}
            conversationId={conversation?.conversationId}
          />
        ))}
      </div>
    </div>
  );
}

export default MessageList;
