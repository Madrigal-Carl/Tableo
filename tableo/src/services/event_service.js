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
