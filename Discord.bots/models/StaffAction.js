const mongoose = require('mongoose');

const staffActionSchema = new mongoose.Schema({
  staffId: String,
  action: String,
  timestamp: { type: Date, default: Date.now },
});

const StaffAction = mongoose.model('StaffAction', staffActionSchema);
module.exports = StaffAction;
