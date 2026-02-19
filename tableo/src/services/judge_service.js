import api from "./api";

export const getEventForJudge = async (invitationCode) => {
  const res = await api.get(`/judge/event/${invitationCode}`);
  return res.data;
};

export const updateJudge = async (invitationCode, payload) => {
  const res = await api.put(`/judge/me/${invitationCode}`, payload);
  return res.data;
};

export const deleteJudge = async (judgeId) => {
  const res = await api.delete(`/judge/${judgeId}`);
  return res.data;
};

export const createOrUpdate = async (eventId, count) => {
  const res = await api.post(`/judge/event/${eventId}`, { count });
  return res.data;
};
