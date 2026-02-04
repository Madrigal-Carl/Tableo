import React from "react";

export default function FullScreenLoader({ show = false }) {
    if (!show) return null;

    return (
        <div
            className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/40 backdrop-blur-sm
      "
            aria-busy="true"
            aria-live="polite"
        >
            <div
                className="
          h-14 w-14
          animate-spin
          rounded-full
          border-4
          border-white/30
          border-t-white
        "
            />
        </div>
    );
}
