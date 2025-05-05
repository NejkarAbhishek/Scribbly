const Meeting = require('../models/Meeting');

exports.createMeeting = async (req, res, next) => {
  try {
    const { title } = req.body;
    const meeting = await Meeting.create({ title, owner: req.userId, members: [req.userId] });
    res.json(meeting);
  } catch (err) {
    next(err);
  }
};

exports.getMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find({ members: req.userId });
    res.json(meetings);
  } catch (err) {
    next(err);
  }
};

exports.getMeetingById = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    res.json(meeting);
  } catch (err) {
    next(err);
  }
};