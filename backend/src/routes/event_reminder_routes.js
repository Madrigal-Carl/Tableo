const express = require("express");
const {
  sendTomorrowReminders,
  sendOneHourReminders,
} = require("../scheduler/event_scheduler");
const router = express.Router();

// Test tomorrow reminders only
router.get("/tomorrow", async (req, res) => {
  try {
    await sendTomorrowReminders();
    res.json({ message: "Tomorrow reminder check executed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Test 1-hour reminders only
router.get("/1hour", async (req, res) => {
  try {
    await sendOneHourReminders();
    res.json({ message: "1-hour reminder check executed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
