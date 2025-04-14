import express from "express";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const chatRouter = express.Router();

chatRouter.post("/", authMiddleware, accessChat);
chatRouter.get("/", authMiddleware, fetchChats);
chatRouter.post("/group", authMiddleware, createGroupChat);
chatRouter.post("/rename", authMiddleware, renameGroup);
chatRouter.put("/add", authMiddleware, addToGroup);
chatRouter.put("/remove", authMiddleware, removeFromGroup);

export { chatRouter };
