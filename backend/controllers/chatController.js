import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";

// 🔹 Access or create a one-to-one chat
export const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ message: "userId is required" });

  try {
    // Check if a private chat already exists between the two users
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    }).populate("users", "-password").populate("latestMessage");

    // If exists, populate latest message sender and return
    if (chat) {
      chat = await User.populate(chat, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      return res.status(200).json(chat);
    }

    // Else, create a new private chat
    const newChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const fullChat = await Chat.findById(newChat._id).populate("users", "-password");
    res.status(201).json(fullChat);
  } catch (err) {
    res.status(500).json({ message: "Failed to access chat", error: err.message });
  }
};

// 🔹 Fetch all chats the logged-in user is part of
export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    // Populate sender of latest message
    const result = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: "Failed to fetch chats", error: err.message });
  }
};

// 🔹 Create a new group chat
export const createGroupChat = async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // No need for JSON.parse - users should come as an array
  if (users.length < 2) {
    return res.status(400).json({ message: "At least 2 other users required to form a group" });
  }

  const allUsers = [...users, req.user._id]; // Add current user's ID

  try {
    const group = await Chat.create({
      chatName: name,
      users: allUsers,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroup = await Chat.findById(group._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroup);
  } catch (err) {
    res.status(400).json({ message: "Failed to create group", error: err.message });
  }
};

// 🔹 Rename a group chat
export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    ).populate("users", "-password").populate("groupAdmin", "-password");

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Failed to rename group", error: err.message });
  }
};

// 🔹 Add a user to a group chat
export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Only add if user not already in the group
    if (!chat.users.includes(userId)) {
      chat.users.push(userId);
      await chat.save();
    }

    const updatedChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);
  } catch (err) {
    res.status(500).json({ message: "Failed to add user to group", error: err.message });
  }
};

// 🔹 Remove a user from a group chat
export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Remove the user
    chat.users = chat.users.filter(u => u.toString() !== userId);
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove user from group", error: err.message });
  }
};
