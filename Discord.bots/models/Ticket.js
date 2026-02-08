const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  guildId: { type: String, required: true, index: true },
  channelId: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  username: { type: String, required: true },
  type: { type: String, required: true },
  status: { 
    type: String,
    enum: ['open', 'claimed', 'closed'],
    default: 'open'
  },
  claimedBy: {
    staffId: String,
    staffUsername: String,
    claimedAt: Date
  },
  closedBy: {
    staffId: String,
    staffUsername: String,
    closedAt: Date
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ticketSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);