import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';
import ChatWindow from './components/ChatWindow';
import RequestList from './components/RequestList';
import FriendList from './components/FriendList';

import { SocketProvider } from '@/contexts/socketContext';

function Dashboard() {
  const [activeTab, setActiveTab] = useState(1);
  const selectActiveConversationId = useSelector((state) => state.conversation.selectedConversationId);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex">
        {activeTab === 1 && <MessageList />}
        {activeTab === 2 && <FriendList />}
        {activeTab === 3 && <RequestList />}
        <SocketProvider namespace='/chat-room' roomId={selectActiveConversationId}>
          <ChatWindow />
        </SocketProvider>
      </div>
    </div>
  );
}

export default Dashboard;