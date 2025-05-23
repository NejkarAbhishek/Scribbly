import express from "express";
import {
  createMeeting,
  getMeetings,
  joinMeeting,
  getMeetingById,
  endMeeting,
  updateMeetingProfile,
} from "../controllers/meetingController.js";
import protect from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = "meetingImages/"; 
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/; 
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); 
  } else {
    cb(
      new Error("Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed."),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = express.Router();

// Route for creating a new meeting
router.post("/create", protect, upload.single("image"), createMeeting);

// Route for getting all meetings for the authenticated user
router.get("/", protect, getMeetings);

// Route for getting a specific meeting by ID
router.get("/:id", protect, getMeetingById);

// Route for joining a meeting by ID
router.post("/:id/join", protect, joinMeeting);

// Route for joining a meeting by code (use this endpoint pattern to match the frontend service call)
router.post("/join-by-code", protect, joinMeeting);

// Route for ending a meeting
router.patch("/:id/end", protect, endMeeting);

// Route for updating meeting profile image
router.post(
  "/:id/uploadMeetingImage",
  protect,
  upload.single("image"),
  updateMeetingProfile
);
//router.post("/:id/chat", protect, sendChat);
//router.get("/:id/chats", protect, getAllChats);

export default router;
