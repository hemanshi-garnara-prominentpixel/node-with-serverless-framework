import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const port = 4000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

// Map to track online users: userId -> socketId
const onlineUsers = new Map<string, string>();

io.on("connection", (socket: Socket) => {
  console.log("Client connected:", socket.id);

  // When a user comes online (tab opened)
  socket.on("userOnline", (userId: string) => {
    onlineUsers.set(userId, socket.id);
    console.log("User online:", userId);

    // Broadcast this user's status as active
    io.emit("userStatusUpdate", { userId, status: "Active" });
  });

  // When a user logs out explicitly
  socket.on("userOffline", (userId: string) => {
    if (onlineUsers.has(userId)) {
      onlineUsers.delete(userId);
      console.log("User went offline (logout):", userId);
      io.emit("userStatusUpdate", { userId, status: "Inactive" });
    }
  });

  // When a user disconnects unexpectedly (tab close, network issues)
  socket.on("disconnect", () => {
    const userId = [...onlineUsers.entries()].find(
      ([, sId]) => sId === socket.id
    )?.[0];

    if (userId) {
      onlineUsers.delete(userId);
      console.log("User disconnected:", userId);

      // Emit only this user's status as inactive
      io.emit("userStatusUpdate", { userId, status: "Inactive" });
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Socket.IO server running on port ${port}`);
});
