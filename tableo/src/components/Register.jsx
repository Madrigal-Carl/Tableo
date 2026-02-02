import React, { useState } from "react";
import goldenDrops from "../assets/golden-drops-background.jpg";
import VerificationModal from "../components/VerificationModal"; // ← IMPORT MODAL

export default function Register() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden bg-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-6">

          {/* LEFT IMAGE */}
          <div className="hidden md:block">
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              <img
                src={goldenDrops}
                alt="signup"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="flex flex-col justify-center px-8 py-10 md:px-12">

            <h1 className="text-2xl font-semibold text-gray-800">
              Create Account
            </h1>

            <p className="mt-1 mb-8 text-sm text-gray-500">
              Sign up to get started
            </p>

            <input
              type="email"
              placeholder="Email address"
              className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
              focus:border-[#FA824C] focus:outline-none focus:ring-2 focus:ring-[#FA824C]/30"
            />

            <input
              type="password"
              placeholder="Password"
              className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
              focus:border-[#FA824C] focus:outline-none focus:ring-2 focus:ring-[#FA824C]/30"
            />

            <input
              type="password"
              placeholder="Confirm password"
              className="mb-6 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
              focus:border-[#FA824C] focus:outline-none focus:ring-2 focus:ring-[#FA824C]/30"
            />

            {/* OPEN MODAL BUTTON */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full rounded-full bg-[#FA824C] py-3 text-sm font-semibold text-white transition hover:bg-[#e04a4a]"
            >
              Create Account
            </button>

            <p className="mt-5 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/" className="font-medium text-[#FA5C5C] hover:underline">
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

      {/* 🔗 LINKED EXTERNAL MODAL */}
      <VerificationModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
