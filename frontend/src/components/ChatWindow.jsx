import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EditGroupModal from "./EditGroupModal";
import { ChatContext } from "../context/chatContext";

const ChatWindow = ({ activeChat, onBack, isMobile, user, setActiveChat }) => {
  
  const { serverUrl, token } = useContext(ChatContext);
  // Configure axios
  axios.defaults.baseURL = serverUrl;
  axios.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Fetch messages when chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat?._id) return;

      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`/api/message/${activeChat._id}`);
        setMessages(data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeChat]);

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

      // Create optimistic update
      setMessages((prev) => [...prev, tempMessage]);

      // Send to server
      const { data } = await axios.post("/api/message", {
        content,
        chatId: activeChat._id,
      });

      // Replace temporary message with server response
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempMessage._id ? data.data : msg))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
      // Remove the optimistic update if failed
      setMessages((prev) => prev.filter((msg) => msg._id !== tempMessage._id));
    } finally {
      setIsSending(false);
    }
  };

  if (!activeChat) return null;

  return (
    <div className="flex flex-col w-full h-full bg-gray-800">
      {/* Header */}
      <ChatHeader
        activeChat={activeChat}
        onBack={onBack}
        isMobile={isMobile}
        user={user}
        onEditGroup={() => setIsEditModalOpen(true)}
      />

      {/* Messages List - flex-1 to take available space */}
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

      {/* Message Input - fixed at bottom */}
      <div className="p-4 border-t border-gray-700 bg-gray-800 w-full">
        <MessageInput onSendMessage={handleSendMessage} isSending={isSending} />
      </div>

      {/* Edit Group Modal */}
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
