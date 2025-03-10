import Message, { IMessage } from "../models/message.model.js";
import { Request, Response } from "express";
import User, { IUser } from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Rozszerzenie typu Request o autentykację
interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    // Możesz dodać inne pola użytkownika jeśli są używane
  };
}

export const getUsersForSidebar = async (
  req: any,
  res: any
) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers: IUser[] = await User.find({
      _id: { $ne: loggedInUserId }
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error: unknown) {
    console.error("Error in getUsersForSidebar: ", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages: IMessage[] = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error: unknown) {
    console.log("Error in getMessages controller: ", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const newMessage: IMessage = new Message({
      senderId,
      receiverId,
      text
    });

    await newMessage.save();

    // Wysyłanie powiadomienia przez WebSocket
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.emit("newMessage", {
        _id: newMessage._id,
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        text: newMessage.text,
        createdAt: newMessage.createdAt
      });
    }

    res.status(201).json(newMessage);
  } catch (error: unknown) {
    console.log("Error in sendMessage controller: ", error instanceof Error ? error.message : "Unknown error");
    res.status(500).json({ error: "Internal server error" });
  }
};
