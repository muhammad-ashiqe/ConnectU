import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatWindow = ({ activeChat, onBack, isMobile, user, setActiveChat }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [groupName, setGroupName] = useState(activeChat?.chatName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  if (!activeChat) return null;

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

  const handleEditGroup = () => {
    setGroupName(activeChat.chatName);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post(
        'http://localhost:7000/api/chat/rename',
        { chatId: activeChat._id, chatName: groupName },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setSuccess('Group renamed successfully');
      setActiveChat(data);
      setTimeout(() => setIsEditModalOpen(false), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to rename group');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put(
        'http://localhost:7000/api/chat/remove',
        { chatId: activeChat._id, userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.status === 200) {
        setActiveChat((prevChat) => {
          const updatedUsers = prevChat.users?.filter(user => user._id !== userId);
          const updatedMessages = prevChat.messages?.filter(msg => msg.sender._id !== userId);
          return {
            ...prevChat,
            users: updatedUsers,
            messages: updatedMessages,
          };
        });

        setSuccess('User removed successfully');
        setTimeout(() => setSuccess(null), 800);
      }
    } catch (err) {
      console.error('Failed to remove user:', err);
      setError(err.response?.data?.message || 'Failed to remove user');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setLoading(true);

      await axios.put(
        'http://localhost:7000/api/chat/remove',
        { chatId: activeChat._id, userId: user._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setSuccess('You have left the group');
      setTimeout(() => onBack(), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to leave group');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:7000/api/user/search?search=${searchQuery}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      const filtered = data.users.filter(
        (u) => !activeChat.users.some((existing) => existing._id === u._id)
      );

      setSearchResults(filtered);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleAddUser = async (userToAdd) => {
    try {
      const res = await axios.put(
        `http://localhost:7000/api/chat/add`,
        { chatId: activeChat._id, userId: userToAdd._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setActiveChat(res.data);
      setSearchQuery('');
      setSearchResults([]);
      setSuccess(`${userToAdd.name} added`);
      setTimeout(() => setSuccess(null), 800);
    } catch (err) {
      console.error('Add user failed:', err);
      setError(err.response?.data?.message || 'Failed to add user');
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim()) searchUsers();
      else setSearchResults([]);
    }, 400);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  return (
    <div className="flex-1 flex flex-col bg-gray-800">
      {/* Header */}
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
            onClick={handleEditGroup}
            disabled={loading}
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

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeChat.messages?.length > 0 ? (
          activeChat.messages.map((msg, index) => (
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

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg py-2 px-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition">
            Send
          </button>
        </div>
      </div>

      {/* Edit Group Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Edit Group</h3>
            </div>

            <div className="p-4">
              {error && <div className="mb-4 p-2 bg-red-900 text-red-200 rounded text-sm">{error}</div>}
              {success && <div className="mb-4 p-2 bg-green-900 text-green-200 rounded text-sm">{success}</div>}

              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white"
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Add Users</label>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchResults.length > 0 && (
                  <div className="bg-gray-700 mt-2 rounded-lg max-h-40 overflow-y-auto border border-gray-600">
                    {searchResults.map((u) => (
                      <div
                        key={u._id}
                        className="p-2 hover:bg-gray-600 cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-white">{u.name}</span>
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleAddUser(u)}
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">Group Members</label>
                <div className="bg-gray-700 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {activeChat.users.map((member) => {
                    const isAdmin = activeChat.groupAdmin?._id === member._id;
                    const isSelf = user._id === member._id;

                    return (
                      <div key={member._id} className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                            <span className="text-gray-300 text-sm">{member.name?.charAt(0)}</span>
                          </div>
                          <span className="text-white">{member.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isAdmin && <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">Admin</span>}
                          {isSelf ? (
                            <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">You</span>
                          ) : (
                            <button
                              onClick={() => handleRemoveUser(member._id)}
                              disabled={loading}
                              className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded disabled:opacity-50"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleLeaveGroup}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Leaving...' : 'Leave Group'}
                </button>
                <div>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    disabled={loading}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg mr-2 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={loading || !groupName.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
