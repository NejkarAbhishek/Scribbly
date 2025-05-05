import Meeting from '../models/Meeting.js';

export const createMeeting = async (req, res, next) => {
  try {
    const { title } = req.body;
    const meeting = await Meeting.create({ title, owner: req.userId, members: [req.userId] });
    res.json(meeting);
  } catch (err) {
    next(err);
  }
};

export const joinMeeting = async (req, res) => {
    const { id } = req.params;
  
    try {
      const meeting = await Meeting.findById(id);
      if (!meeting)
        return res.status(404).json({ message: "Community not found" });
  
      // Check if user is already a member
      const isMember = meeting.members.some(
        (member) => member.userId.toString() === req.user._id.toString()
      );
      if (isMember)
        return res
          .status(400)
          .json({ message: "Already a member or request pending" });

      community.members.push({ userId: req.user._id });
      await community.save();

      const user = await User.findById(req.user._id);
      if (!user.communities.includes(meeting._id)) {
        user.communities.push(meeting._id);
        await user.save();
      }
  
      res.status(200).json({ message: "Join request sent successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
export const getMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find({ members: req.userId });
    res.json(meetings);
  } catch (err) {
    next(err);
  }
};

export const getMeetingById = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json(meeting);
  } catch (err) {
    next(err);
  }
};

export const updateMeetingProfile = async (req, res) => {
    const meetingId = req.params.id; // Ensure you get the ID from params
  
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
      }
  
      const image = path.normalize(req.file.path);
  
      // Update the community profile image in the database
      const updateMeeting = await Meeting.findByIdAndUpdate(
        meetingId,
        { image },
        { new: true }
      );

      updateMeeting.image = updateMeeting.image.replace(/\\/g, "/");

      const populatedMeeting = await Meeting.findById(meetingId)
        .populate("createdBy", "name email")
        .populate("members.userId", "name email profileImage");
  
      res.status(200).json({
        message: "Meeting updated successfully",
        meeting: populatedMeeting,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update profile" });
    }
  };

  export const viewMeetings = async (req, res) => {
    try {
      const meetings = await Meeting.find()
        .populate("createdBy", "name email") 
        .select("name description members createdBy"); 

      const formattedMeetings = meetings.map((community) => {
        return {
          id: meeting._id,
          name: meeting.name,
          description: meeting.description,
          image: meeting.image,
          members: meeting.members.map((member) => ({
            userId: meeting.userId,
            status: meeting.status,
          })),
          createdBy: {
            id: meeting.createdBy._id,
            name: meeting.createdBy.name,
            email: meeting.createdBy.email,
          },
        };
      });
  
      res.status(200).json(formattedMeetings);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };