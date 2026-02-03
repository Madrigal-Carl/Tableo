import { useEffect, useRef, useState } from "react";
import {
  signupVerify,
  forgotPasswordVerify,
} from "../services/auth_service";

export default function VerificationModal({
  open,
  onClose,
  email,
  type = "signup", // 🔥 "signup" | "forgot"
  onSuccess,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      inputsRef.current[0]?.focus();
    }
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  if (!open) return null;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleConfirm = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;

    try {
      setLoading(true);
      setError("");

      const payload = { email, code };

      if (type === "signup") {
        await signupVerify(payload);
      } else {
        await forgotPasswordVerify(payload);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
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

        <div className="mb-6 flex justify-center gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              maxLength={1}
              className="h-11 w-11 rounded-md bg-gray-200 text-center text-lg"
            />
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full rounded-full bg-[#FA824C] py-3 text-white"
        >
          {loading ? "Verifying..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}
