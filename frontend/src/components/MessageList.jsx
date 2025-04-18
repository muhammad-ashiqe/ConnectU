import React, { useEffect, useRef, useState } from "react";

// Avatar component for both users
const Avatar = ({ name, isCurrentUser }) => (
  <div className={`flex-shrink-0 ${isCurrentUser ? "ml-3" : "mr-3"}`}>      
    <div
      className={`h-10 w-10 rounded-full flex items-center justify-center text-white shadow-md ${
        isCurrentUser ? "bg-indigo-500" : "bg-purple-500"
      }`}
    >
      {name ? name.charAt(0).toUpperCase() : "?"}
    </div>
  </div>
);

// Single message bubble
const MessageBubble = ({ message, isCurrentUser }) => (
  <div className={`group flex items-end ${isCurrentUser ? "justify-end" : "justify-start"}`}>      
    {!isCurrentUser && <Avatar name={message.sender.name} isCurrentUser={false} />}

    <div
      className={`relative max-w-xs md:max-w-md p-4 rounded-2xl shadow-lg break-words transition-colors duration-200 ${
        isCurrentUser
          ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
          : "bg-gray-700 text-gray-100 hover:bg-gray-500"
      }`}
    >
      {!isCurrentUser && (
        <p className="text-sm font-semibold mb-1">{message.sender.name}</p>
      )}
      <p className="text-base leading-relaxed">{message.content}</p>
      {/* Timestamp appears on hover */}
      <span className="absolute text-xs text-gray-300 bottom-1 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>

    {isCurrentUser && <Avatar name={message.sender.name} isCurrentUser={true} />}
  </div>
);

// Messages list with smart auto-scroll
const MessagesList = ({ messages, user }) => {
  const containerRef = useRef(null);
  const endRef = useRef(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // Handler to detect if user scrolled away from bottom
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setIsAutoScroll(scrollHeight - scrollTop - clientHeight < 150);
  };

  // Scroll when new messages arrive, only if user was near bottom
  useEffect(() => {
    if (isAutoScroll && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAutoScroll]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
    >
      {messages && messages.length > 0 ? (
        messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isCurrentUser={msg.sender._id === user.id}
          />
        ))
      ) : (
        <div className="flex-grow flex items-center justify-center text-gray-500">
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default MessagesList;
