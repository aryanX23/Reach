import React, { useState } from 'react';

const RequestItem = ({ name, userId, avatar = "https://i.pravatar.cc/150?img=1", onAccept, onReject }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleAccept = () => {
    onAccept(userId);
    setIsOpen(false); 
  };

  const handleReject = () => {
    onReject(userId);
    setIsOpen(false); 
  };

  return (
    <div>
      <div
        className={`flex items-center p-4 hover:bg-gray-100 border-b-2 border-t-slate-400 cursor-pointer ${isOpen ? 'bg-gray-100' : ''}`}
        onClick={toggleDrawer}
      >
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full mr-3" />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{name}</span>
            <span className="text-gray-500">{isOpen ? '▲' : '▼'}</span> {/* Arrow indicator */}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="transition-all duration-300 ease-in-out bg-white shadow-md rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between">
            <button
              onClick={handleAccept}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
            >
              Accept
            </button>
            <button
              onClick={handleReject}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestItem;