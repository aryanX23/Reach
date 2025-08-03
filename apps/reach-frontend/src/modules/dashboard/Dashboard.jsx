import React, { useState } from "react";
import { useSelector } from "react-redux";

import Sidebar from "./components/Sidebar";
import MessageList from "./components/MessageList";
import ChatWindow from "./components/ChatWindow";
import RequestList from "./components/RequestList";
import FriendList from "./components/FriendList";

import { SocketProvider } from "@/contexts/socketContext";

function Dashboard() {
  const activeUserId =
    useSelector((state) => state.login.loginDetails.userInfo.userId) || "";
  const selectActiveConversationId =
    useSelector((state) => state.conversation.selectedConversationId) || "";

  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="h-screen bg-gray-100">
      <SocketProvider namespace="/chat-room" userId={activeUserId}>
        <div className="flex h-full">
          <div
            className={`w-full md:w-auto ${selectActiveConversationId ? "hidden md:flex" : "flex"}`}
          >
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1 overflow-y-auto">
              {activeTab === 1 && <MessageList />}
              {activeTab === 2 && <FriendList />}
              {activeTab === 3 && <RequestList />}
            </div>
          </div>
          <div
            className={`w-full ${selectActiveConversationId ? "flex" : "hidden md:flex"}`}
          >
            <ChatWindow />
          </div>
        </div>
      </SocketProvider>
    </div>
  );
}

export default Dashboard;
