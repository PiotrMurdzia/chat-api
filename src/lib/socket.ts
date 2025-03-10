import { Server, type Socket } from "socket.io";
import express from "express";
import http from "http";

// Rozszerzone typy dla Socket.IO
interface ServerToClientEvents {
  getOnlineUsers: (onlineUsers: string[]) => void;
  newMessage: (message: any) => void; // Tutaj dodaj typ dla wiadomości
}

interface ClientToServerEvents { }
interface SocketData {
  userId?: string;
}

const app = express();
const server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

type UserSocketMap = Record<string, string>;
const userSocketMap: UserSocketMap = {};

export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId];
}

io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>) => {
  console.log("A user connected", socket.id);

  // Bezpieczne pobieranie userId z query params
  const userId = Array.isArray(socket.handshake.query.userId)
    ? socket.handshake.query.userId[0]
    : socket.handshake.query.userId;

  // Walidacja i zapis do mapy
  if (typeof userId === "string" && userId.trim()) {
    userSocketMap[userId] = socket.id;
    socket.data.userId = userId;
  }

  // Emitowanie aktualnej listy użytkowników
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Obsługa rozłączenia
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    // Bezpieczne usuwanie z mapy
    if (socket.data.userId) {
      delete userSocketMap[socket.data.userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  // Tutaj możesz dodać dodatkowe nasłuchiwacze zdarzeń:
  // socket.on("customEvent", (data) => { ... });
});

export { io, app, server };
