const cron = require("node-cron");
const eventRepo = require("../repositories/event_repository");
const { sendEventReminderEmail } = require("../services/mail_service");

/**
 * Convert event date + start time to a proper Date object
 */
function parseEventDate(event) {
  const eventDate = new Date(event.date);
  if (event.timeStart) {
    const [hours, minutes, seconds] = event.timeStart.split(":").map(Number);
    eventDate.setHours(hours, minutes, seconds || 0);
  }
  return eventDate;
}

/**
 * Check if the event is tomorrow (ignores time, only date)
 */
function isTomorrow(event) {
  const eventDate = parseEventDate(event);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const eventYMD = eventDate.toISOString().split("T")[0];
  const tomorrowYMD = tomorrow.toISOString().split("T")[0];

  return eventYMD === tomorrowYMD;
}

/**
 * Check if the event is starting in 1 hour (with a 3-min window)
 */
function isStartingInOneHour(event) {
  const eventDate = parseEventDate(event);
  const nowHour = new Date();
  nowHour.setMinutes(0, 0, 0); // zero minutes and seconds

  const diffHours = Math.round((eventDate - nowHour) / (1000 * 60 * 60));
  return diffHours === 1;
}

/**
 * Send reminders for tomorrow events
 */
async function sendTomorrowReminders() {
  console.log("Running tomorrow event reminders...");
  try {
    const events = await eventRepo.getAllEvents({
      include: [{ model: require("../database/models").User, as: "creator" }],
    });

    for (const event of events) {
      if (!isTomorrow(event)) continue;

      const adminEmail = event.creator?.email;
      if (!adminEmail) {
        console.warn(`Event "${event.title}" has no creator email, skipping`);
        continue;
      }

      try {
        await sendEventReminderEmail(
          adminEmail,
          event.title,
          parseEventDate(event),
          "tomorrow",
        );
        console.log("Tomorrow reminder sent to:", adminEmail);
      } catch (err) {
        console.error("Failed to send tomorrow reminder:", err.message);
      }
    }
  } catch (err) {
    console.error("Error fetching events for tomorrow reminders:", err.message);
  }
}

/**
 * Send reminders for 1-hour-before events
 */
async function sendOneHourReminders() {
  console.log("Running 1-hour event reminders...");
  try {
    const events = await eventRepo.getAllEvents({
      include: [{ model: require("../database/models").User, as: "creator" }],
    });

    for (const event of events) {
      if (!isStartingInOneHour(event)) continue;

      const adminEmail = event.creator?.email;
      if (!adminEmail) {
        console.warn(`Event "${event.title}" has no creator email, skipping`);
        continue;
      }

      try {
        await sendEventReminderEmail(
          adminEmail,
          event.title,
          parseEventDate(event),
          "1hour",
        );
        console.log("1-hour reminder sent to:", adminEmail);
      } catch (err) {
        console.error("Failed to send 1-hour reminder:", err.message);
      }
    }
  } catch (err) {
    console.error("Error fetching events for 1-hour reminders:", err.message);
  }
}

// Cron jobs
cron.schedule("0 8 * * *", sendTomorrowReminders, { timezone: "Asia/Manila" }); // 8:00 AM daily
cron.schedule("0 * * * *", sendOneHourReminders, { timezone: "Asia/Manila" }); // every hour

module.exports = { sendTomorrowReminders, sendOneHourReminders };
