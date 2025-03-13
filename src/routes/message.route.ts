import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

const messageRouters = express.Router();

messageRouters.get("/users", protectRoute, getUsersForSidebar);
messageRouters.get("/:id", protectRoute, getMessages);
messageRouters.post("/send/:id", protectRoute, sendMessage);

export default messageRouters;
