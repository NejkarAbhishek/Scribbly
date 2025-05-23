import Meeting from "../models/Meeting.js";
import User from "../models/User.js";

export const createMeeting = async (req, res, next) => {
  try {
    console.log('Creating meeting - User ID:', req.userId);
    console.log('Creating meeting - Request body:', req.body);
    console.log('Creating meeting - Headers:', req.headers.authorization);
    
    const { name, description } = req.body;
    const meeting = await Meeting.create({
      name,
      description,
      createdBy: req.userId,
      members: [{ userId: req.userId }]
    });
    
    console.log('Meeting created successfully:', meeting._id);
    
    res.json({
      id: meeting._id,
      code: meeting.code
    });
  } catch (err) {
    console.error('Error creating meeting:', err);
    next(err);
  }
};

export const joinMeeting = async (req, res) => {
  try {
    console.log('Joining meeting - User ID:', req.userId);
    console.log('Request body:', req.body);
    console.log('Request params:', req.params);
    console.log('Request path:', req.path);
    console.log('Request URL:', req.originalUrl);
    
    let meeting;
    
    // Check if joining by code
    if (req.body.code) {
      console.log('Joining by code:', req.body.code);
      meeting = await Meeting.findOne({ code: req.body.code, isActive: true });
      console.log('Found meeting by code:', meeting ? meeting._id : 'No meeting found');
    }
    // Check if joining by ID
    else if (req.params.id) {
      console.log('Joining by ID:', req.params.id);
      meeting = await Meeting.findOne({ _id: req.params.id, isActive: true });
      console.log('Found meeting by ID:', meeting ? meeting._id : 'No meeting found');
    }
    else {
      console.log('No code or ID provided');
      return res.status(400).json({ message: "Meeting code or ID is required" });
    }
    
    // Check if meeting exists
    if (!meeting) {
      console.log('Meeting not found or already ended');
      return res.status(404).json({ message: "Meeting not found or already ended" });
    }

    // Add user to meeting members if not already a member
    const alreadyMember = meeting.members.some(m => m.userId.equals(req.userId));
    console.log('User is already a member:', alreadyMember);
    
    if (!alreadyMember) {
      meeting.members.push({ userId: req.userId });
      await meeting.save();
      console.log('Added user to meeting members');
    }

    console.log('Successfully joined meeting:', meeting._id);
    res.json({ message: "Meeting joined", meetingId: meeting._id });
  } catch (err) {
    console.error('Error joining meeting:', err);
    res.status(400).json({ message: err.message });
  }
};

export const getMeetings = async (req, res, next) => {
  try {
    console.log('Getting meetings - User ID:', req.userId);
    
    const meetings = await Meeting.find({
      "members.userId": req.userId,
      isActive: true
    });
    
    console.log(`Found ${meetings.length} meetings for user`);
    res.json(meetings);
  } catch (err) {
    console.error('Error getting meetings:', err);
    next(err);
  }
};

export const getMeetingById = async (req, res, next) => {
  try {
    console.log('Getting meeting by ID:', req.params.id);
    
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    
    res.json(meeting);
  } catch (err) {
    console.error('Error getting meeting by ID:', err);
    next(err);
  }
};

export const endMeeting = async (req, res) => {
  try {
    console.log('Ending meeting - ID:', req.params.id);
    
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    
    console.log('Meeting ended successfully');
    res.json({ message: "Meeting ended" });
  } catch (err) {
    console.error('Error ending meeting:', err);
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
