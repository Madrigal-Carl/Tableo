import React, { useEffect, useState } from "react";

function EditStageModal({
  isOpen,
  setIsOpen,
  currentStage,
  stages = [],
  onSave,
  menRankings = [],
  womenRankings = [],
}) {
  const [stageName, setStageName] = useState("");
  const [sequence, setSequence] = useState(1);
  const [activeTab, setActiveTab] = useState("men"); // ✅ NEW

  useEffect(() => {
    if (currentStage) {
      setStageName(currentStage.name);
      setSequence(currentStage.sequence);
    }
  }, [currentStage]);

  if (!isOpen || !currentStage) return null;

  const handleSave = () => {
    if (!stageName.trim()) return;

    onSave({
      ...currentStage,
      name: stageName.trim(),
      sequence: Number(sequence),
    });

    setIsOpen(false);
  };

  const totalStages = stages.length;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[400px] p-6 shadow-xl">

        <h2 className="text-xl font-semibold mb-4 text-[#FA824C]">
          Edit Stage
        </h2>

        {/* Stage Name */}
        <label className="block text-sm mb-1 font-medium">
          Stage Name
        </label>
        <input
          type="text"
          value={stageName}
          onChange={(e) => setStageName(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#FA824C]"
        />

        {/* Sequence Dropdown */}
        <label className="block text-sm mb-1 font-medium">
          Sequence
        </label>
        <select
          value={sequence}
          onChange={(e) => setSequence(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[#FA824C]"
        >
          {Array.from({ length: totalStages }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        {/* ================= RANKING SECTION ================= */}
        <div className="mt-6">

          {/* TAB HEADER */}
          <div className="relative flex border-b mb-4">

            <button
              onClick={() => setActiveTab("men")}
              className={`flex-1 py-2 text-sm font-semibold transition-all duration-300 ${
                activeTab === "men"
                  ? "text-[#FA824C]"
                  : "text-gray-400"
              }`}
            >
              Men
            </button>

            <button
              onClick={() => setActiveTab("women")}
              className={`flex-1 py-2 text-sm font-semibold transition-all duration-300 ${
                activeTab === "women"
                  ? "text-[#FA824C]"
                  : "text-gray-400"
              }`}
            >
              Women
            </button>

            {/* Sliding Border */}
            <span
              className={`absolute bottom-0 left-0 h-[3px] w-1/2 bg-[#FA824C] transition-transform duration-300 ${
                activeTab === "women" ? "translate-x-full" : ""
              }`}
            />
          </div>

          {/* TABLE */}
          <div className="bg-gray-50 p-3 rounded-lg">

            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Rank</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Score</th>
                </tr>
              </thead>

              <tbody>
                {(activeTab === "men" ? menRankings : womenRankings)?.length > 0 ? (
                  (activeTab === "men" ? menRankings : womenRankings).map(
                    (item, index) => (
                      <tr key={index} className="text-center">
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border">{item.name}</td>
                        <td className="p-2 border">{item.score}</td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-2 border text-gray-400 text-center"
                    >
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#FA824C] text-white hover:bg-orange-600 text-sm"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditStageModal;