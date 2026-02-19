const sequelize = require("../database/models").sequelize;

const eventRepo = require("../repositories/event_repository");
const stageService = require("./stage_service");
const candidateService = require("./candidate_service");
const judgeService = require("./judge_service");
const { isEventEditable } = require("../utils/event_time_guard");
const {
  Stage,
  Judge,
  Candidate,
  CompetitionScore,
} = require("../database/models");

async function createEvent({
  title,
  description,
  date,
  timeStart,
  timeEnd,
  location,
  stages,
  judges,
  candidates,
  userId,
  path,
}) {
  return sequelize.transaction(async (t) => {
    const event = await eventRepo.create(
      {
        title,
        description,
        date,
        timeStart,
        timeEnd,
        location,
        path,
        user_id: userId,
      },
      t,
    );

    await stageService.createOrUpdate(event.id, stages, t);
    await judgeService.createOrUpdate(event.id, judges, t);
    await candidateService.createOrUpdate(event.id, candidates, t);
    return event;
  });
}

async function deleteEvent(eventId, userId) {
  try {
    await eventRepo.softDelete(eventId, userId);
    return { message: "Event deleted successfully" };
  } catch (err) {
    throw err;
  }
}

async function getEvent(eventId, userId) {
  const event = await eventRepo.findByIdWithRelations(eventId);

  if (!event) throw new Error("Event not found");
  if (event.user_id !== userId) throw new Error("Unauthorized");

  return event;
}

function normalizeTime(t) {
  if (!t) return null;
  return t.length === 5 ? `${t}:00` : t; // "HH:mm" → "HH:mm:00"
}

async function updateEvent(eventId, userId, payload) {
  return sequelize.transaction(async (t) => {
    const event = await eventRepo.findByIdWithRelations(eventId, t);

    if (!event) throw new Error("Event not found");
    if (event.user_id !== userId) throw new Error("Unauthorized");

    // ⛔ Lock editing once event has started
    if (
      !isEventEditable({
        date: event.date,
        timeStart: event.timeStart,
      })
    ) {
      const err = new Error(
        "Event has already started and can no longer be edited",
      );
      err.status = 403;
      throw err;
    }

    const incomingTimeStart = normalizeTime(payload.timeStart);
    const existingTimeStart = normalizeTime(event.timeStart);

    const eventHasStarted = !isEventEditable({
      date: event.date,
      timeStart: event.timeStart,
    });

    if (
      eventHasStarted &&
      incomingTimeStart &&
      incomingTimeStart !== existingTimeStart
    ) {
      const err = new Error(
        "Event start time cannot be modified after the event has started",
      );
      err.status = 400;
      throw err;
    }

    if (eventHasStarted) {
      delete payload.timeStart;
    }

    await eventRepo.update(eventId, payload, t);

    // NEW (correct)
    await candidateService.syncByCount(eventId, payload.candidates, t);
    await judgeService.createOrUpdate(eventId, payload.judges, t);
    await stageService.createOrUpdate(eventId, payload.stages, t);

    const updated = await eventRepo.findByIdWithRelations(eventId, t);

    return {
      ...updated.toJSON(),
      stages: updated.stages.length,
      judges: updated.judges.length,
      candidates: updated.candidates.length,
    };
  });
}

async function getAllEvents(userId) {
  const events = await eventRepo.findByUser(userId);

  return events.map((ev) => ({
    ...ev.toJSON(),
    stages: ev.stages.length,
    judges: ev.judges.length,
    candidates: ev.candidates.length,
  }));
}

async function getDeletedEvents(userId) {
  const events = await eventRepo.findDeletedByUser(userId);

  return events.map((ev) => ({
    ...ev.toJSON(),
    stages: ev.stages.length,
    judges: ev.judges.length,
    candidates: ev.candidates.length,
  }));
}

async function restoreEvent(eventId, userId) {
  return sequelize.transaction(async (t) => {
    const event = await eventRepo.findDeletedById(eventId, t);

    if (!event) throw new Error("Event not found");
    if (event.user_id !== userId) throw new Error("Unauthorized");

    // 1️⃣ Restore Event
    await eventRepo.restore(eventId, t);

    // 2️⃣ Restore direct relations
    await Promise.all([
      Stage.restore({ where: { event_id: eventId }, transaction: t }),
      Judge.restore({ where: { event_id: eventId }, transaction: t }),
      Candidate.restore({ where: { event_id: eventId }, transaction: t }),
    ]);

    // 3️⃣ Restore Categories + their relations
    const categories = await sequelize.models.Category.findAll({
      where: { event_id: eventId },
      paranoid: false,
      transaction: t,
    });

    for (const cat of categories) {
      await cat.restore({ transaction: t });

      // Restore the many-to-many table with Stage
      await sequelize.models.CategoryStage.restore({
        where: { category_id: cat.id },
        transaction: t,
      });

      // Restore Criteria
      const criteria = await sequelize.models.Criterion.findAll({
        where: { category_id: cat.id },
        paranoid: false,
        transaction: t,
      });

      for (const crit of criteria) {
        await crit.restore({ transaction: t });

        // ✅ Restore all CompetitionScores tied to this criterion
        await CompetitionScore.restore({
          where: { criterion_id: crit.id },
          transaction: t,
        });
      }
    }

    // 4️⃣ Fetch fully restored event
    const restored = await eventRepo.findByIdWithRelations(eventId, t);

    return restored;
  });
}

module.exports = {
  createEvent,
  getEvent,
  deleteEvent,
  updateEvent,
  getAllEvents,
  getDeletedEvents,
  restoreEvent,
};
