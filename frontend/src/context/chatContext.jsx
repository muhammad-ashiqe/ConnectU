import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:7000";

const ChatContext = createContext();

const ChatContextProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const [selectedChats, setSelectedChats] = useState(null);
  const [chats, setChats] = useState([]);
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState([]);

  const serverUrl = "http://localhost:7000";

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const newSocket = io(ENDPOINT, {
        auth: {
          token: localStorage.getItem('token')
        }
      });
      setSocket(newSocket);

      newSocket.emit("setup", user);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const value = {
    user,
    setUser,
    selectedChats,
    setSelectedChats,
    chats,
    setChats,
    token,
    serverUrl,
    socket,
    notification,
    setNotification
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContextProvider, ChatContext };