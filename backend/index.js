import express from "express"
import { configDotenv } from "dotenv";
import cors from "cors"
import { conncectDB } from "./config/db.js";
import { userRouter } from "./routes/userRoute.js";
import { chatRouter } from "./routes/chatRoute.js";
import { messageRouter } from "./routes/messageRoute.js";



const app = express();
configDotenv()


conncectDB()


const PORT = process.env.PORT || 7000


app.use(cors());
app.use(express.json())


app.get('/',(req,res)=>{
  res.send("Api is running")
})

app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)

app.listen(PORT,()=>{
  console.log(`server started at localhost:${PORT}`)
})




//85s5jPNrfYI8QoWa


//