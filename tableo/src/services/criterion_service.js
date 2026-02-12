import api from "./api";

export const addCriteria = (categoryId, data) => {
    return api.post(`/criterion/${categoryId}/criteria`, data);
};

export const getCriteriaByCategory = (categoryId) => {
    return api.get(`/criterion/${categoryId}/criteria`);
};
