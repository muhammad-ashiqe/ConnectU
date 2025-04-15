import React from 'react';

const MessageInput = () => {
  return (
    <div className="p-4 border-t border-gray-700">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
        <button className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition">
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;