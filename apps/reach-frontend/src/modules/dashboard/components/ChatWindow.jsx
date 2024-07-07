import React from 'react';

const Message = ({ content, sender, time, attachments }) => (
  <div className={`mb-4 ${sender === 'self' ? 'text-right' : ''}`}>
    <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${sender === 'self' ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}>
      <p>{content}</p>
      {attachments && (
        <div className="mt-2 flex space-x-2">
          {attachments.map((att, index) => (
            <img key={index} src={att} alt="attachment" className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}
    </div>
    <span className="block text-xs mt-1 text-gray-500">{time}</span>
  </div>
);

function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b flex items-center px-4 py-3">
        <img src="https://i.pravatar.cc/150?img=3" alt="Diane Lansdowne" className="w-10 h-10 rounded-full mr-3" />
        <div>
          <h2 className="text-lg font-semibold">Diane Lansdowne</h2>
          <span className="text-sm text-gray-500">Current task: Return to Zara</span>
        </div>
        <div className="ml-auto flex space-x-2">
          <button className="text-gray-500">🔍</button>
          <button className="text-gray-500">📹</button>
          <button className="text-gray-500">📞</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Message content="Hey, Anna told me about a new assignment from Microsoft. I'll be there tomorrow so I can do this task today" sender="other" time="6h ago" />
        <Message content="Yes, there will be some things to do for Katie from the Design Department. I'll send you an invoice in a moment. You need to reorder from this invoice. Once you have the products, send me a photo and I will contact Katie." sender="self" time="3h ago" />
        <Message content="Invoice.pdf 234 kB" sender="self" time="3h ago" attachments={['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150']} />
        <Message content="Done" sender="other" time="1h ago" />
      </div>
      <div className="bg-white p-4 flex items-center border-t">
        <input
          type="text"
          placeholder="Message Diane Lansdowne"
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button className="ml-2 text-gray-500">😊</button>
        <button className="ml-2 text-blue-500">
          <span className="text-xl">➤</span>
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;