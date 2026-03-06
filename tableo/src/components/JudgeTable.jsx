import { useEffect, useState } from "react";
import { calculateTotal } from "../validations/judge_score_validation";

function JudgeTable({
  participants = [],
  criteria = [],
  categoryName = "",
  categoryMaxScore,
  scores,
  setScores,
  categoryKey,
  categoryPercentage,
}) {
  const [previewImage, setPreviewImage] = useState(null);

  const handleScoreChange = (participantId, criteriaId, value, maxScore) => {
    let newValue = Number(value); // always convert to number
    if (isNaN(newValue)) newValue = 0; // default to 0 if empty
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

  const gridTemplate = `minmax(200px, 1fr) repeat(${criteria.length}, minmax(120px, 1fr)) 150px`;

  useEffect(() => {
    setScores({});
  }, [categoryKey]);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 relative">
      {categoryName && (
        <h1 className="text-3xl font-bold text-[#192BC2] mb-2 px-2">
          {categoryName}
        </h1>
      )}
      <p className="text-gray-500 mb-4 px-2">
        Max Score: <strong>{categoryMaxScore}</strong> | Category Weight:{" "}
        <strong>{categoryPercentage}%</strong>
      </p>

      {/* Image preview modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="overflow-x-auto max-h-[600px] overflow-y-auto mt-4">
        {/* Header Row */}
        <div
          className="grid gap-2 mb-2 text-center font-semibold text-gray-700 border-b border-gray-200"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          <div className="py-2">Participant</div>
          {criteria.map((c) => (
            <div key={c.id} className="py-2">
              {c.name} <br />
              <span className="text-sm text-gray-500">
                ({c.weight.toFixed(1)}%)
              </span>
            </div>
          ))}
          <div className="py-2">Average</div>
        </div>

        {/* Participant Rows */}
        {participants.map((p) => (
          <div
            key={p.id}
            className="grid gap-2 items-center py-2 hover:bg-gray-50 rounded-lg"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {/* Participant info */}
            <div className="flex items-center gap-3 px-2">
              {p.path ? (
                <img
                  src={`${import.meta.env.VITE_ASSET_URL}${p.path}`}
                  alt={p.name}
                  className="w-12 h-12 object-cover rounded-lg border hover:scale-110 transition cursor-pointer"
                  onClick={() =>
                    setPreviewImage(
                      `${import.meta.env.VITE_ASSET_URL}${p.path}`,
                    )
                  }
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-lg text-xs text-gray-500">
                  N/A
                </div>
              )}
              <span className="font-medium text-gray-800">
                Candiate No. {p.sequence} - {p.name}
              </span>
            </div>

            {/* Criteria input */}
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
                  className="w-full max-w-[60px] h-10 text-center rounded-lg bg-gray-50 border border-[#192BC2] focus:ring-2 focus:ring-[#192BC2]"
                  required
                />
              </div>
            ))}

            {/* Average per participant */}
            <div className="font-semibold text-center">
              {calculateTotal(p.id, criteria, scores, categoryPercentage / 100)}
              %
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JudgeTable;
