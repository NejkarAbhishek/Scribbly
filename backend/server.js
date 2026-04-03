import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import initSocket from "./socket/socketHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
}));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use((req, res, next) => {
  next();
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || 'An unexpected error occurred' });
});

const httpServer = http.createServer(app);

// Initialize Socket.IO
initSocket(httpServer);

const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB().then(() => {
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
