import express from "express";
const router = express.Router();
import auth from '../middlewares/authMiddleware.js';
import {createDrawing, deleteDrawing} from '../controllers/drawingController.js';

router.use(auth);
router.post('/', createDrawing);
router.delete('/:id', deleteDrawing);

export default router;