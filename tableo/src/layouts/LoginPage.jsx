import React, { useState, useEffect } from "react";
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
import FullScreenLoader from "../components/FullScreenLoader"; // ✅ add this

export default function LoginPage() {
  const [showForgot, setShowForgot] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ loader state
  const [error, setError] = useState("");

  // Restore rememberMe
  useEffect(() => {
    setRememberMe(localStorage.getItem("rememberMe") === "true");
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      await login({
        email: form.email,
        password: form.password,
        rememberMe,
      });

      if (rememberMe) localStorage.setItem("rememberMe", "true");
      else localStorage.removeItem("rememberMe");

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotConfirm = async (email) => {
    try {
      setLoading(true); // ✅ show loader
      await forgotPasswordRequest({ email });

      setForgotEmail(email);
      setShowForgot(false);
      setShowVerification(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false); // ✅ hide loader
    }
  };

  const handleVerificationSuccess = () => {
    setShowVerification(false);
    setShowNewPassword(true);
  };

  const handleResetPassword = async (password) => {
    try {
      setLoading(true); // ✅ show loader
      await forgotPasswordReset({
        email: forgotEmail,
        password,
        confirmPassword: password,
      });

      setShowNewPassword(false);
      setForgotEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false); // ✅ hide loader
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-5xl rounded-2xl overflow-hidden bg-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-6">

            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <img src={goldenDrops} alt="login" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="flex flex-col justify-center px-8 py-10 md:px-12">
              <h1 className="text-2xl font-semibold text-gray-800">
                Welcome back to Tabléo
              </h1>
              <p className="mt-1 mb-8 text-sm text-gray-500">
                Sign in to continue
              </p>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                  {error}
                </div>
              )}

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
              <div className="mb-2">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FA824C]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 mt-2">
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

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full rounded-full bg-[#FA824C] py-3 text-sm font-semibold text-white hover:bg-[#e04a4a]"
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              <p className="mt-5 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <a href="/auth/register" className="font-medium text-[#FA5C5C] hover:underline">
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>

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

      {/* FULL SCREEN LOADER */}
      <FullScreenLoader show={loading} />
    </>
  );
}
