import express from "express";
const router = express.Router();
import auth from '../middlewares/authMiddleware.js';
import { createNote, updateNote, deleteNote } from '../controllers/noteController.js';

router.use(auth);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
