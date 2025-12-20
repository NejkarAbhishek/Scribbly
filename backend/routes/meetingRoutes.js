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
import upload from "../middlewares/uploadMiddleware.js";



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

export default router;
