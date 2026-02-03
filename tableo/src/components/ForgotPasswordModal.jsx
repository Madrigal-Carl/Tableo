import { useEffect, useRef, useState } from "react";
import FullScreenLoader from "../components/FullScreenLoader"; // ✅ add this

export default function ForgotPasswordModal({ open, onClose, onConfirm }) {
  const [email, setEmail] = useState("");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false); // ✅ loader state

  // Prevent background scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Autofocus input
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!email) {
      alert("Email is required");
      return;
    }

    if (!onConfirm) {
      console.error("ForgotPasswordModal: onConfirm is missing");
      return;
    }

    try {
      setLoading(true); // ✅ show loader
      await onConfirm(email);
    } finally {
      setLoading(false); // ✅ hide loader
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-center text-xl font-semibold text-gray-800">
            Forgot Password
          </h2>

          <p className="mt-4 text-base text-gray-700">
            Enter your email account
          </p>

          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-full border border-[#FA824C] px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-[#FA824C]/40"
          />

          <button
            onClick={onClose}
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            Back to sign in
          </button>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full rounded-full bg-[#FA824C] py-3 text-sm font-semibold text-white transition hover:bg-[#e46d3a]"
          >
            Confirm
          </button>
        </div>
      </div>

      {/* FULL SCREEN LOADER */}
      <FullScreenLoader show={loading} />
    </>
  );
}
