const mongoose = require('mongoose');

const staffActionSchema = new mongoose.Schema({
  staffId: { type: String, required: true, index: true },
  staffUsername: { type: String, required: true },
  action: { type: String, required: true },
  actionType: { 
    type: String,
    enum: ['TICKET_CLAIMED', 'TICKET_CLOSED', 'USER_VERIFIED', 'OTHER'],
    default: 'OTHER'
  },
  targetUserId: String,
  channelId: String,
  details: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now }
});

staffActionSchema.index({ staffId: 1, timestamp: -1 });

module.exports = mongoose.model('StaffAction', staffActionSchema);