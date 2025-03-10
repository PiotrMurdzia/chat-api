import { checkAuth, login, logout, signup } from "../controllers/auth.controller.js";

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRouters = express.Router();

authRouters.post("/signup", signup);
authRouters.post("/login", login);
authRouters.post("/logout", logout);

authRouters.get("/check", protectRoute, checkAuth);

export default authRouters;
