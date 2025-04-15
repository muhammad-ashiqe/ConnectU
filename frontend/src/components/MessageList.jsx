import React from 'react';

const MessagesList = ({ messages, user }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages?.length > 0 ? (
        messages.map((msg, index) => (
          <div key={index} className={`mb-4 flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${msg.sender._id === user._id ? 'bg-purple-600' : 'bg-gray-700'}`}>
              <p>{msg.content}</p>
              <p className={`text-xs mt-1 ${msg.sender._id === user._id ? 'text-purple-200' : 'text-gray-400'}`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}
    </div>
  );
};

export default MessagesList;