// socket.ts
import { io } from "socket.io-client";
import { useUserStore } from "@/zustand/store";

export const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL!, {
  withCredentials: true,
  autoConnect: true,
});

export const setupSocketListeners = (User: any, setUser: any) => {
  socket.on("connect", () => {
    console.log("✅ Connected to WebSocket server:", socket.id);
  });
  if (User?.id) {
    socket.emit("JoinUserRoom", { userId: User.id.toString() });
    console.log("🟢 Joined room:", User.id);
  }

  socket.on("UserUpdated", (data: any) => {
    console.log("📩 UserUpdated event received:", data);
    if (data?.user?.id === User?.id) {
      setUser(data.user);
      console.log("User data updated in real-time!");
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected from WebSocket server");
  });
};

// optional cleanup
export const cleanupSocket = () => {
  socket.removeAllListeners();
  //   console.log("🧹 Socket disconnected and cleaned up");
};
