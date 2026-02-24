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
export const getCategoryJudgeStatuses = async (
  invitationCode,
  categoryId
) => {
  const res = await api.get(
    `/competition/category/${invitationCode}/${categoryId}/judge-status`
  );

  return res.data; // backend returns judge status array
};