const express = require('express');
const VerificationLog = require('../models/VerificationLog');
const router = express.Router();

router.get('/logs', async (req, res) => {
  try {
    const logs = await VerificationLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
