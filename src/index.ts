import { PORT } from "./params/env.params.js";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.route.js";
import connectDB from './config/db.js';
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import express from "express";
import messageRoutes from "./routes/message.route.js";
import mongoose from "mongoose";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("message", (data) => {
        io.emit("message", data);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}` ));
