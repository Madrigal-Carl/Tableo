import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

function JudgeTable({ participants = [], criteria = [], categoryName = "", categories = [], onCategorySelect }) {
  const [scores, setScores] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

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

  // Auto-close modal when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      {/* CATEGORY TITLE */}
      {categoryName && (
        <div className="relative">
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#FA824C] mb-4 cursor-pointer flex items-center gap-2 px-2"
            onClick={() => setIsModalOpen((prev) => !prev)}
          >
            {categoryName}
            <ChevronDown className={`transition-transform ${isModalOpen ? "rotate-180" : ""}`} size={16} />
          </h1>

          {/* CATEGORY MODAL */}
          {isModalOpen && categories.length > 0 && (
            <div
              ref={modalRef}
              className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl z-50 p-4"
            >
              <h2 className="text-lg mb-3 text-gray-400">Select Category</h2>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.categoryName}
                    className="p-2 rounded-lg text-left hover:bg-[#FFF2EF] text-gray-700 transition"
                    onClick={() => {
                      onCategorySelect(cat.categoryName);
                      setIsModalOpen(false); // auto-close after selection
                    }}
                  >
                    {cat.categoryName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto h-[600px] overflow-y-auto mt-4">
        {/* HEADER: CRITERIA */}
        <div
          className="grid gap-2 mb-2 text-center font-semibold text-gray-700 sticky top-0 bg-white z-10 border-b border-gray-200"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          <div className="py-2">Participant</div>
          {criteria.map((c) => (
            <div key={c.id} className="py-2">{c.name}</div>
          ))}
          <div className="py-2">Total</div>
        </div>

        {/* HEADER: WEIGHT/MAX */}
        <div
          className="grid gap-2 mb-3 text-xs text-gray-400 text-center pb-2 border-b border-gray-100"
          style={{ gridTemplateColumns: gridTemplate }}
        >
          <div></div>
          {criteria.map((c) => (
            <div key={c.id}>
              {c.weight.toFixed(2)}% | Max: {c.maxScore}
            </div>
          ))}
          <div></div>
        </div>

        {/* PARTICIPANT ROWS */}
        {participants.map((p) => (
          <div
            key={p.id}
            className="grid gap-2 items-center py-2 hover:bg-gray-50 rounded-lg transition"
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
                  onChange={(e) => handleScoreChange(p.id, c.id, e.target.value, c.maxScore)}
                  onWheel={(e) => e.target.blur()}
                  className="w-full max-w-[60px] h-10 text-center text-sm text-gray-700 rounded-lg bg-gray-50 border border-[#FA824C] focus:outline-none focus:ring-2 focus:ring-[#FA824C] focus:border-[#FA824C] transition"
                />
              </div>
            ))}

            <div className="font-semibold text-gray-800 text-center">
              {calculateTotal(p.id)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JudgeTable;
