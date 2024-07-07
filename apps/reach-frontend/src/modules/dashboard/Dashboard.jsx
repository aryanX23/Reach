import React from 'react';
import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';
import ChatWindow from './components/ChatWindow';

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex">
        <MessageList />
        <ChatWindow />
      </div>
    </div>
  );
}

export default Dashboard;