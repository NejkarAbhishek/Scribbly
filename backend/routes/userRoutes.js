import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  deleteUser,
} from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";
const storage = multer.memoryStorage();

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
      new Error("Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.")
    );
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.post(
  "/uploadProfile",
  protect,
  upload.single("profileImage"),
  updateProfile
);
router.delete("/delete/:id", deleteUser);

export default router;
