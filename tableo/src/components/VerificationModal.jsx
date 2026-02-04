import { useEffect, useRef, useState } from "react";
import {
  signupVerify,
  forgotPasswordVerify,
  signupResend,
  forgotPasswordRequest,
} from "../services/auth_service";
import FullScreenLoader from "../components/FullScreenLoader";
import { showToast } from "../utils/swal"; // ✅ toast

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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setOtp(["", "", "", "", "", ""]);
      setCooldown(60);
      inputsRef.current[0]?.focus();
      setError("");
    }
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  useEffect(() => {
    if (!open || cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown, open]);

  if (!open) return null;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-submit if last digit
    if (index === 5 && newOtp.every((d) => d !== "")) {
      handleConfirm(newOtp.join(""));
    }
  };

  const handleConfirm = async (codeInput) => {
    const code = codeInput || otp.join("");

    // Frontend validation
    if (code.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = { email, code };

      if (type === "signup") {
        await signupVerify(payload);
        showToast("success", "Account verified successfully!");
      } else {
        await forgotPasswordVerify(payload);
        showToast("success", "Verification successful!");
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid verification code";
      setError(msg);
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      setResending(true);
      setError("");
      setOtp(["", "", "", "", "", ""]);

      if (type === "signup") {
        await signupResend({ email });
      } else {
        await forgotPasswordRequest({ email });
      }

      setCooldown(30);
      inputsRef.current[0]?.focus();
      showToast("success", "Verification code resent!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend code";
      setError(msg);
      showToast("error", msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <FullScreenLoader show={loading || resending} />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        <div className="relative w-full max-w-md rounded-2xl bg-white px-8 py-10">
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
                className="h-11 w-11 rounded-md bg-gray-200 text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#FA824C]"
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

          {/* CONFIRM */}
          <button
            onClick={() => handleConfirm()}
            disabled={loading}
            className="w-full rounded-full bg-[#FA824C] py-3 text-white"
          >
            {loading ? "Verifying..." : "Confirm"}
          </button>
        </div>
      </div>
    </>
  );
}
