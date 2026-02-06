import api from "./api";

export const registerRequest = (data) => {
    return api.post("/auth/register", data);
};

export const registerVerify = (data) => {
    return api.post("/auth/register/verify", data);
};

export const registerResend = (data) => {
    return api.post("/auth/register/resend", data);
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

export const me = () => {
    return api.get("/auth/me");
};