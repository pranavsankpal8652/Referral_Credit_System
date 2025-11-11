import { Server as SocketIOServer } from "socket.io";

export function initSocketIO(httpServer: any) {
  // typo fixed
  const io = new SocketIOServer(httpServer, {
    cors: { origin: "http://localhost:3000", credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("⚡ Socket  connected:", socket.id);

    socket.on("JoinUserRoom", ({ userId }) => {
      // console.log("userID is ", userId);
      if (userId) {
        socket.join(userId);
        console.log(`✅ User ${userId} joined room ${userId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 User disconnected:", socket.id);
    });
  });

  return io;
}
