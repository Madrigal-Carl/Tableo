import api from "./api";

export const addCategoryToEvent = (eventId, data) => {
    return api.post(`/events/${eventId}/categories`, data);
};

export const getCategoriesByEvent = (eventId) => {
    return api.get(`/events/${eventId}/categories`);
}