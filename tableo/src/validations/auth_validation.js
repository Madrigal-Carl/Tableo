// LOGIN
export const validateLogin = ({ email, password }) => {
    if (!email?.trim()) return "Email is required";
    if (!password) return "Password is required";
    return null;
};

// REGISTER / SIGNUP
export const validateRegister = ({ email, password, confirmPassword }) => {
    if (!email?.trim()) return "Email is required";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!confirmPassword) return "Confirm password is required";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
};

// FORGOT PASSWORD REQUEST
export const validateForgotPasswordRequest = (email) => {
    if (!email?.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email must be valid";
    return null;
};

// VERIFICATION CODE (OTP)
export const validateVerificationCode = (otpArray) => {
    const code = otpArray.join("");
    if (code.length !== 6) return "Verification code must be 6 digits";
    if (!/^\d{6}$/.test(code)) return "Verification code must contain only numbers";
    return null;
};

// RESET PASSWORD
export const validateResetPassword = ({ password, confirmPassword }) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!confirmPassword) return "Confirm password is required";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
};
