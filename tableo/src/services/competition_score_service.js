import api from "./api";

export const submitScores = (invitationCode, scores) => {
  return api.post(`/competition/submit/${invitationCode}`, scores);
};

export const checkCategoryCompleted = async (invitationCode, categoryId) => {
  const res = await api.get(
    `/competition/check-category/${invitationCode}/${categoryId}`,
  );
  return res.data.completed;
};
