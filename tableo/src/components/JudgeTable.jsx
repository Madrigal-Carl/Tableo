import { useState } from "react";

function JudgeTable({ participants = [], criteria = [] }) {
  const [scores, setScores] = useState({});

  const handleScoreChange = (participantId, criteriaId, value, maxScore) => {
    let newValue = value === "" ? "" : Number(value);
    if (newValue > maxScore) newValue = maxScore;
    if (newValue < 0) newValue = 0;

    setScores((prev) => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        [criteriaId]: newValue,
      },
    }));
  };

  const calculateTotal = (participantId) => {
    if (!scores[participantId]) return "0.00";

    const total = criteria.reduce((sum, c) => {
      const score = Number(scores[participantId][c.id]) || 0;
      return sum + (score / c.maxScore) * c.weight;
    }, 0);

    return total.toFixed(2);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-4 overflow-x-auto">
      {/* CATEGORY HEADINGS */}
      <div className="mb-4 flex gap-4 flex-wrap">
        {criteria.map((c) => (
          <h1
            key={c.id}
            className="text-lg sm:text-xl font-bold text-gray-700 min-w-[80px] text-center flex-1"
          >
            {c.name}
          </h1>
        ))}
      </div>

      {/* HEADER */}
      <div className="flex items-center text-sm font-medium text-gray-600 border-b border-gray-200">
        <div className="flex-shrink-0 w-48 px-2 py-2">Participant</div>

        {criteria.map((c) => (
          <div
            key={c.id}
            className="flex-1 min-w-[80px] px-2 py-2 text-center"
          >
            <div className="text-xs text-gray-400">
              {c.weight}% | Max: {c.maxScore}
            </div>
          </div>
        ))}

        <div className="flex-shrink-0 w-24 px-2 py-2 text-center">Total</div>
      </div>

      {/* ROWS */}
      {participants.map((p) => (
        <div
          key={p.id}
          className="flex items-center border-b border-gray-200"
        >
          {/* NAME */}
          <div className="flex-shrink-0 w-48 px-2 py-3 font-medium text-gray-700">
            {p.name}
          </div>

          {/* CRITERIA INPUTS */}
          {criteria.map((c) => (
            <div
              key={c.id}
              className="flex-1 min-w-[80px] px-2 py-3 flex justify-center"
            >
              <input
                type="number"
                min="0"
                max={c.maxScore}
                value={scores[p.id]?.[c.id] ?? ""}
                onChange={(e) =>
                  handleScoreChange(p.id, c.id, e.target.value, c.maxScore)
                }
                onWheel={(e) => e.target.blur()}
                className="
                  w-full max-w-[60px] h-10
                  text-center text-sm text-gray-700
                  rounded-lg
                  bg-gray-50
                  border border-gray-300
                  focus:outline-none
                  focus:border-orange-400
                  focus:ring-1
                  focus:ring-orange-300
                "
              />
            </div>
          ))}

          {/* TOTAL */}
          <div className="flex-shrink-0 w-24 px-2 py-3 text-center font-semibold text-gray-700">
            {calculateTotal(p.id)}%
          </div>
        </div>
      ))}
    </div>
  );
}

export default JudgeTable;
