import api from "./api";

// Add single or multiple categories to an event
export const addCategoryToEvent = (eventId, data) => {
  // data = { stage_id, categories: [...] }
  return api.post(`/events/${eventId}/categories`, data);
};

// Get all categories for an event
export const getCategoriesByEvent = (eventId) => {
  return api.get(`/events/${eventId}/categories`);
};

// Bulk update categories for an event
export const editCategoriesByEvent = (eventId, data) => {
  // data = { categories: [...], userId, eventId } depending on backend
  return api.put(`/categories/bulk/${eventId}`, data);
};

// Single category update (optional if used from frontend)
export const updateCategory = (categoryId, data) => {
  return api.put(`/categories/${categoryId}`, data);
};
