import api from "./api";

// Update a single stage (name and/or sequence)
export const updateStage = (stageId, data) => {
    return api.put(`/stages/${stageId}`, data);
};

// Create or update stages by count for an event
export const createOrUpdateStages = (eventId, count) => {
    return api.post(`/stages/event/${eventId}`, { count });
};