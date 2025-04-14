import React from 'react';

const NoChatSelected = () => {
  return (
    <div className="hidden md:flex flex-1 items-center justify-center">
      <div className="text-center p-6">
        <div className="mx-auto h-16 w-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-300">No chat selected</h3>
        <p className="text-gray-400 mt-1">
          Choose a conversation from the sidebar
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;