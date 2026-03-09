import api from "./api";

export const createEvent = (data) => {
  return api.post("/events", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getEvent = (eventId) => {
  return api.get(`/events/${eventId}`);
};

export const deleteEvent = (eventId) => {
  return api.delete(`/events/${eventId}`);
};

export const updateEvent = (eventId, data) => {
  return api.put(`/events/${eventId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllEvents = () => {
  return api.get("/events");
};

export const getDeletedEvents = () => {
  return api.get("/events/deleted/all");
};

export const restoreEvent = (eventId) => {
  return api.patch(`/events/${eventId}/restore`);
};

export const finalizeEvent = (eventId, data) => {
  return api.post(`/events/${eventId}/finalize`, data);
};

export const checkEventFinalized = (eventId) => {
  return api.get(`/events/${eventId}/is-finalized`);
};

export const getEventResults = (eventId) => {
  return api.get(`/events/${eventId}/results`);
};
