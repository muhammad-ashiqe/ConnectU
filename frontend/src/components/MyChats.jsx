import React from 'react';
import { formatISTTime } from '../utils/helpers';

const MyChats = ({ chats, activeChat, user, onChatSelect, setIsCreateGroupModalOpen }) => {
  return (
    <div className="flex flex-col w-full h-full bg-gray-800 border-r border-gray-700">
      <div className="flex justify-between p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold">My Chats</h2>
        <button
          className="text-sm bg-violet-600 py-2 px-3 font-semibold rounded-2xl"
          onClick={setIsCreateGroupModalOpen}
        >
          Create new Group
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats?.map((chat) => {
          const chatName = chat.isGroupChat
            ? chat.chatName
            : chat.users[1].name || "Unknown";

          return (
            <div
              key={chat._id}
              className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 flex justify-between items-center transition-colors ${
                activeChat?._id === chat._id ? 'bg-gray-700' : ''
              }`}
              onClick={() => onChatSelect(chat)}
            >
              <div className="flex items-center">
                <div className="relative mr-3">
                  <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-300">{chatName.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">{chatName}</h3>
                  <p className="text-sm text-gray-400 truncate">
                    {chat.latestMessage?.content || 'Say hi!'}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400">
                  {formatISTTime(chat.updatedAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyChats;
