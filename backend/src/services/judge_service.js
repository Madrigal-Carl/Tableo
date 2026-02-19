const sequelize = require("../database/models").sequelize;
const { isEventEditable } = require("../utils/event_time_guard");
const judgeRepo = require("../repositories/judge_repository");
const categoryRepo = require("../repositories/category_repository");
const crypto = require("crypto");

function generateInvitationCode(length = 6) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^A-Z0-9]/gi, "")
    .substring(0, length)
    .toUpperCase();
}

async function generateUniqueInvitationCode() {
  let code;
  let exists = true;

  while (exists) {
    code = `JDG-${generateInvitationCode(6)}`;
    exists = await judgeRepo.findByInvitationCode(code);
  }

  return code;
}

async function updateJudge(invitationCode, data) {
  return sequelize.transaction(async (t) => {
    const judge = await judgeRepo.findByInvitationCode(invitationCode, t);
    if (!judge) {
      const err = new Error("Judge not found");
      err.status = 404;
      throw err;
    }

    const event = await judge.getEvent({ transaction: t });

    if (hasEventEnded(event)) {
      const err = new Error("Event has already ended");
      err.status = 403;
      throw err;
    }

    const payload = {
      name: data.name,
      suffix: data.suffix ?? null,
    };

    await judgeRepo.update(judge.id, payload, t);

    return await judgeRepo.findByEventIncludingSoftDeleted(event.id, t);
  });
}

async function createOrUpdate(eventId, newCount, transaction = null) {
  const allJudges = await judgeRepo.findByEventIncludingSoftDeleted(
    eventId,
    transaction,
  );

  // Ensure required judges exist
  for (let seq = 1; seq <= newCount; seq++) {
    const judge = allJudges.find((j) => j.sequence === seq);

    if (judge) {
      if (judge.deletedAt) {
        await judge.restore({ transaction });
      }
    } else {
      const invitationCode = await generateUniqueInvitationCode();

      await judgeRepo.create(
        {
          name: `Judge ${seq}`,
          sequence: seq,
          invitationCode,
          event_id: eventId,
        },
        transaction,
      );
    }
  }

  // Soft-delete extra judges
  for (const judge of allJudges) {
    if (judge.sequence > newCount && !judge.deletedAt) {
      await judge.destroy({ transaction });
    }
  }
}

function hasEventStarted({ date, timeStart }) {
  return !isEventEditable({ date, timeStart });
}

function hasEventEnded({ date, timeEnd }) {
  if (!timeEnd) return false;

  const now = new Date();
  const end = new Date(`${date}T${timeEnd}`);

  return now > end;
}

async function getEventForJudge(req) {
  const { event, judge } = req;

  if (!hasEventStarted(event)) {
    const err = new Error("Event has not started yet");
    err.status = 403;
    throw err;
  }

  if (hasEventEnded(event)) {
    const err = new Error("Event has already ended");
    err.status = 403;
    throw err;
  }

  const stagesWithCategories = await Promise.all(
    event.stages.map(async (stage) => {
      const categories = await categoryRepo.findByEventWithStagesAndCriteria(
        event.id,
        stage.id,
      );

      return {
        ...stage.get({ plain: true }),
        categories: categories.map((cat) => ({
          ...cat.get({ plain: true }),
          criteria: cat.criteria,
        })),
      };
    }),
  );

  return {
    event: {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      timeStart: event.timeStart,
      timeEnd: event.timeEnd,
      location: event.location,
      stages: stagesWithCategories,
      candidates: event.candidates,
    },
    judge: {
      id: judge.id,
      name: judge.name,
      suffix: judge.suffix,
      sequence: judge.sequence,
    },
  };
}
async function deleteJudge(judgeId) {
  return sequelize.transaction(async (t) => {
    const judge = await judgeRepo.findByIdIncludingSoftDeleted(judgeId, t);

    if (!judge || judge.deletedAt) {
      const err = new Error("Judge not found");
      err.status = 404;
      throw err;
    }

    const event = await judge.getEvent({ transaction: t });

    if (hasEventEnded(event)) {
      const err = new Error("Event has already ended");
      err.status = 403;
      throw err;
    }

    const deletedSequence = judge.sequence;

    // Soft delete
    await judge.destroy({ transaction: t });

    // Reorder remaining active judges
    const remainingJudges =
      await judgeRepo.findByEventIncludingSoftDeleted(event.id, t);

    for (const j of remainingJudges) {
      if (!j.deletedAt && j.sequence > deletedSequence) {
        await judgeRepo.update(
          j.id,
          { sequence: j.sequence - 1 },
          t
        );
      }
    }

    return await judgeRepo.findByEventIncludingSoftDeleted(event.id, t);
  });
}

module.exports = { updateJudge, createOrUpdate, getEventForJudge, deleteJudge };
