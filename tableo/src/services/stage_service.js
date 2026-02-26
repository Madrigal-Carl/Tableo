import api from "./api";

// Update a single stage (name and/or sequence)
export const updateStage = (stageId, data) => {
  return api.put(`/stages/${stageId}`, data);
};

// Create or update stages by count for an event
export const createOrUpdateStages = (eventId, count) => {
  return api.post(`/stages/event/${eventId}`, { count });
};

export const getStageResults = (stageId) => {
  return api.get(`/stages/${stageId}/results`);
};

export const advanceStageCandidates = (stageId, payload) =>
  api.post(`/stages/${stageId}/advance`, payload);

export const getActiveStage = (eventId) =>
  api.get(`/stages/events/${eventId}/active-stage`);

export const getStageOverallResult = (stageId) =>
  api.get(`/stages/${stageId}/overall-results`);
