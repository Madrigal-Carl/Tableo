import React, { useState, useEffect, useMemo } from "react";

function NextStageModal({
  isOpen,
  onClose,
  onProceed,
  contestants = [],
  roundTitle = "Round 1",
}) {
  const [advanceCount, setAdvanceCount] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [tieIds, setTieIds] = useState([]);

  useEffect(() => {
    setAdvanceCount("");
    setSelectedIds([]);
    setTieIds([]);
  }, [roundTitle]);

  // 🔥 Sort contestants by highest average
  const sortedContestants = useMemo(() => {
    return [...contestants].sort((a, b) => b.average - a.average);
  }, [contestants]);

  // 🔥 Auto selection + tie detection
  useEffect(() => {
    const count = Number(advanceCount);

    if (!count || count <= 0) {
      setSelectedIds([]);
      setTieIds([]);
      return;
    }

    if (count > sortedContestants.length) return;

    const cutoffScore = sortedContestants[count - 1]?.average;

    const aboveCutoff = sortedContestants.filter(
      (c) => c.average > cutoffScore
    );

    const tiedAtCutoff = sortedContestants.filter(
      (c) => c.average === cutoffScore
    );

    if (aboveCutoff.length + tiedAtCutoff.length > count) {
      // ⚠️ Tie situation
      setSelectedIds(aboveCutoff.map((c) => c.candidate_id));
      setTieIds(tiedAtCutoff.map((c) => c.candidate_id));
    } else {
      // ✅ No tie
      const autoQualified = sortedContestants
        .slice(0, count)
        .map((c) => c.candidate_id);

      setSelectedIds(autoQualified);
      setTieIds([]);
    }
  }, [advanceCount, sortedContestants]);

  if (!isOpen) return null;

  const handleCheckboxChange = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    }
  };

  const isTieUnresolved =
    tieIds.length > 0 &&
    selectedIds.length !== Number(advanceCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-[520px] rounded-3xl shadow-2xl px-8 py-7">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-center tracking-wide mb-6">
          {roundTitle}
        </h2>

        {/* Header */}
        <div className="grid grid-cols-3 text-xs text-gray-400 pb-3">
          <span>Rank</span>
          <span>Contestants</span>
          <span className="text-right">Average</span>
        </div>

        {/* Contestant List */}
        <div className="max-h-[280px] overflow-y-auto">
          {sortedContestants.map((c, index) => {
            const isSelected = selectedIds.includes(c.candidate_id);
            const isTie = tieIds.includes(c.candidate_id);

            return (
              <div
                key={c.candidate_id}
                className={`grid grid-cols-3 items-center text-sm py-3 border-t border-gray-100 rounded-lg px-2 transition
                  ${isSelected && !isTie ? "bg-green-100" : ""}
                  ${isTie ? "bg-red-100" : ""}
                `}
              >
                <div className="flex items-center gap-2">
                  {isTie && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) =>
                        handleCheckboxChange(
                          c.candidate_id,
                          e.target.checked
                        )
                      }
                    />
                  )}
                  <span className="text-gray-600">
                    {c.rank ?? index + 1}
                  </span>
                </div>

                <span className="text-gray-700">{c.name}</span>

                <span className="text-right text-gray-700 font-medium">
                  {c.average.toFixed(2)}
                </span>
              </div>
            );
          })}
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
            className="w-16 h-9 text-center border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {isTieUnresolved && (
            <p className="text-xs text-red-500 mt-2">
              Please resolve the tie before proceeding.
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-7">
          <button
            onClick={onClose}
            className="bg-orange-200 text-orange-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#192BC2] transition"
          >
            Cancel
          </button>

          <button
            disabled={isTieUnresolved}
            onClick={() => onProceed(selectedIds)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition
              ${isTieUnresolved
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#192BC2] text-white hover:bg-[#192BC2]/80"
              }
            `}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default NextStageModal;