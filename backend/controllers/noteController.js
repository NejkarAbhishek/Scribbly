import Note from '../models/Notes.js';

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({ ...req.body, author: req.userId });
    res.json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
    try {
      await Note.findByIdAndDelete(req.params.id);
      res.json({ message: 'Note updated' });
    } catch (err) {
      next(err);
    }
  };

export const deleteNote = async (req, res, next) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
};




