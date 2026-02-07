const mongoose = require('mongoose');

const userRiskSchema = new mongoose.Schema({
  userId: String,
  riskScore: Number,
  reason: String,
});

const UserRisk = mongoose.model('UserRisk', userRiskSchema);
module.exports = UserRisk;
