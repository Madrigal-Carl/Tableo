import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

/* =========================================
   CANDIDATE CARD
========================================= */
const CandidateCard = ({ candidate, candidates, setCandidates }) => {
  const handleRankChange = (e) => {
    let newRank = parseInt(e.target.value);

    if (!newRank || newRank < 1) return;

    // Prevent rank > total candidates
    newRank = Math.min(newRank, candidates.length);

    // Update candidates ranks
    const updated = candidates.map((c) => {
      if (c.candidate_id === candidate.candidate_id) {
        return { ...c, rank: newRank };
      } else if (c.rank === newRank) {
        // Push the previous candidate down
        return { ...c, rank: candidate.rank };
      } else {
        return c;
      }
    });

    // Sort by rank
    updated.sort((a, b) => a.rank - b.rank);
    setCandidates(updated);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5 flex items-center gap-5 min-w-[320px] border border-gray-200">
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
          Average: {Number(candidate.stage_total).toFixed(4)}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <label className="text-sm font-semibold text-[#FA824C]">Rank:</label>
          <input
            type="number"
            className="w-16 border rounded px-2 py-1 text-center"
            value={candidate.rank}
            min={1}
            max={candidates.length}
            onChange={handleRankChange}
          />
        </div>
      </div>
    </div>
  );
};

/* =========================================
   FINALS MODAL
========================================= */
export default function FinalsModal({ isOpen, results, onClose, onFinalize }) {
  if (!isOpen) return null;

  const [maleCandidates, setMaleCandidates] = useState([]);
  const [femaleCandidates, setFemaleCandidates] = useState([]);

  // Initialize candidates with ranks
  useEffect(() => {
    const init = (list) => (list || []).map((c, i) => ({ ...c, rank: i + 1 }));

    setMaleCandidates(init(results?.males));
    setFemaleCandidates(init(results?.females));
  }, [results]);

  const handleFinalize = () => {
    // Sort by rank
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
        {/* CLOSE BUTTON */}
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
