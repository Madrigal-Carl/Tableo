import React, { useState } from "react";

function NextStageModal({
  isOpen,
  onClose,
  onProceed,
  contestants = [],
  roundTitle = "Round 1",
}) {
  const [advanceCount, setAdvanceCount] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-[400px] rounded-3xl shadow-2xl px-8 py-7">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center tracking-wide mb-6">
          {roundTitle}
        </h2>

        {/* Table Header */}
        <div className="grid grid-cols-3 text-xs text-gray-400 pb-3">
          <span>Rank</span>
          <span>Contestants</span>
          <span className="text-right">Score</span>
        </div>

        {/* Contestant List */}
        <div className="max-h-[250px] overflow-y-auto">
          {contestants.map((c, index) => (
            <div
              key={index}
              className="grid grid-cols-3 items-center text-sm py-3 border-t border-gray-100"
            >
              <span className="text-gray-600">{index + 1}</span>
              <span className="text-gray-700">{c.name}</span>
              <span className="text-right text-gray-700">{c.score}</span>
            </div>
          ))}
        </div>

        {/* Advance Section */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-2">
            Number of contestants to advance:
          </p>

          <input
            type="number"
            min="1"
            value={advanceCount}
            onChange={(e) => setAdvanceCount(e.target.value)}
            className="w-14 h-8 text-center border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-7">
          <button
            onClick={onClose}
            className="bg-orange-200 text-orange-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => onProceed(advanceCount)}
            className="bg-[#FA824C] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default NextStageModal;
