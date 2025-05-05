import Drawing from '../models/Drawing.js';

export const createDrawing = async (req, res, next) => {
  try {
    const drawing = await Drawing.create({ ...req.body, author: req.userId });
    res.json(drawing);
  } catch (err) {
    next(err);
  }
};

export const deleteDrawing = async (req, res, next) => {
  try {
    await Drawing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Drawing deleted' });
  } catch (err) {
    next(err);
  }
};
