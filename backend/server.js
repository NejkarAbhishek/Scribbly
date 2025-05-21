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

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);

const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  socket.on("joinMeeting", (meetingId) => {
    socket.join(meetingId);
    io.to(meetingId).emit("userJoined", socket.id);
  });

  socket.on("leaveMeeting", (meetingId) => {
    socket.leave(meetingId);
    io.to(meetingId).emit("userLeft", socket.id);
  });

  socket.on("signal", ({ meetingId, data }) => {
    socket.to(meetingId).emit("signal", { from: socket.id, data });
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/IdeaBoard", {
    useNewUrlParser: true,
    family: 4,
    useUnifiedTopology: true
  })
  .then(() => {
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
