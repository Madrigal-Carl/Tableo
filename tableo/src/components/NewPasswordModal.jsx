import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // install if needed

export default function NewPasswordModal({ open, onClose, onConfirm }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Lock scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  // ESC close
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!password || password !== confirm) return;
    onConfirm?.(password);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-center text-lg font-semibold text-gray-800">
          Enter New Password
        </h2>

        {/* New Password */}
        <div className="mb-4">
          <label className="text-xs text-gray-600">Enter new password</label>
          <div className="relative mt-1">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border border-[#FA824C] px-4 py-2 pr-10 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#FA824C]/40"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="text-xs text-gray-600">Confirm password</label>
          <div className="relative mt-1">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-full border border-[#FA824C] px-4 py-2 pr-10 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#FA824C]/40"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleSubmit}
          className="w-full rounded-full bg-[#FA824C] py-2.5 text-sm font-semibold text-white transition hover:bg-[#e46d3a]"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
