import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiSearch, FiUserPlus, FiUserX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const CreateGroupModal = ({ isOpen, onClose, onCreateGroup, token }) => {
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const searchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:7000/api/user/search?search=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Filter out already selected users
      const filteredResults = response.data.users.filter(
        (user) => !selectedUsers.some((u) => u._id === user._id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };

  const handleSubmit = async () => {
    if (!groupName.trim() || selectedUsers.length < 2) {
      alert('Group name and at least 2 users are required');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:7000/api/chat/group',
        {
          name: groupName,
          users: selectedUsers.map((user) => user._id),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onCreateGroup(response.data);
      onClose();
      setGroupName('');
      setSelectedUsers([]);
      toast.success("group Created success")
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-gray-800 rounded-lg w-full max-w-md border border-gray-700"
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">Create New Group</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="Enter group name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Add Users
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Search users..."
              />
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="mt-2 bg-gray-700 rounded-lg max-h-40 overflow-y-auto border border-gray-600">
                {loading ? (
                  <div className="p-2 text-center text-gray-400">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="p-2 hover:bg-gray-600 cursor-pointer flex items-center"
                      onClick={() => handleAddUser(user)}
                    >
                      <div className="bg-gray-500 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm">{user.name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                      <div className="ml-auto">
                        <FiUserPlus className="text-green-400" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-center text-gray-400">No users found</div>
                )}
              </div>
            )}
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Selected Users ({selectedUsers.length})
              </label>
              <div className="bg-gray-700 rounded-lg p-2 space-y-2 max-h-40 overflow-y-auto border border-gray-600">
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 bg-gray-600 rounded"
                  >
                    <div className="flex items-center">
                      <div className="bg-gray-500 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm">{user.name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveUser(user._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiUserX />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!groupName || selectedUsers.length < 2}
            className={`px-4 py-2 text-white rounded-lg ${!groupName || selectedUsers.length < 2
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
              }`}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;