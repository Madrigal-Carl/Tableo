import React, { useState, useEffect } from "react"; // ✅ added useEffect
import goldenDrops from "../assets/golden-drops-background.jpg";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import VerificationModal from "../components/VerificationModal";
import NewPasswordModal from "../components/NewPasswordModal";

export default function Login() {
  const [showForgot, setShowForgot] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [rememberMe, setRememberMe] = useState(false); // ✅ ADD

  // ✅ Restore saved preference
  useEffect(() => {
    const saved = localStorage.getItem("rememberMe") === "true";
    setRememberMe(saved);
  }, []);

  const handleForgotConfirm = (email) => {
    setResetEmail(email);
    setShowForgot(false);
    setShowVerification(true);
  };

  const handleVerificationSuccess = () => {
    setShowVerification(false);
    setShowNewPassword(true);
  };

  const handlePasswordReset = (newPassword) => {
    console.log("Reset email:", resetEmail);
    console.log("New password:", newPassword);
    setShowNewPassword(false);
  };

  // ✅ LOGIN HANDLER
  const handleLogin = () => {
    console.log("Remember me:", rememberMe);

    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }

    // 🔜 Your real login API call here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden bg-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-6">

          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <img src={goldenDrops} alt="login" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          <div className="flex flex-col justify-center px-8 py-10 md:px-12">
            <h1 className="text-2xl font-semibold text-gray-800">Welcome back to Tabléo</h1>
            <p className="mt-1 mb-8 text-sm text-gray-500">Sign in to continue</p>

            <input
              type="email"
              placeholder="Email address"
              className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#FA824C] focus:outline-none focus:ring-2 focus:ring-[#FA824C]/30"
            />

            <input
              type="password"
              placeholder="Password"
              className="mb-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#FA824C] focus:outline-none focus:ring-2 focus:ring-[#FA824C]/30"
            />

            {/* ✅ REMEMBER ME */}
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#FA824C] focus:ring-[#FA824C]"
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
              className="w-full rounded-full bg-[#FA824C] py-3 text-sm font-semibold text-white transition hover:bg-[#e04a4a]"
            >
              Login
            </button>

            <p className="mt-5 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a href="/auth/register" className="font-medium text-[#FA5C5C] hover:underline">
                Register here
              </a>
            </p>

            <div className="mt-8 flex justify-center gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600">Terms of use</a>
              <a href="#" className="hover:text-gray-600">Privacy policy</a>
            </div>
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
        onSuccess={handleVerificationSuccess}
      />

      <NewPasswordModal
        open={showNewPassword}
        onClose={() => setShowNewPassword(false)}
        onConfirm={handlePasswordReset}
      />
    </div>
  );
}
