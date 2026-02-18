import api from "./api";

export const getCandidateInEvent = async (eventId) => {
    const res = await api.get(`/candidates/event/${eventId}`);
    return res.data;
};

export const editCandidate = async (candidateId, updatedData) => {
  const config =
    updatedData instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  const res = await api.put(`/candidates/${candidateId}`, updatedData, config);
  return res.data;
};


export const createOrUpdateCandidates = async (eventId, payload) => {
    const res = await api.post(`/candidates/event/${eventId}`, payload);
    return res.data;
};

export const deleteCandidate = async (candidateId) => {
    const res = await api.delete(`/candidates/${candidateId}`);
    return res.data;
};

