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

export const validateVerificationCode = (otpArray) => {
    const code = otpArray.join("");

    if (code.length !== 6) {
        return "Verification code must be 6 digits";
    }
    if (!/^\d{6}$/.test(code)) {
        return "Verification code must contain only numbers";
    }

    return null;
};