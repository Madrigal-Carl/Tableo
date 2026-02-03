import React, { useState } from "react";
import goldenDrops from "../assets/golden-drops-background.jpg";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import VerificationModal from "../components/VerificationModal";
import NewPasswordModal from "../components/NewPasswordModal"; // ✅ ADD

export default function Login() {
  const [showForgot, setShowForgot] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false); // ✅ ADD
  const [resetEmail, setResetEmail] = useState("");

  const handleForgotConfirm = (email) => {
    setResetEmail(email);
    setShowForgot(false);
    setShowVerification(true);
  };

  // ✅ called after OTP confirm
  const handleVerificationSuccess = () => {
    setShowVerification(false);
    setShowNewPassword(true);
  };

  // ✅ final step
  const handlePasswordReset = (newPassword) => {
    console.log("Reset email:", resetEmail);
    console.log("New password:", newPassword);
    setShowNewPassword(false);
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

            <input type="email" placeholder="Email address" className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#FA824C] focus:outline-none focus:ring-2 focus:ring-[#FA824C]/30"/>

            <input type="password" placeholder="Password" className="mb-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-[#FA824C] focus:outline-none focus:ring-2 focus:ring-[#FA824C]/30"/>

            <div className="mb-6 text-right">
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-xs font-medium text-gray-500 hover:text-[#FA5C5C]"
              >
                Forgot password?
              </button>
            </div>

            <button className="w-full rounded-full bg-[#FA824C] py-3 text-sm font-semibold text-white transition hover:bg-[#e04a4a]">
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
        onSuccess={handleVerificationSuccess}  // ✅ ADD
      />

      <NewPasswordModal
        open={showNewPassword}
        onClose={() => setShowNewPassword(false)}
        onConfirm={handlePasswordReset}
      />
    </div>
  );
}
