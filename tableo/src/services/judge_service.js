import api from "./api";

export const getEventForJudge = async (invitationCode) => {
  const res = await api.get(`/judge/event/${invitationCode}`);
  return res.data;
};

export const updateJudge = async (invitationCode, payload) => {
  const res = await api.put(`/judge/me/${invitationCode}`, payload);
  return res.data;
};
