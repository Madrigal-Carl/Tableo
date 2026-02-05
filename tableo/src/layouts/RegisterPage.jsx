import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import goldenDrops from "../assets/golden-drops-background.jpg";
import VerificationModal from "../components/VerificationModal";
import FullScreenLoader from "../components/FullScreenLoader";
import { signupRequest } from "../services/auth_service";

import { validateRegister } from "../validations/auth_validation";
import { showToast } from "../utils/swal";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // ✅ Frontend validation
    const validationError = validateRegister(form);
    if (validationError) {
      return showToast("error", validationError);
    }

    try {
      setLoading(true);

      await signupRequest(form);

      showToast("success", "Verification code sent");
      setShowModal(true);
    } catch (err) {
      showToast(
        "error",
        err.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-5xl rounded-2xl overflow-hidden bg-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-6">

            {/* Signup form - now on the LEFT */}
            <div className="flex flex-col justify-center px-8 py-10 md:px-12 order-1 md:order-1">
              <h1 className="text-2xl font-semibold text-gray-800">Create Account</h1>
              <p className="mt-1 mb-8 text-sm text-gray-500">Sign up to get started</p>

              {/* EMAIL */}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
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
                    type={showPassword ? "text" : "password"}
                    name="password"
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
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="mb-6">
                <label className="block mb-1 text-sm font-medium text-gray-600">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm
                    focus:border-[#FA824C] focus:outline-none focus:ring-2 focus:ring-[#FA824C]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FA824C]"
                  >
                    {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-full bg-[#FA824C] py-3 text-sm font-semibold text-white hover:bg-[#e04a4a]"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              <p className="mt-5 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a href="/auth" className="font-medium text-[#FA5C5C] hover:underline">
                  Sign in
                </a>
              </p>
            </div>

            {/* Right side image - now on the RIGHT */}
            <div className="hidden md:block order-2 md:order-2">
              <div className="relative h-full w-full overflow-hidden rounded-2xl">
                <img
                  src={goldenDrops}
                  alt="signup"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
          </div>
        </div>

        <VerificationModal
          open={showModal}
          onClose={() => setShowModal(false)}
          email={form.email}
          type="signup"
          onSuccess={() => {
            showToast("success", "Account verified successfully");
            window.location.href = "/auth";
          }}
        />
      </div>

      <FullScreenLoader show={loading} />
    </>
  );
}
