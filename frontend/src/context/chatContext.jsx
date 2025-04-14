import { createContext, useEffect, useState } from "react";

// Create the context
const ChatContext = createContext();

// Provider component
const ChatContextProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const [selectedChats, setSelectedChats] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [token]);

  const value = {
    user,
    setUser,
    selectedChats,
    setSelectedChats,
    chats,
    setChats,
    token,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContextProvider, ChatContext };
