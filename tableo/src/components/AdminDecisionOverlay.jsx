import React from "react";
import { Loader2, ShieldCheck } from "lucide-react";

export default function AdminDecisionOverlay({ isOpen, nextStageName = "" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-[500px] max-w-[95%] rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-indigo-100 p-3 rounded-full">
              <ShieldCheck className="text-indigo-600" size={28} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Waiting for Admin Selection
          </h2>

          {nextStageName && (
            <p className="text-gray-500 mt-2">
              Upcoming Stage:{" "}
              <span className="font-semibold">{nextStageName}</span>
            </p>
          )}
        </div>

        {/* Animated Loader Section */}
        <div className="flex flex-col items-center justify-center py-6 space-y-3">
          <Loader2 className="animate-spin text-indigo-600" size={36} />

          <p className="text-gray-600 text-sm text-center max-w-sm">
            The current stage has been completed.
            <br />
            Please wait while the administrator selects and prepares the next
            stage.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-xs text-gray-400">
          The next stage will begin automatically once approved.
        </div>
      </div>
    </div>
  );
}
