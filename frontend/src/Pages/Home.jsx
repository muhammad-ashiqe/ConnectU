import React, { useEffect, useState } from 'react'
import axios from "axios"

const Home = () => {
  const [chats,setChats] = useState([])

  const fetchChats =async()=>{
    const chats =await axios.get('http://localhost:7000/api/chats');
    setChats(chats.data)
  }

  useEffect(()=>{
    fetchChats()
  },[])
  return (
    <div>
     {chats.map((chat,index)=>(
      <p key={index}>{chat.chatName}</p>
     ))}
    </div>
  )
}

export default Home
