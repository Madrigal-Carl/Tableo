import api from "./api";

export const signupRequest = (data) => {
    return api.post("/auth/signup", data);
};

export const signupVerify = (data) => {
    return api.post("/auth/signup/verify", data);
};

export const signupResend = (data) => {
    return api.post("/auth/signup/resend", data);
};

export const login = (data) => {
    return api.post("/auth/login", data);
};

export const logout = () => {
    return api.post("/auth/logout");
};

export const forgotPasswordRequest = (data) => {
    return api.post("/auth/password/forgot", data);
};

export const forgotPasswordVerify = (data) => {
    return api.post("/auth/password/verify", data);
};

export const forgotPasswordReset = (data) => {
    return api.post("/auth/password/reset", data);
};

export const addEvent = (data) => {
    return api.post("/events", data);
};
