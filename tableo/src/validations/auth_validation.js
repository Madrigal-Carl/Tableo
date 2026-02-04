export const validateLogin = ({ email, password }) => {
    if (!email) return "Email is required";
    if (!password) return "Password is required";
    return null;
};

export const validateRegister = ({ email, password, confirmPassword }) => {
    if (!email) return "Email is required";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
};
