const sequelize = require('../database/models').sequelize;

const eventRepo = require('../repositories/event_repository');
const stageRepo = require('../repositories/stage_repository');
const judgeRepo = require('../repositories/judge_repository');
const candidateRepo = require('../repositories/candidate_repository');

const crypto = require('crypto');

function generateInvitationCode(length = 6) {
    return crypto
        .randomBytes(length)
        .toString('base64')
        .replace(/[^A-Z0-9]/gi, '')
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

async function createEvent({
    title,
    description,
    date,
    timeStart,
    timeEnd,
    location,
    rounds,
    judges,
    candidates,
    userId,
}) {
    return sequelize.transaction(async (t) => {
        // 1️⃣ Create Event
        const event = await eventRepo.create(
            {
                title,
                description,
                date,
                timeStart,
                timeEnd,
                location,
                user_id: userId,
            },
            t
        );

        // 2️⃣ Create Stages (Rounds)
        for (let i = 1; i <= rounds; i++) {
            await stageRepo.create(
                {
                    round: i,
                    event_id: event.id,
                },
                t
            );
        }

        // 3️⃣ Create Judges
        for (let i = 0; i < judges; i++) {
            const invitationCode = await generateUniqueInvitationCode();
            await judgeRepo.create(
                {
                    name: `Judge ${i + 1}`,
                    invitationCode,
                    event_id: event.id,
                },
                t
            );
        }

        // 4️⃣ Create Candidates
        for (let i = 0; i < candidates; i++) {
            await candidateRepo.create(
                {
                    name: `Candidate ${i + 1}`,
                    event_id: event.id,
                },
                t
            );
        }

        return event;
    });
}

module.exports = { createEvent };
