import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" : "/api";
console.log("API Base URL:", BASE_URL);

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      console.log("Data ::", data);
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      if (res) {
        set({ authUser: res.data });
        toast.success("Logged in successfully");
        console.log("calling socket.io");
        get().connectSocket();
        console.log("new user connected!");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
  
    if (!authUser || !authUser._id || get().socket?.connected) return;
  
    console.log("Connecting socket for user:", authUser._id);
  
    const newSocket = io(BASE_URL, {
      query: { userId: authUser._id },
      transports: ["websocket"], // Ensure WebSocket is used for better real-time performance
    });
  
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      set({ socket: newSocket }); // Set socket only after it's connected
    });
  
    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  
    newSocket.on("disconnect", () => {
      console.warn("Socket disconnected. Attempting to reconnect...");
    });
  
    newSocket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
      console.log("Updated online users:", get().onlineUsers);
    });
  },  

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket.connected) {
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("getOnlineUsers");
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
