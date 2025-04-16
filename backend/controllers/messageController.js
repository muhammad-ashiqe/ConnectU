import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";

const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid data passed into request" 
      });
    }

    const newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };

    let message = await Message.create(newMessage);

    message = await message.populate([
      { path: "sender", select: "name pic" },
      { path: "chat" },
      { 
        path: "chat.users", 
        select: "name pic email",
        model: User 
      }
    ]);

    await Chat.findByIdAndUpdate(chatId, { 
      latestMessage: message 
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message
    });
  }
};

const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message
    });
  }
};

export { sendMessage, allMessages };