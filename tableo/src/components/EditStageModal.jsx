import React, { useEffect, useState } from "react";

function EditStageModal({
  isOpen,
  setIsOpen,
  currentStage,
  stages = [], // 👈 pass all stages here
  onSave,
}) {
  const [stageName, setStageName] = useState("");
  const [sequence, setSequence] = useState(1);

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

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#FA824C] text-white hover:bg-orange-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditStageModal;