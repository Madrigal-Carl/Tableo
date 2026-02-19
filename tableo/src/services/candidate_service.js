import api from "./api";

export const editCandidate = async (candidateId, updatedData) => {
  const res = await api.put(`/candidates/${candidateId}`, updatedData);
  return res.data;
};

export const createOrUpdateCandidates = async (eventId) => {
  const res = await api.post(`/candidates/event/${eventId}`);
  return res.data;
};

export const deleteCandidate = async (candidateId) => {
  const res = await api.delete(`/candidates/${candidateId}`);
  return res.data;
};
