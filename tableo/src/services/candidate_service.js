import api from "./api";

export const getCandidateInEvent = async (eventId) => {
    const res = await api.get(`/candidates/event/${eventId}`);
    return res.data;
};
