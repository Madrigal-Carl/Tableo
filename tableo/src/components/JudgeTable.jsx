import { useState, useEffect } from "react";

function JudgeTable({ participants = [], criteria = [], categoryName = "" }) {
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

    return criteria
      .reduce((sum, c) => {
        const score = Number(scores[participantId][c.id]) || 0;
        return sum + (score / c.maxScore) * c.weight;
      }, 0)
      .toFixed(2);
  };

  const gridTemplate = `minmax(200px, 1fr) repeat(${criteria.length}, minmax(100px, 1fr)) 120px`;

  useEffect(() => {
    setScores({});
  }, [criteria, participants]);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      {categoryName && (
        <h1 className="text-3xl font-bold text-[#FA824C] mb-6 px-2">
          {categoryName}
        </h1>
      )}

      <div className="overflow-x-auto h-[600px] overflow-y-auto mt-4">
        <div
          className="grid gap-2 mb-2 text-center font-semibold text-gray-700 border-b border-gray-200"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          <div className="py-2">Participant</div>
          {criteria.map((c) => (
            <div key={c.id} className="py-2">
              {c.name}
            </div>
          ))}
          <div className="py-2">Total</div>
        </div>

        {participants.map((p) => (
          <div
            key={p.id}
            className="grid gap-2 items-center py-2 hover:bg-gray-50 rounded-lg"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            <div className="font-medium text-gray-800 px-2">{p.name}</div>

            {criteria.map((c) => (
              <div key={c.id} className="px-2 flex justify-center">
                <input
                  type="number"
                  min="0"
                  max={c.maxScore}
                  value={scores[p.id]?.[c.id] ?? ""}
                  onChange={(e) =>
                    handleScoreChange(p.id, c.id, e.target.value, c.maxScore)
                  }
                  onWheel={(e) => e.target.blur()}
                  className="w-full max-w-[60px] h-10 text-center rounded-lg bg-gray-50 border border-[#FA824C] focus:ring-2 focus:ring-[#FA824C]"
                />
              </div>
            ))}

            <div className="font-semibold text-center">
              {calculateTotal(p.id)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JudgeTable;
