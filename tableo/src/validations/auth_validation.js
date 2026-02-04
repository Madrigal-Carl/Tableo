export const validateLogin = ({ email, password }) => {
    if (!email?.trim()) return "Email is required";
    if (!password) return "Password is required";
    return null;
};

export const validateRegister = ({ email, password, confirmPassword }) => {
    if (!email?.trim()) return "Email is required";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!confirmPassword) return "Confirm password is required";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
};
