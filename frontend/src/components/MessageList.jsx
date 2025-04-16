import React from "react";

const MessagesList = ({ messages, user }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages?.length > 0 ? (
        messages.map((msg, index) => {
          console.log("message", msg._id);
          console.log("user id",user)

          const isCurrentUser = msg.sender._id === user.id;

          return (
            <div
              key={index}
              className={`mb-4 flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {/* For messages from other users, display the profile circle placeholder */}
              {!isCurrentUser && (
                <div className="relative mr-3">
                  <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-300">
                      {msg.sender.name
                        ? msg.sender.name.charAt(0).toUpperCase()
                        : "?"}
                    </span>
                  </div>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`p-3 rounded-lg max-w-xs md:max-w-md 
                  ${
                    isCurrentUser
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-100"
                  }`}
              >
                {/* For messages from others, display sender's name on top */}
                {!isCurrentUser && (
                  <p className="text-sm text-gray-200 mb-1">
                    {msg.sender.name}
                  </p>
                )}
                <p>{msg.content}</p>
                <p className="text-xs mt-1 text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}
    </div>
  );
};

export default MessagesList;
