import { useState } from "react";
import JudgeTable from "../../components/JudgeTable";

function JudgePage({ adminData }) {
  const rounds = ["Preliminary", "Semi Finals", "Grand Finals"];
  const [activeRound, setActiveRound] = useState("Preliminary");

  // Placeholder for participants and criteria per round
  const roundData = adminData?.rounds || {};

  // Get participants and criteria for the active round
  const participants = roundData[activeRound]?.participants || [];
  let criteria = roundData[activeRound]?.criteria || [];

  // Normalize weights to sum 100% if criteria exist
  if (criteria.length > 0) {
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
    criteria = criteria.map((c) => ({
      ...c,
      weight: (c.weight / totalWeight) * 100,
    }));
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 gap-2">
          <button className="px-5 py-2 rounded-full bg-[#FA824C] text-white text-sm hover:bg-[#FF9768] transition">
            Back
          </button>

          <h1 className="text-lg sm:text-2xl font-semibold text-center">
            Event Title
          </h1>

          <div className="hidden sm:block w-12" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="pt-28 px-4 sm:px-6">
        {/* ROUND TABS */}
        <div className="flex gap-6 overflow-x-auto border-b border-gray-200 mb-8 max-w-6xl mx-auto">
          {rounds.map((round) => (
            <button
              key={round}
              onClick={() => setActiveRound(round)}
              className={`pb-3 whitespace-nowrap text-sm font-medium transition ${
                activeRound === round
                  ? "border-b-2 border-[#FA824C] text-[#FA824C]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {round}
            </button>
          ))}
        </div>

        {/* MAIN CARD */}
        <div className="max-w-6xl mx-auto">
          <div className="font-medium text-lg mb-6">{activeRound}</div>

          {/* REUSABLE JUDGE TABLE */}
          <JudgeTable participants={participants} criteria={criteria} />
        </div>
      </div>
    </div>
  );
}

export default JudgePage;
