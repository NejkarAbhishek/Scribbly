import express from "express";
import {
  createMeeting,
  viewMeetings,
  joinMeeting,
  manageMembers,
  getMeetingById,
  getAdminOverview,
  updateMeetingProfile,
  getAllChats,
  sendChat
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


router.post("/create", protect, upload.single("image"), createMeeting);
router.get("/", protect, viewMeetings);
router.get("/:id", protect, getMeetingById);
router.post("/:id/join", protect, joinMeeting);
router.put("/:id/members", protect, manageMembers);
router.get("/api/admin-overview", protect, getAdminOverview);
router.post(
  "/:id/uploadMeetingImage",
  protect,
  upload.single("image"),
  updateMeetingProfile
);
router.post("/:id/chat", protect, sendChat);
router.get("/:id/chats", protect, getAllChats);


export default router;
