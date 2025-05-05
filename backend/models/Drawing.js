const mongoose = require('mongoose');

const DrawingSchema = new mongoose.Schema({
  meeting: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['freehand', 'line', 'rect', 'circle', 'text'], default: 'freehand' },
  data: mongoose.Schema.Types.Mixed,
  color: { type: String, default: '#000000' },
  thickness: { type: Number, default: 2 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Drawing', DrawingSchema);