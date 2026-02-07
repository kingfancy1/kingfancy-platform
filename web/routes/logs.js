const express = require('express');
const router = express.Router();

// Import your models
const VerificationLog = require('../models/VerificationLog');
const StaffAction = require('../models/StaffAction');

// Route to fetch all verification logs
router.get('/verification-logs', async (req, res) => {
  try {
    const logs = await VerificationLog.find().sort({ timestamp: -1 }); // Sort by latest first
    res.json(logs); // Send the logs back to the frontend
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verification logs', error });
  }
});

// Route to fetch staff actions
router.get('/staff-actions', async (req, res) => {
  try {
    const staffActions = await StaffAction.find().sort({ timestamp: -1 });
    res.json(staffActions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff actions', error });
  }
});

module.exports = router;
