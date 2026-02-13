import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import goldenDrops from "../assets/golden-drops-background.jpg";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import VerificationModal from "../components/VerificationModal";
import NewPasswordModal from "../components/NewPasswordModal";
import {
  login,
  forgotPasswordRequest,
  forgotPasswordReset,
} from "../services/auth_service";
import { validateLogin } from "../validations/auth_validation";
import { showToast } from "../utils/swal";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [showForgot, setShowForgot] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔐 LOGIN
  const handleLogin = async () => {
    const validationError = validateLogin(form);
    if (validationError) return showToast("error", validationError);

    try {
      const res = await login({ ...form, rememberMe });

      rememberMe
        ? localStorage.setItem("rememberMe", "true")
        : localStorage.removeItem("rememberMe");

      setUser(res.data.user);
      showToast("success", "Signed in successfully");
      navigate("/events");
    } catch (err) {
      showToast("error", err.message || "Invalid email or password");
    }
  };

  // 🔁 FORGOT PASSWORD – SEND CODE
  const handleForgotConfirm = async (email) => {
    try {
      await forgotPasswordRequest({ email });
      setForgotEmail(email);
      setShowForgot(false);
      setShowVerification(true);
      showToast("success", "Verification code sent");
    } catch (err) {
      showToast("error", err.message || "Failed to send verification code");
    }
  };

  // ✅ VERIFICATION SUCCESS
  const handleVerificationSuccess = () => {
    setShowVerification(false);
    setShowNewPassword(true);
  };

  // 🔑 RESET PASSWORD
  const handleResetPassword = async (password) => {
    try {
      await forgotPasswordReset({
        email: forgotEmail,
        password,
        confirmPassword: password,
      });
      setShowNewPassword(false);
      setForgotEmail("");
      showToast("success", "Password reset successfully");
    } catch (err) {
      showToast("error", err.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-6">

          {/* LEFT IMAGE */}
          <div className="hidden md:block order-1">
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <img
                src={goldenDrops}
                alt="login"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="flex flex-col justify-center px-8 py-10 md:px-12 order-2">
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">
              Welcome back to{" "}
              <span className="text-[#FA824C] font-bold">Tabléo</span>
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              Sign in to continue
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              {/* EMAIL */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
                  focus:border-[#FA824C] focus:outline-none focus:ring-2 focus:ring-[#FA824C]/30"
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-600">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm
                    focus:border-[#FA824C] focus:outline-none focus:ring-2 focus:ring-[#FA824C]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                    flex items-center justify-center text-gray-400 hover:text-[#FA824C]"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* REMEMBER & FORGOT */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#FA824C]"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs font-medium text-gray-500 hover:text-[#FA5C5C]"
                >
                  Forgot password?
                </button>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="w-full rounded-full bg-[#FA824C] py-3 text-sm font-semibold text-white hover:bg-[#e04a4a]"
              >
                Login
              </button>
            </form>

            {/* REGISTER LINK */}
            <p className="mt-5 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/auth/register"
                className="font-medium text-[#FA5C5C] hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <ForgotPasswordModal
        open={showForgot}
        onClose={() => setShowForgot(false)}
        onConfirm={handleForgotConfirm}
      />
      <VerificationModal
        open={showVerification}
        onClose={() => setShowVerification(false)}
        email={forgotEmail}
        type="forgot"
        onSuccess={handleVerificationSuccess}
      />
      <NewPasswordModal
        open={showNewPassword}
        onClose={() => setShowNewPassword(false)}
        onConfirm={handleResetPassword}
      />
    </div>
  );
}
