import React, { useState } from "react";
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

          {/* LEFT IMAGE */}
          <div className="hidden md:block">
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <img src={goldenDrops} alt="signup" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="flex flex-col justify-center px-8 py-10 md:px-12">
            <h1 className="text-2xl font-semibold text-gray-800">Create Account</h1>
            <p className="mt-1 mb-8 text-sm text-gray-500">Sign up to get started</p>

            {error && (
              <p className="mb-4 text-sm text-red-500">{error}</p>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="mb-4 w-full rounded-lg border px-4 py-3 text-sm"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="mb-4 w-full rounded-lg border px-4 py-3 text-sm"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mb-6 w-full rounded-lg border px-4 py-3 text-sm"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-full bg-[#FA824C] py-3 text-sm font-semibold text-white hover:bg-[#e04a4a]"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
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
