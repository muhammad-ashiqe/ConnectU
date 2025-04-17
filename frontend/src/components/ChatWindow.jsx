import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EditGroupModal from "./EditGroupModal";
import { ChatContext } from "../context/chatContext";

const ChatWindow = ({ activeChat, onBack, isMobile, setActiveChat }) => {
  const { serverUrl, token, user, socket } = useContext(ChatContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const selectedChatCompare = useRef();

  axios.defaults.baseURL = serverUrl;
  axios.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat?._id) return;

      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`/api/message/${activeChat._id}`);
        setMessages(data.data || []);
        selectedChatCompare.current = activeChat;
        
        if (socket) {
          socket.emit("join chat", activeChat._id);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      selectedChatCompare.current = null;
    };
  }, [activeChat, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessage) => {
      if (
        !selectedChatCompare.current || 
        selectedChatCompare.current._id !== newMessage.chat._id
      ) {
        // Handle notification for other chats
        console.log("New message in different chat");
      } else {
        setMessages(prev => [...prev, newMessage]);
      }
    };

    socket.on("message received", handleMessageReceived);

    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, [socket]);

  const handleSendMessage = async (content) => {
    if (!content.trim() || isSending || !activeChat?._id) return;

    const tempMessage = {
      _id: Date.now().toString(),
      sender: user,
      content,
      chat: activeChat._id,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSending(true);
      setError(null);

      setMessages(prev => [...prev, tempMessage]);

      const { data } = await axios.post("/api/message", {
        content,
        chatId: activeChat._id,
      });

      if (socket) {
        socket.emit("new message", data.data);
      }

      setMessages(prev => prev.map(msg => 
        msg._id === tempMessage._id ? data.data : msg
      ));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
      setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
    } finally {
      setIsSending(false);
    }
  };

  if (!activeChat) return null;

  return (
    <div className="flex flex-col w-full h-full bg-gray-800">
      <ChatHeader
        activeChat={activeChat}
        onBack={onBack}
        isMobile={isMobile}
        user={user}
        onEditGroup={() => setIsEditModalOpen(true)}
      />

      <div className="flex-1 w-full overflow-y-auto">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-gray-400">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="h-full w-full flex items-center justify-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <MessageList messages={messages} user={user} />
        )}
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-800 w-full">
        <MessageInput onSendMessage={handleSendMessage} isSending={isSending} />
      </div>

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