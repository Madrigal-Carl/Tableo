import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

/* =========================================
   HELPERS
========================================= */

const tieColors = [
  "bg-red-50 border-red-200",
  "bg-blue-50 border-blue-200",
  "bg-yellow-50 border-yellow-200",
  "bg-green-50 border-green-200",
  "bg-purple-50 border-purple-200",
];

const prepareCandidates = (list = []) => {
  const sorted = [...list].sort((a, b) => b.stage_total - a.stage_total);

  const groups = [];
  let startRank = 1;

  for (let i = 0; i < sorted.length; ) {
    const same = sorted.filter(
      (c) =>
        Number(c.stage_total).toFixed(4) ===
        Number(sorted[i].stage_total).toFixed(4),
    );

    const groupSize = same.length;

    groups.push({
      startRank,
      endRank: startRank + groupSize - 1,
      ids: same.map((c) => c.candidate_id),
    });

    startRank += groupSize;
    i += groupSize;
  }

  return sorted.map((c, index) => {
    const group = groups.find((g) => g.ids.includes(c.candidate_id));

    return {
      ...c,
      rank: group.ids.length > 1 ? null : group.startRank,
      tieGroup: group.ids,
      minRank: group.startRank,
      maxRank: group.endRank,
      tieIndex: groups.indexOf(group),
    };
  });
};

/* =========================================
   CANDIDATE CARD
========================================= */

const CandidateCard = ({ candidate, candidates, setCandidates }) => {
  const isTie = candidate.tieGroup.length > 1;

  const handleRankChange = (e) => {
    let newRank = parseInt(e.target.value);
    if (!newRank) return;

    // restrict to tie range
    if (newRank < candidate.minRank || newRank > candidate.maxRank) return;

    const updated = [...candidates];
    const currentIndex = updated.findIndex(
      (c) => c.candidate_id === candidate.candidate_id,
    );

    // check if rank already used inside this tie group
    const swapIndex = updated.findIndex(
      (c) =>
        c.candidate_id !== candidate.candidate_id &&
        candidate.tieGroup.includes(c.candidate_id) &&
        c.rank === newRank,
    );

    if (swapIndex !== -1) {
      // swap ranks
      const temp = updated[swapIndex].rank;
      updated[swapIndex].rank = updated[currentIndex].rank;
      updated[currentIndex].rank = temp;
    } else {
      // assign new rank
      updated[currentIndex].rank = newRank;
    }

    // optional: sort by rank
    updated.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));

    setCandidates(updated);
  };

  return (
    <div
      className={`rounded-2xl shadow-xl p-5 flex items-center gap-5 min-w-[320px] border
  ${
    isTie
      ? tieColors[candidate.tieIndex % tieColors.length]
      : "bg-white border-gray-200"
  }`}
    >
      {/* IMAGE */}
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
        {candidate?.path ? (
          <img
            src={`${import.meta.env.VITE_ASSET_URL}${candidate.path}`}
            alt={candidate?.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-bold text-[#192BC2]">{candidate?.name}</h3>

        <p className="text-sm text-gray-600">
          Average: {Number(candidate.stage_total).toFixed(2)}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <label className="text-sm font-semibold text-[#FA824C]">Rank:</label>

          {isTie ? (
            <select
              className="w-16 border rounded px-2 py-1 text-center"
              value={candidate.rank || ""}
              onChange={handleRankChange}
            >
              <option value="">-</option>
              {Array.from(
                { length: candidate.maxRank - candidate.minRank + 1 },
                (_, i) => {
                  const rank = candidate.minRank + i;
                  return (
                    <option key={rank} value={rank}>
                      {rank}
                    </option>
                  );
                },
              )}
            </select>
          ) : (
            <span className="font-bold text-gray-700">{candidate.rank}</span>
          )}
        </div>

        {isTie && (
          <span className="text-xs text-gray-400 mt-1">
            Tie range: {candidate.minRank} - {candidate.maxRank}
          </span>
        )}
      </div>
    </div>
  );
};

/* =========================================
   FINALS MODAL
========================================= */

export default function FinalsModal({ isOpen, results, onClose, onFinalize }) {
  const [maleCandidates, setMaleCandidates] = useState([]);
  const [femaleCandidates, setFemaleCandidates] = useState([]);

  useEffect(() => {
    if (!results) return;

    setMaleCandidates(prepareCandidates(results.males));
    setFemaleCandidates(prepareCandidates(results.females));
  }, [results]);

  if (!isOpen) return null;

  const handleFinalize = () => {
    const finalMales = [...maleCandidates].sort((a, b) => a.rank - b.rank);
    const finalFemales = [...femaleCandidates].sort((a, b) => a.rank - b.rank);

    onFinalize({
      males: finalMales,
      females: finalFemales,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-100 rounded-3xl w-[95%] max-w-7xl max-h-[90vh] overflow-y-auto p-10 relative">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-gray-900"
        >
          <X size={28} />
        </button>

        <h2 className="text-3xl font-bold text-center text-[#192BC2] mb-12">
          🏆 Final Event Results
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* MALE */}
          <div>
            <h3 className="text-2xl font-semibold text-center text-blue-600 mb-8">
              Male Candidates
            </h3>

            <div className="flex flex-col items-center gap-5">
              {maleCandidates.map((c) => (
                <CandidateCard
                  key={c.candidate_id}
                  candidate={c}
                  candidates={maleCandidates}
                  setCandidates={setMaleCandidates}
                />
              ))}
            </div>
          </div>

          {/* FEMALE */}
          <div>
            <h3 className="text-2xl font-semibold text-center text-pink-600 mb-8">
              Female Candidates
            </h3>

            <div className="flex flex-col items-center gap-5">
              {femaleCandidates.map((c) => (
                <CandidateCard
                  key={c.candidate_id}
                  candidate={c}
                  candidates={femaleCandidates}
                  setCandidates={setFemaleCandidates}
                />
              ))}
            </div>
          </div>
        </div>

        {/* FINALIZE */}
        <div className="flex justify-center mt-12">
          <button
            onClick={handleFinalize}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition"
          >
            Confirm & Finalize Event
          </button>
        </div>
      </div>
    </div>
  );
}
