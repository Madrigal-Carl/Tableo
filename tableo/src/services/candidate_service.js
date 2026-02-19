import api from "./api";

export const editCandidate = async (
  candidateId,
  updatedData,
  isFile = false,
) => {
  const res = await api.put(
    `/candidates/${candidateId}`,
    updatedData,
    isFile ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
  );
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
