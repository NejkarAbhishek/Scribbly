const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createDrawing, deleteDrawing } = require('../controllers/drawingController');

router.use(auth);
router.post('/', createDrawing);
router.delete('/:id', deleteDrawing);

module.exports = router;