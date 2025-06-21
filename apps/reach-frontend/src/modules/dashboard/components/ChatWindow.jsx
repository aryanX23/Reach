import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { isEmpty } from "lodash";
import moment from "moment-timezone";
import { SendHorizonal } from "lucide-react";

import { useSocket } from "@/contexts/socketContext";
import { modifyActiveConversationMessageMap, setActiveConversation } from "@/store/slices/conversationSlices";

const Message = ({ content, sender, time, attachments, timezone }) => {
  const parsedAndFormattedTime = useMemo(() => {
    if (typeof time === "string") {
      try {
        return moment(JSON.parse(time)).tz(timezone).format("HH:mm A");
      } catch (error) {
        console.error("Error parsing time:", error);
        return "";
      }
    }
    return "";
  }, [time, timezone]);

  return (
    <div className={`mb-4 ${sender === "self" ? "text-right" : ""}`}>
      <div
        className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${sender === "self" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
      >
        <p>{content}</p>
        {attachments && (
          <div className="mt-2 flex space-x-2">
            {attachments.map((att, index) => (
              <img
                key={index}
                src={att}
                alt="attachment"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>
      <span className="block text-xs mt-1 text-gray-500">
        {parsedAndFormattedTime}
      </span>
    </div>
  );
};

function ChatWindow() {
  const dispatch = useDispatch();
  const socket = useSocket();
  const dummyDivRef = useRef(null);

  const selectActiveConversationId =
    useSelector((state) => state.conversation.selectedConversationId) || "";
  
  const activeUserId = useSelector((state) => state.login.loginDetails.userInfo.userId) || "";
  
  const activeConversationList =
    useSelector((state) => state.conversation.activeConversations) || [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const activeConversation = useMemo(() => {
    return (
      activeConversationList?.find(
        (conv) => conv.conversationId === selectActiveConversationId,
      ) || {}
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectActiveConversationId]);

  const activeConversationMap =
  useSelector((state) => state.conversation.activeConversationMessageMap);

// FIX & OPTIMIZATION: Memoize the list derivation and ensure data is a Map
const activeMessageList = useMemo(() => {
  // If the stored data is not a Map (e.g., after rehydration), convert it.
  if (activeConversationMap && !(activeConversationMap instanceof Map)) {
    return new Map(Object.entries(activeConversationMap)).get(selectActiveConversationId) || [];
  }
  return activeConversationMap?.get(selectActiveConversationId) || [];
}, [activeConversationMap, selectActiveConversationId]);
  
  const userId =
    useSelector((state) => state.login?.loginDetails?.userInfo?.userId) || "";

  const [messageInput, setMessageInput] = useState("");

  const NoConversationElement = memo(function NoConversationElement() {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p className="text-lg">Select a conversation to start chatting</p>
      </div>
    );
  });

  const scrollToBottom = useCallback(() => {
    if (dummyDivRef.current) {
      dummyDivRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  const sendMessageViaSocket = useCallback(
    (message = {}) => {
      if (isEmpty(socket) || isEmpty(selectActiveConversationId)) return;

      socket.emit("send-message", {
        roomId: selectActiveConversationId,
        content: message,
      });
    },
    [selectActiveConversationId, socket],
  );

  const handleSendMessage = (messageInput) => {
    if (messageInput.trim()) {
      const timeRightNow = moment.utc();
      const timezone = moment.tz.guess();

      let messageBody = {
        content: messageInput,
        sender: "self",
        time: JSON.stringify(timeRightNow),
        timezone: timezone,
        senderId: userId,
        roomId: selectActiveConversationId,
      };
      dispatch(
        modifyActiveConversationMessageMap({
          message: messageBody,
        }),
      );
      sendMessageViaSocket(messageBody);
      setMessageInput("");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessageList, scrollToBottom]);

  useEffect(() => {
    if (
      isEmpty(activeConversation) ||
      isEmpty(selectActiveConversationId) ||
      !socket
    ) {
      console.warn("No active conversation or socket connection available.");
      return;
    }

    socket.on("receive-message", (message = {}) => {
      console.log("Message received from server -> ", message);
      dispatch(
        modifyActiveConversationMessageMap({
          message: {
            content: message.content,
            sender: (activeUserId === message.senderId) ? "self" : "other",
            time: message.time,
            timezone: message.timezone,
            roomId: message.roomId,
            senderId: message.senderId,
          },
        }),
      );
    });

    return () => {
      socket.emit("leave-room", { roomId: selectActiveConversationId });
      socket.off("receive-message");
      socket.disconnect();
      dispatch(setActiveConversation(null));
    };
  }, [selectActiveConversationId, activeConversation, socket, dispatch, activeUserId]);

  return (
    <div className="flex-1 flex flex-col">
      {isEmpty(activeConversation) ? (
        <NoConversationElement />
      ) : (
        <>
          <div className="bg-white border-b flex items-center px-4 py-3">
            <img
              src={
                activeConversation?.user?.avatar ||
                "https://i.pravatar.cc/150?img=3"
              }
              alt={activeConversation?.user?.fullName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {activeConversation?.user?.fullName}
              </h2>
            </div>
            <div className="ml-auto flex space-x-2">
              <button className="text-gray-500">🔍</button>
              <button className="text-gray-500">📹</button>
              <button className="text-gray-500">📞</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeMessageList?.map((messageBody, index) => {
              return (
                <Message
                  key={index}
                  content={messageBody?.content || ""}
                  sender={messageBody?.sender || ""}
                  time={messageBody?.time}
                  timezone={messageBody?.timezone}
                />
              );
            })}
            <div ref={dummyDivRef} />
          </div>
          <div className="bg-white p-4 flex items-center border-t">
            <input
              type="text"
              placeholder={`Message ${activeConversation?.user?.fullName || ""}...`}
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && messageInput.trim()) {
                  handleSendMessage(messageInput);
                }
              }}
            />
            <button className="ml-2 text-gray-500">😊</button>
            <button
              className="ml-2 text-blue-500"
              onClick={() => {
                handleSendMessage(messageInput);
              }}
            >
              <span className="text-xl">{<SendHorizonal />}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatWindow;
