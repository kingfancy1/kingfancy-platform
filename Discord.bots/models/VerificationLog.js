const mongoose = require('mongoose');

const verificationLogSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  username: { type: String, required: true },
  verified: { type: Boolean, default: false },
  method: { type: String, enum: ['button', 'captcha', 'manual'], default: 'button' },
  riskScore: { type: Number, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  timestamp: { type: Date, default: Date.now },
  details: { type: String, default: '' }
});

verificationLogSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('VerificationLog', verificationLogSchema);