import React, { useState, useEffect } from "react";

const SUFFIX_OPTIONS = ["", "Dr", "Atty", "Engr", "Hon", "Prof"];

function EditModal({ isOpen, onClose, onSave, item }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        suffix: "",
        ...item,
        });
    }
  }, [item]);

    if (!isOpen) return null;


  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const renderInputField = (key, value) => {
    if (key === "id") return null;

    // 🔹 SUFFIX DROPDOWN
    if (key === "suffix") {
      return (
        <div key={key}>
          <label className="text-sm text-gray-500 capitalize">
            {key}
          </label>
          <select
            value={value || ""}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full mt-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#FA824C]"
          >
            {SUFFIX_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option || "None"}
              </option>
            ))}
          </select>
        </div>
      );
    }

    // 🔹 NUMBER FIELD (auto detect)
    if (typeof value === "number") {
      return (
        <div key={key}>
          <label className="text-sm text-gray-500 capitalize">
            {key}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(key, Number(e.target.value))}
            className="w-full mt-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#FA824C]"
          />
        </div>
      );
    }

    // 🔹 DEFAULT TEXT FIELD
    return (
      <div key={key}>
        <label className="text-sm text-gray-500 capitalize">
          {key}
        </label>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => handleChange(key, e.target.value)}
          className="w-full mt-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#FA824C]"
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Edit Details
        </h2>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
         {formData &&
            Object.entries(formData).map(([key, value]) =>
                renderInputField(key, value)
            )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full border border-orange-400 text-orange-500"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-full bg-[#FA824C] text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
