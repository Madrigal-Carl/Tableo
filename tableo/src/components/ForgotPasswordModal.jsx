import { useEffect, useRef, useState } from "react";
import FullScreenLoader from "../components/FullScreenLoader";
import { showToast } from "../utils/swal";
import { validateForgotPasswordRequest } from "../validations/auth_validation";

export default function ForgotPasswordModal({ open, onClose, onConfirm }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    // ✅ Frontend validation
    const errorMsg = validateForgotPasswordRequest(email);
    if (errorMsg) return showToast("error", errorMsg);

    if (!onConfirm) {
      console.error("ForgotPasswordModal: onConfirm is missing");
      return;
    }

    try {
      setLoading(true);
      await onConfirm(email);
      showToast("success", "Verification code sent!");
      setEmail("");
      onClose();
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FullScreenLoader show={loading} />

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
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm
             focus:border-[#FA824C] focus:outline-none focus:ring-2 focus:ring-[#FA824C]/30"
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
    </>
  );
}
