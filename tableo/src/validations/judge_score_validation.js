// Check if all scores are filled
export function validateScores(participants, criteria, scores) {
  for (const participant of participants) {
    for (const criterion of criteria) {
      const value = scores[participant.id]?.[criterion.id];
      if (value === undefined || value === "") {
        return false; // missing score
      }
    }
  }
  return true; // all scores filled
}

// Optional: calculate total for a participant
export function calculateTotal(participantId, criteria, scores) {
  if (!scores[participantId]) return "-";

  const filledScores = criteria.map((c) => scores[participantId][c.id]);
  if (filledScores.some((s) => s === undefined || s === null)) return "-";

  return criteria
    .reduce((sum, c) => {
      const score = Number(scores[participantId][c.id] ?? 0);
      return sum + (score / c.maxScore) * c.weight;
    }, 0)
    .toFixed(2);
}
