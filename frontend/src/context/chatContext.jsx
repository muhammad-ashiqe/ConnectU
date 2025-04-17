import { createContext, useEffect, useState } from "react";

// Create the context
const ChatContext = createContext();

// Provider component
const ChatContextProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const [selectedChats, setSelectedChats] = useState(null);
  const [chats, setChats] = useState([]);

  const serverUrl = "http://localhost:7000";

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(()=>{
    const storedToken = localStorage.getItem('token');
    if(storedToken){
      setToken(storedToken)
    } 
  },[])


  const value = {
    user,
    setUser,
    selectedChats,
    setSelectedChats,
    chats,
    setChats,
    token,
    serverUrl,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContextProvider, ChatContext };
