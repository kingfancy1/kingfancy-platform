const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true },
  userId: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'open' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);