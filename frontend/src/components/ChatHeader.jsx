import React from 'react';

const ChatHeader = ({ activeChat, onBack, isMobile, user, onEditGroup }) => {
  const getChatDetails = () => {
    if (activeChat.isGroupChat) {
      return {
        displayName: activeChat.chatName,
        isGroup: true,
        avatarText: activeChat.chatName?.charAt(0) || 'G'
      };
    } else {
      const otherUser = activeChat.users.find(u => u._id !== user._id);
      return {
        displayName: otherUser?.name || 'User',
        isGroup: false,
        avatarText: otherUser?.name?.charAt(0) || 'U',
      };
    }
  };

  const { displayName, isGroup, avatarText } = getChatDetails();

  return (
    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
      <div className="flex items-center">
        {isMobile && (
          <button onClick={onBack} className="mr-2 text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        <div className="relative mr-3">
          <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-gray-300">{avatarText}</span>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-white">{displayName}</h3>
          <p className="text-xs text-gray-400">{isGroup ? 'Group' : 'Private chat'}</p>
        </div>
      </div>
      {isGroup && (
        <button
          onClick={onEditGroup}
          className="text-white hover:text-white flex items-center bg-violet-600 px-3 py-2 rounded-2xl disabled:opacity-50"
          title="Edit group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          {!isMobile && <span className="ml-1 text-sm">Edit</span>}
        </button>
      )}
    </div>
  );
};

export default ChatHeader;