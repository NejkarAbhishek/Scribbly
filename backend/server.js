import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import drawingRoutes from "./routes/drawingRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/IdeaBoard";
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    family: 4,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/drawings", drawingRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/meetings", meetingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
