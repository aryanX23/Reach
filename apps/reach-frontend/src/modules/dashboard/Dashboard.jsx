import React, { useState } from "react";
import { useSelector } from "react-redux";

import Sidebar from "./components/Sidebar";
import MessageList from "./components/MessageList";
import ChatWindow from "./components/ChatWindow";
import RequestList from "./components/RequestList";
import FriendList from "./components/FriendList";

import { SocketProvider } from "@/contexts/socketContext";

function Dashboard() {
 const activeUserId = useSelector((state) => state.login.loginDetails.userInfo.userId) || "";
  
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="flex h-screen bg-gray-100">
      <SocketProvider
        namespace="/chat-room"
        userId={activeUserId}
      >
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex">
          {activeTab === 1 && <MessageList />}
          {activeTab === 2 && <FriendList />}
          {activeTab === 3 && <RequestList />}
          <ChatWindow />
        </div>
      </SocketProvider>
    </div >
  );
}

export default Dashboard;
