import React, { useState } from 'react';

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { sendFriendRequest } from '@/store/slices/userSlices';
import { useDispatch } from 'react-redux';

const MessageItem = ({ name, message, time, avatar, unread, active }) => (
  <div className={`flex items-center p-4 hover:bg-gray-100 border-b-2 border-t-slate-400 cursor-pointer ${active ? 'bg-gray-100' : ''}`}>
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

function MessageList() {
  const dispatch = useDispatch();
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const messages = [
    { name: "Adhraaa Al Azimi", message: "OK will handle this", time: "10m", avatar: "https://i.pravatar.cc/150?img=1", unread: 5 },
    { name: "Jaquon Hart", message: "Please take a look at this...", time: "1h", avatar: "https://i.pravatar.cc/150?img=2", unread: 7 },
    { name: "Diane Lansdowne", message: "Done", time: "1h", avatar: "https://i.pravatar.cc/150?img=3", active: true },
    { name: "Rickie Baroch", message: "Cool", time: "1h 30m", avatar: "https://i.pravatar.cc/150?img=4", unread: 1 },
    { name: "Tsutsui Ichiha", message: "Anna contacted me with...", time: "2h", avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "Richardo Kann", message: "I'm gonna do that today so...", time: "2h", avatar: "https://i.pravatar.cc/150?img=6" },
    { name: "Farid Amini", message: "Farid sent a document", time: "2h 15m", avatar: "https://i.pravatar.cc/150?img=7" },
    { name: "Zoe Miller", message: "See you later", time: "3h", avatar: "https://i.pravatar.cc/150?img=8" },
    { name: "Yolanda Barrueco", message: "Yolanda shared a picture", time: "3h 10m", avatar: "https://i.pravatar.cc/150?img=9" },
  ];

  const handleSendFriendRequest = async () => {
    console.log(searchId);
    await dispatch(sendFriendRequest({ id: searchId })).then(res => console.log(res));
  }

  return (
    <div className="w-80 bg-white border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Messages</h2>
        <Popover>
          <PopoverTrigger className="text-blue-500 text-1xl font-medium">
            Add Friends +
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="hash" className="block text-sm font-medium text-gray-700">
                  <span className="text-lg font-semibold tracking-tight mb-2 block text-gray-900">Search by ID</span>
                </label>
                <input
                  type="text"
                  id="hash"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
      <div className="overflow-y-auto h-[calc(100vh-60px)]">
        {messages.map((msg, index) => (
          <MessageItem key={index} {...msg} />
        ))}
      </div>
    </div>
  );
}

export default MessageList;