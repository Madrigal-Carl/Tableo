import React, { useEffect, useState } from "react";

function EditStageModal({ isOpen, setIsOpen, currentStage, onSave }) {
  const [stageName, setStageName] = useState("");

  useEffect(() => {
    if (currentStage) {
      setStageName(currentStage.name);
    }
  }, [currentStage]);

  if (!isOpen || !currentStage) return null;

  const handleSave = () => {
    if (!stageName.trim()) return;

    onSave({
      ...currentStage,
      name: stageName.trim(),
    });

    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[400px] p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-[#FA824C]">
          Edit Stage Name
        </h2>

        <input
          type="text"
          value={stageName}
          onChange={(e) => setStageName(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-[#FA824C]"
        />

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
