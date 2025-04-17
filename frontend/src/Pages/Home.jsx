import React, { useState, useEffect, useContext } from 'react';
import { ChatContext } from '../context/chatContext';
import axios from 'axios';
import ChatWindow from '../components/ChatWindow';
import MyChats from '../components/MyChats';
import NoChatSelected from '../components/NoChatSelected';
import Navbar from '../components/Navbar';
import CreateGroupModal from '../components/CreateGroup';

const Home = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false); // For Create Group Modal
  const { user, setChats, chats,serverUrl,token } = useContext(ChatContext);

  const fetchAllChats = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/chat/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  };

  useEffect(() => {
    fetchAllChats();

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !activeChat) {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeChat,token]);

  const handleChatSelect = (chat) => {
    const chatName = chat.isGroupChat
      ? chat.chatName
      : chat.users.find((u) => u._id !== user._id)?.name || 'Unknown';

    setActiveChat({ 
      ...chat, 
      name: chatName,
      user: user 
    });
    if (isMobile) setShowSidebar(false);
  };

  const handleBackToChats = () => {
    setActiveChat(null);
    setShowSidebar(true);
  };

  const handleCreateGroup = (newGroup) => {
    setChats((prevChats) => [newGroup, ...prevChats]);
    setIsCreateGroupModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200">
      <Navbar />

      <div className="flex flex-1 overflow-hidden relative">
        <div
          className={`${
            showSidebar ? 'flex' : 'hidden'
          } md:flex flex-col w-full md:w-80 bg-gray-800 border-r border-gray-700 z-10 absolute md:relative h-full`}
        >
          <MyChats
            chats={chats}
            activeChat={activeChat}
            user={user}
            onChatSelect={handleChatSelect}
            setIsCreateGroupModalOpen={setIsCreateGroupModalOpen} // Pass function to MyChats
          />
        </div>

        {activeChat ? (
          <ChatWindow
            activeChat={activeChat}
            onBack={handleBackToChats}
            isMobile={isMobile}
            user={user}
            setActiveChat={setActiveChat}
          />
        ) : (
          !isMobile && <NoChatSelected />
        )}
      </div>
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onCreateGroup={handleCreateGroup}
        token={localStorage.getItem('token')}
      />
    </div>
  );
};

export default Home;
