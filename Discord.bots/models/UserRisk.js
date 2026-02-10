const mongoose = require('mongoose');

const userRiskSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  riskScore: { type: Number, required: true, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  reason: { type: String, default: '' },
  details: { type: Object, default: {} },
  verified: { type: Boolean, default: false },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserRisk', userRiskSchema);w