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

export function calculateTotal(
  participantId,
  criteria,
  scores,
  categoryWeight = 1,
) {
  if (!scores[participantId]) return "-";

  const filledScores = criteria.map((c) => scores[participantId][c.id]);
  if (filledScores.some((s) => s === undefined || s === null)) return "-";

  // Compute raw category score (0–1)
  const categoryRaw = criteria.reduce((sum, c) => {
    const score = Number(scores[participantId][c.id] ?? 0);
    const weight = Number(c.weight) / 100; // convert % to 0-1
    return sum + (score / c.maxScore) * weight;
  }, 0);

  // Apply category weight (0–1) and scale to 100
  return (categoryRaw * categoryWeight * 100).toFixed(2);
}
