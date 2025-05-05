const User = require('../models/User');

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    res.json(user);
  } catch (err) {
    next(err);
  }
};