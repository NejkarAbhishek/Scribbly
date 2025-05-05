const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');

router.use(auth);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;