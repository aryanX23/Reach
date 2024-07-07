import React from 'react';

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

  return (
    <div className="w-80 bg-white border-r">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Messages</h2>
        <button className="text-blue-500 text-3xl">+</button>
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