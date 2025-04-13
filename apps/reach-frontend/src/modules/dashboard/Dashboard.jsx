import { useState } from 'react';

import Sidebar from './components/Sidebar';
import MessageList from './components/MessageList';
import ChatWindow from './components/ChatWindow';
import RequestList from './components/RequestList';

function Dashboard() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex">
        {activeTab === 1 && <MessageList />}
        {activeTab === 2 && <RequestList />}
        {activeTab === 3 && <RequestList />}
        <ChatWindow />
      </div>
    </div>
  );
}

export default Dashboard;