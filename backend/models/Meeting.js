// models/Meeting.js
import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 8);

const meetingSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      default: () => nanoid()
    },
    isActive: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ""
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Meeting", meetingSchema);
