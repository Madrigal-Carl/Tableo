import { useEffect, useRef, useState } from "react";

export default function VerificationModal({ open, onClose }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  // Lock background scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  // ESC to close
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Focus first box
  useEffect(() => {
    if (open) inputsRef.current[0]?.focus();
  }, [open]);

  if (!open) return null;

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <h2 className="mb-2 text-center text-xl font-medium">Verification</h2>

        <p className="mb-6 text-center text-sm text-gray-500">
          Input the code we sent to your email account
        </p>

        <div className="mb-4 flex justify-center gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength={1}
              inputMode="numeric"
              className="h-11 w-11 rounded-md bg-gray-200 text-center text-lg
              focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FA824C]"
            />
          ))}
        </div>

        <p className="mb-6 text-center text-sm text-gray-500">
          Did not receive the code?{" "}
          <button className="text-[#FA824C] hover:underline">Resend</button>
        </p>

        <button
          onClick={onClose}
          className="w-full rounded-full bg-[#FA824C] py-3 text-sm font-semibold text-white transition hover:bg-[#e04a4a]"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
