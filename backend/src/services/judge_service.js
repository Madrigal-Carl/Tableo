const sequelize = require('../database/models').sequelize;
const judgeRepo = require('../repositories/judge_repository');
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

async function updateJudge(judgeId, data) {
    return sequelize.transaction(async (t) => {
        const eventId = await judgeRepo.findEventByJudgeId(judgeId, t);

        await judgeRepo.update(judgeId, data, t);

        return await judgeRepo.findByEventIncludingSoftDeleted(eventId, t);
    });
}

async function createOrUpdate(eventId, newCount, transaction = null) {
    const allJudges = await judgeRepo.findByEventIncludingSoftDeleted(
        eventId,
        transaction
    );

    // Ensure required judges exist
    for (let seq = 1; seq <= newCount; seq++) {
        const judge = allJudges.find(j => j.sequence === seq);

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
                transaction
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

module.exports = { updateJudge, createOrUpdate };
