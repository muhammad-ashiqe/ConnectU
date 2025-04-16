import React, { useState } from 'react';

const MessageInput = ({ onSendMessage, isSending }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isSending) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex w-full">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 text-white rounded-l-lg py-3 px-4 focus:outline-none focus:ring-1 focus:ring-purple-500 border border-gray-600"
          disabled={isSending}
        />
        <button
          type="submit"
          className={`bg-purple-600 text-white px-6 py-3 rounded-r-lg transition ${
            isSending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
          }`}
          disabled={!message.trim() || isSending}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;