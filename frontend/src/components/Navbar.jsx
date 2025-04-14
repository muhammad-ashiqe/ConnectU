import { useState, useEffect, useRef, useContext } from "react";
import { FiMessageSquare, FiSearch, FiUser, FiLogOut, FiExternalLink, FiX } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../context/chatContext";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const { token, user, setUser, selectedChats, setSelectedChats, chats, setChats } = useContext(ChatContext);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target) && showMobileSearch) {
        setShowMobileSearch(false);
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileSearch]);

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
      setSearchResults(response.data.users);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    if (!token) return;

    try {
      const response = await axios.post(
        `http://localhost:7000/api/chat/`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedChats(response.data);  // Update selected chat immediately
      setChats((prevChats) => [...prevChats, response.data]);  // Optionally update chat list if needed
    } catch (error) {
      console.error("Access Chat Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/auth");
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
    if (!showMobileSearch) {
      setTimeout(() => {
        const input = document.getElementById("mobile-search-input");
        if (input) input.focus();
      }, 0);
    } else {
      setShowResults(false);
    }
  };

  return (
    <nav className="bg-gray-900 py-3 px-4 sm:px-6 shadow-lg border-b border-gray-700">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <FiMessageSquare className="text-white text-xl" />
          </div>
          <h1 className="text-xl font-bold text-white hidden sm:block">ConnectU</h1>
        </div>

        {/* Desktop Search Bar - hidden on mobile */}
        <div className="relative hidden sm:block flex-grow max-w-md" ref={searchRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            title="Search users"
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
          />

          {/* Search Results */}
          {showResults && searchQuery && (
            <div className="absolute z-20 mt-2 w-full bg-gray-800 rounded-lg shadow-xl max-h-96 overflow-y-auto border border-gray-700">
              {loading ? (
                <div className="p-4 text-gray-400 text-center">Searching...</div>
              ) : searchResults?.length > 0 ? (
                searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="p-3 hover:bg-gray-700 cursor-pointer flex items-center border-b border-gray-700 last:border-b-0"
                    onClick={() => {
                      accessChat(user._id);
                      setShowResults(false);
                    }}
                  >
                    <div className="bg-gray-600 rounded-full h-10 w-10 flex items-center justify-center mr-3 shrink-0">
                      {user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt={user.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="text-gray-300 text-xl" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-gray-100 font-medium truncate">{user.name}</p>
                      <p className="text-gray-400 text-sm truncate">{user.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-400 text-center">No users found</div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Search - appears inline when toggled */}
        <div className="flex items-center gap-4">
          {showMobileSearch && (
            <div className="sm:hidden relative flex-grow" ref={mobileSearchRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="mobile-search-input"
                title="Search users"
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 border border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
              />

              {/* Mobile Search Results */}
              {showResults && searchQuery && (
                <div className="absolute z-20 mt-2 w-full bg-gray-800 rounded-lg shadow-xl max-h-96 overflow-y-auto border border-gray-700">
                  {loading ? (
                    <div className="p-4 text-gray-400 text-center">Searching...</div>
                  ) : searchResults?.length > 0 ? (
                    searchResults.map((user) => (
                      <div
                        key={user._id}
                        className="p-3 hover:bg-gray-700 cursor-pointer flex items-center border-b border-gray-700 last:border-b-0"
                        onClick={() => {
                          accessChat(user._id);
                          setShowResults(false);
                          setShowMobileSearch(false);
                        }}
                      >
                        <div className="bg-gray-600 rounded-full h-10 w-10 flex items-center justify-center mr-3 shrink-0">
                          {user.profilePic ? (
                            <img
                              src={user.profilePic}
                              alt={user.name}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <FiUser className="text-gray-300 text-xl" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-100 font-medium truncate">{user.name}</p>
                          <p className="text-gray-400 text-sm truncate">{user.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-gray-400 text-center">No users found</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mobile Search Button - shown only on mobile */}
          <button
            onClick={toggleMobileSearch}
            className="sm:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
          >
            {showMobileSearch ? <FiX className="text-xl" /> : <FiSearch className="text-xl" />}
          </button>

          {/* Profile Section */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="bg-gray-800 rounded-full h-10 w-10 flex items-center justify-center hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
            >
              <FiUser className="text-gray-300 text-lg" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg py-2 border border-gray-700 z-30">
                <div className="px-4 py-2 text-sm text-gray-200 border-b border-gray-700">
                  Signed in as
                  <div className="font-semibold text-white truncate">{user?.name}</div>
                  <div className="font-semibold text-white truncate">{user?.email}</div>
                </div>
                <button
                  onClick={() => alert("Go to profile")}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                >
                  <FiExternalLink /> Visit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
