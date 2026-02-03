import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import goldenDrops from "../assets/golden-drops-background.jpg";
import VerificationModal from "../components/VerificationModal";
import { signupRequest } from "../services/auth_service";

export default function Register() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      await signupRequest(form);

      // Open verification modal only if signup succeeds
      setShowModal(true);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden bg-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-6">

          <div className="hidden md:block">
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <img src={goldenDrops} alt="signup" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>

          <div className="flex flex-col justify-center px-8 py-10 md:px-12">
            <h1 className="text-2xl font-semibold text-gray-800">Create Account</h1>
            <p className="mt-1 mb-8 text-sm text-gray-500">Sign up to get started</p>

            {/* EMAIL */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* CONFIRM PASSWORD */}
            <div className="mb-6">
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm
                  focus:border-[#FA824C] focus:outline-none focus:ring-2 focus:ring-[#FA824C]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FA824C]"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
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

            <div className="mt-8 flex justify-center gap-6 text-xs text-gray-400">
              <a href="#">Terms of use</a>
              <a href="#">Privacy policy</a>
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
          window.location.href = "/auth";
        }}
      />
    </div>
  );
}
