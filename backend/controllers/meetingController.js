import Meeting from "../models/Meeting.js";
import User from "../models/User.js";

export const createMeeting = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const meeting = await Meeting.create({
      name,
      description,
      createdBy: req.userId,
      members: [{ userId: req.userId }]
    });
    res.json({
      id: meeting._id,
      code: meeting.code
    });
  } catch (err) {
    next(err);
  }
};

export const joinMeeting = async (req, res) => {
  const { code } = req.body;
  try {
    const meeting = await Meeting.findOne({ code, isActive: true });
    if (!meeting)
      return res.status(404).json({ message: "Meeting not found or already ended" });

    const alreadyMember = meeting.members.some(m => m.userId.equals(req.userId));
    if (!alreadyMember) {
      meeting.members.push({ userId: req.userId });
      await meeting.save();
    }

    res.json({ message: "Meeting joined", meetingId: meeting._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find({
      "members.userId": req.userId,
      isActive: true
    });
    res.json(meetings);
  } catch (err) {
    next(err);
  }
};

export const getMeetingById = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json(meeting);
  } catch (err) {
    next(err);
  }
};

export const endMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json({ message: "Meeting ended" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMeetingProfile = async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);
  console.log(meeting);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const meetingImage = path.normalize(req.file.path);

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      meeting,
      { profileImage },
      { new: true }
    );

    updatedMeeting.meetingImage = updatedMeeting.meetingImage.replace(/\\/g, "/");

    res.status(200).json({
      message: "Profile updated successfully",
      meeting: updatedMeeting,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
