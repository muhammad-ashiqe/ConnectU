import express from 'express'
import authMiddleware from "../middleware/authMiddleware.js";
import { allMessages, sendMessage } from '../controllers/messageController.js'

const messageRouter = express.Router()

messageRouter.post('/',authMiddleware,sendMessage)
messageRouter.get('/:chatId',authMiddleware,allMessages)

export {messageRouter}