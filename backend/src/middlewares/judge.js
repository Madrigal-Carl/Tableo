const judgeRepo = require('../repositories/judge_repository');
const eventRepo = require('../repositories/event_repository');

module.exports = async function requireJudgeInvitation(req, res, next) {
  try {
    const { invitationCode } = req.params;

    if (!invitationCode) {
      return res.status(400).json({ message: 'Invitation code is required' });
    }

    const judge = await judgeRepo.findByInvitationCode(invitationCode);

    if (!judge || judge.deletedAt) {
      return res.status(404).json({ message: 'Invalid or expired invitation code' });
    }

    const event = await eventRepo.findByIdWithRelations(judge.event_id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    req.judge = judge;
    req.event = event;

    next();
  } catch (err) {
    next(err);
  }
};
