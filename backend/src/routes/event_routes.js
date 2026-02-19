const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/auth");
const upload = require("../middlewares/event_upload");
const { validateEvent } = require("../validators/event_validator");
const eventController = require("../controllers/event_controller");

// Create Event
router.post(
  "/",
  requireAuth,
  upload.single("image"),
  validateEvent,
  eventController.createEvent,
);

// Get Event Details
router.get("/:eventId", requireAuth, eventController.getEvent);

// Delete Event
router.delete("/:eventId", requireAuth, eventController.deleteEvent);

// Update Event
router.put(
  "/:eventId",
  requireAuth,
  upload.single("image"),
  validateEvent,
  eventController.updateEvent,
);

// Get All Events
router.get("/", requireAuth, eventController.getAllEvents);

// Get Soft Deleted Events
router.get("/deleted/all", requireAuth, eventController.getDeletedEvents);

// Restore Event
router.patch("/:eventId/restore", requireAuth, eventController.restoreEvent);

module.exports = router;
