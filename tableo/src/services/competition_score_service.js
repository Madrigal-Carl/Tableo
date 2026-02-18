import api from "./api";

export const submitScores = (invitationCode, scores) => {
  return api.post(`/competition/submit/${invitationCode}`, scores);
};
