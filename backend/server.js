import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Add route logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Add a test route to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Global error handler caught error:', err);
  res.status(500).json({ message: err.message || 'An unexpected error occurred' });
});

const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);
  
  socket.on("joinMeeting", (meetingId) => {
    socket.join(meetingId);
    console.log(`User ${socket.id} joined meeting ${meetingId}`);
    io.to(meetingId).emit("userJoined", socket.id);
  });

  socket.on("leaveMeeting", (meetingId) => {
    socket.leave(meetingId);
    console.log(`User ${socket.id} left meeting ${meetingId}`);
    io.to(meetingId).emit("userLeft", socket.id);
  });

  socket.on("signal", ({ meetingId, data }) => {
    socket.to(meetingId).emit("signal", { from: socket.id, data });
  });
  
  // Broadcast chat messages to all users in the meeting room
  socket.on("chat", (data) => {
    // Find the meeting room(s) this socket is in (excluding its own id room)
    const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
    rooms.forEach(room => {
      io.to(room).emit("chat", { user: socket.id, name: data.name, message: data.message });
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5001; // Change port to 5001 to avoid conflicts

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/IdeaBoard", {
    family: 4 // Use IPv4
  })
  .then(() => {
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
