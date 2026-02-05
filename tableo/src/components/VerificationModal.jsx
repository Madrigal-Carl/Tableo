import { useEffect, useRef, useState } from "react";
import {
  signupVerify,
  forgotPasswordVerify,
  signupResend,
  forgotPasswordRequest,
} from "../services/auth_service";
import FullScreenLoader from "../components/FullScreenLoader";
import { showToast } from "../utils/swal";

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
  const [cooldown, setCooldown] = useState(60);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setOtp(["", "", "", "", "", ""]);
      setCooldown(60);
      setTimeout(() => inputsRef.current[0]?.focus(), 0);
    }
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  useEffect(() => {
    if (!open || cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown, open]);

  if (!open) return null;

  /* ---------------- OTP INPUT LOGIC ---------------- */

  const clearAll = () => {
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (index === 5 && newOtp.every((d) => d !== "")) {
      handleConfirm(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }

    // Ctrl / Cmd + A → clear all
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
      e.preventDefault();
      clearAll();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length !== 6) return;

    const newOtp = pasted.split("").slice(0, 6);
    setOtp(newOtp);

    setTimeout(() => {
      inputsRef.current[5]?.focus();
      handleConfirm(newOtp.join(""));
    }, 0);
  };

  /* ---------------- VERIFY ---------------- */

  const handleConfirm = async (codeInput) => {
    const code = codeInput || otp.join("");

    if (code.length !== 6) {
      showToast("error", "Please enter the 6-digit code");
      return;
    }

    try {
      setLoading(true);

      if (type === "signup") {
        await signupVerify({ email, code });
        showToast("success", "Account verified successfully!");
      } else {
        await forgotPasswordVerify({ email, code });
        showToast("success", "Verification successful!");
      }

      onSuccess?.();
    } catch (err) {
      showToast(
        "error",
        err.message || "Invalid verification code"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESEND ---------------- */

  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      setResending(true);
      clearAll();

      if (type === "signup") await signupResend({ email });
      else await forgotPasswordRequest({ email });

      setCooldown(60);
      showToast("success", "Verification code resent!");
    } catch (err) {
      showToast(
        "error",
        err.message || "Failed to resend code"
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <FullScreenLoader show={loading || resending} />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/40" />

        <div
          className="relative z-10 w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="mb-2 text-center text-xl font-medium">
            Verification
          </h2>

          <p className="mb-6 text-center text-sm text-gray-500">
            Enter the 6-digit code sent to <b>{email}</b>
          </p>

          {/* OTP INPUTS */}
          <div className="mb-4 flex justify-center gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
                className="h-11 w-11 rounded-lg border border-gray-300 bg-gray-100 text-center text-lg
                focus:border-[#FA824C] focus:ring-2 focus:ring-[#FA824C]/30 focus:outline-none"
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
            className="w-full rounded-full bg-[#FA824C] py-3 font-semibold text-white hover:bg-[#e04a4a]"
          >
            {loading ? "Verifying..." : "Confirm"}
          </button>
        </div>
      </div>
    </>
  );
}
