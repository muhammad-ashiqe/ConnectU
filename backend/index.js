import express from "express"
import chats from "./data/data.js";
import { configDotenv } from "dotenv";
import cors from "cors"



const app = express();
configDotenv()


const PORT = process.env.PORT


app.use(cors());
app.use(express.json())


app.get('/',(req,res)=>{
  res.send("Api is running")
})

app.get('/api/chats',(req,res)=>{
  res.send(chats)
})

app.get('/api/chats/:id',(req,res)=>{
  const chatId = req.params.id;

  const resultChat = chats.find((chat)=>chat._id === chatId) 

  if (resultChat) {
    res.send(resultChat)
  }else{
    res.send("no chat found try again")
  }
})

app.listen(PORT,()=>{
  console.log(`server started at localhost:${PORT}`)
})