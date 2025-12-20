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
  try {
    let meeting;

    // Check if joining by code
    if (req.body.code) {
      meeting = await Meeting.findOne({ code: req.body.code, isActive: true });
    }
    // Check if joining by ID
    else if (req.params.id) {
      meeting = await Meeting.findOne({ _id: req.params.id, isActive: true });
    }
    else {
      return res.status(400).json({ message: "Meeting code or ID is required" });
    }

    // Check if meeting exists
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found or already ended" });
    }

    // Add user to meeting members if not already a member
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const meetings = await Meeting.find({
      "members.userId": req.userId,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Meeting.countDocuments({
      "members.userId": req.userId,
      isActive: true
    });

    res.json({
      meetings,
      page,
      pages: Math.ceil(total / limit),
      total
    });
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

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const meetingImage = path.normalize(req.file.path);

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      meeting._id,
      { profileImage: meetingImage },
      { new: true }
    );

    updatedMeeting.profileImage = updatedMeeting.profileImage.replace(/\\/g, "/");

    res.status(200).json({
      message: "Profile updated successfully",
      meeting: updatedMeeting,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
