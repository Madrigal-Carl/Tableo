import { useEffect, useRef, useState } from "react";
import {
  signupVerify,
  forgotPasswordVerify,
  signupResend,
  forgotPasswordRequest,
} from "../services/auth_service";
import FullScreenLoader from "../components/FullScreenLoader";

export default function VerificationModal({
  open,
  onClose,
  email,
  type = "signup", // "signup" | "forgot"
  onSuccess,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(30);

  const inputsRef = useRef([]);

  // =========================
  // MODAL OPEN / RESET
  // =========================
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setOtp(["", "", "", "", "", ""]);
      setCooldown(30);
      inputsRef.current[0]?.focus();
    }
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  // =========================
  // COOLDOWN TIMER
  // =========================
  useEffect(() => {
    if (!open || cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown, open]);

  if (!open) return null;

  // =========================
  // OTP INPUT HANDLING
  // =========================
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleConfirm = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;

    try {
      setLoading(true);
      setError("");
      const payload = { email, code };

      if (type === "signup") await signupVerify(payload);
      else await forgotPasswordVerify(payload);

      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // RESEND OTP
  // =========================
  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      setResending(true);
      setError("");
      setOtp(["", "", "", "", "", ""]);

      if (type === "signup") await signupResend({ email });
      else await forgotPasswordRequest({ email });

      setCooldown(30);
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <FullScreenLoader show={loading || resending} />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Overlay without onClick so modal won't close */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Modal */}
        <div
          className="relative z-10 w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
          onClick={(e) => e.stopPropagation()} // prevent clicks inside from bubbling
        >
          <h2 className="mb-2 text-center text-xl font-medium">Verification</h2>

          <p className="mb-6 text-center text-sm text-gray-500">
            Enter the 6-digit code sent to <b>{email}</b>
          </p>

          {error && (
            <p className="mb-4 text-center text-sm text-red-500">{error}</p>
          )}

          {/* OTP INPUTS */}
          <div className="mb-4 flex justify-center gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                maxLength={1}
                className="h-11 w-11 rounded-lg border border-gray-300 bg-gray-100 text-center text-lg focus:border-[#FA824C] focus:ring-2 focus:ring-[#FA824C]/30 focus:outline-none"
              />
            ))}
          </div>

          {/* RESEND */}
          <div className="mb-6 text-center text-sm">
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className={`font-medium ${cooldown > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#FA824C] hover:underline"
                }`}
            >
              {cooldown > 0
                ? `Resend code in ${cooldown}s`
                : resending
                  ? "Resending..."
                  : "Resend code"}
            </button>
          </div>

          {/* CONFIRM BUTTON */}
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full rounded-full bg-[#FA824C] py-3 text-white font-semibold hover:bg-[#e04a4a] transition"
          >
            {loading ? "Verifying..." : "Confirm"}
          </button>
        </div>
      </div>
    </>
  );
}
