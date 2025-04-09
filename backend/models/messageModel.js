import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true }
);


export const Message = mongoose.model("Message",MessageSchema)