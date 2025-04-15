import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatHeader from './ChatHeader';
import MessagesList from './MessageList';
import MessageInput from './MessageInput';
import EditGroupModal from './EditGroupModal';

const ChatWindow = ({ activeChat, onBack, isMobile, user, setActiveChat }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  if (!activeChat) return null;

  return (
    <div className="flex-1 flex flex-col bg-gray-800">
      <ChatHeader 
        activeChat={activeChat} 
        onBack={onBack} 
        isMobile={isMobile} 
        user={user} 
        onEditGroup={() => setIsEditModalOpen(true)}
      />
      
      <MessagesList messages={activeChat.messages} user={user} />
      
      <MessageInput />
      
      {isEditModalOpen && (
        <EditGroupModal
          activeChat={activeChat}
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          setActiveChat={setActiveChat}
        />
      )}
    </div>
  );
};

export default ChatWindow;