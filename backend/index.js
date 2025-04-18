import express from "express";
import http from "http";
import { configDotenv } from "dotenv";
import cors from "cors";
import { conncectDB } from "./config/db.js";
import { userRouter } from "./routes/userRoute.js";
import { chatRouter } from "./routes/chatRoute.js";
import { messageRouter } from "./routes/messageRoute.js";
import { Server as SocketIOServer } from "socket.io";

configDotenv();
conncectDB();

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://connect-u-ruddy.vercel.app/",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    if (userData && userData._id) {
      socket.join(userData._id);
      console.log("User connected:", userData._id);
      socket.emit("connected");
    }
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("new message", (newMessage) => {
    const chat = newMessage.chat;
    
    if (!chat || !chat._id) {
      return console.log("Chat not defined");
    }

    // Send message to all in the chat room except sender
    socket.to(chat._id).emit("message received", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});