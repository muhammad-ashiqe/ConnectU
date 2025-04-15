import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";


const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Invalid data passed into request" });
  }

  // Create new message instance
  const message = new Message({
    sender: req.user._id,
    content,
    chat: chatId,
  });

  // Save the message to database
  await message.save();

  // Populate the necessary fields
  const populatedMessage = await Message.populate(message, [
    { path: "sender", select: "name pic" },
    { path: "chat" },
    { 
      path: "chat.users", 
      select: "name pic email",
      model: User 
    }
  ]);

  // Update the chat's latest message
  await Chat.findByIdAndUpdate(chatId, { 
    latestMessage: populatedMessage 
  });

  res.json(populatedMessage);
};

const allMessages = async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name pic email")
    .populate("chat");
    
  res.json(messages);
};

export {sendMessage,allMessages}