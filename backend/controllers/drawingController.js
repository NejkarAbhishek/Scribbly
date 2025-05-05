const Drawing = require('../models/Drawing');

exports.createDrawing = async (req, res, next) => {
  try {
    const drawing = await Drawing.create({ ...req.body, author: req.userId });
    res.json(drawing);
  } catch (err) {
    next(err);
  }
};

exports.deleteDrawing = async (req, res, next) => {
  try {
    await Drawing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Drawing deleted' });
  } catch (err) {
    next(err);
  }
};
