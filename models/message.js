
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  info: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  user: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
