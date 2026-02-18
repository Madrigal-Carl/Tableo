import React, { useState, useEffect } from "react";

const SUFFIX_OPTIONS = ["", "Mr", "Ms", "Mrs"];
const SEX_OPTIONS = ["", "Male", "Female"];

function EditModal({ isOpen, onClose, onSave, item, isParticipant = false }) {
  const [formData, setFormData] = useState({
    name: "",
    suffix: "",
    sex: "",
    photoFile: null, // store the actual File
    photoPreview: "", // store preview URL
  });

  // Initialize form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        suffix: item.suffix || "",
        sex: item.sex || "",
        photoFile: null,
        photoPreview: item.photo || "", // initial preview
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

  const handleFileChange = (file) => {
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      photoFile: file, // keep the actual file
      photoPreview: URL.createObjectURL(file), // preview
    }));
  };

  const handleSave = () => {
    // Pass the actual file along with other fields
    onSave({
      name: formData.name,
      suffix: formData.suffix,
      sex: formData.sex,
      photoFile: formData.photoFile,
    });
    onClose();
  };

  const renderInputField = (key, value) => {
    if (key === "id") return null;

    // 🔹 Suffix dropdown (Judges only)
    if (!isParticipant && key === "suffix") {
      return (
        <div key={key}>
          <label className="text-sm text-gray-500 capitalize">{key}</label>
          <div className="relative mt-1">
            <select
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full rounded-full border-orange-400 border px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-[#FA824C]"
            >
              {SUFFIX_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option || "None"}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    // 🔹 Sex dropdown (Participants only)
    if (isParticipant && key === "sex") {
      return (
        <div key={key}>
          <label className="text-sm text-gray-500 capitalize">{key}</label>
          <div className="relative mt-1">
            <select
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full rounded-full border-orange-400 border px-4 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-[#FA824C]"
            >
              {SEX_OPTIONS.map((option) => (
                <option key={option} value={option} disabled={option === ""}>
                  {option === "" ? "Select Sex" : option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    // 🔹 Image upload (Participants only)
    if (isParticipant && key === "photoFile") {
      return (
        <div key={key}>
          <label className="text-sm text-gray-500 capitalize">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files[0])}
            className="w-full mt-1 rounded-full border-orange-400 border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#FA824C]"
          />
          {formData.photoPreview && (
            <img
              src={formData.photoPreview}
              alt="preview"
              className="mt-2 w-20 h-20 rounded-full object-cover border border-orange-400"
            />
          )}
        </div>
      );
    }

    // 🔹 Default text input (Name)
    if (key === "name") {
      return (
        <div key={key}>
          <label className="text-sm text-gray-500 capitalize">{key}</label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full mt-1 rounded-full border-orange-400 border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#FA824C]"
          />
        </div>
      );
    }

    return null;
  };

  const keysToRender = isParticipant ? ["name", "sex", "photoFile"] : ["name", "suffix"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Edit {isParticipant ? "Participant" : "Judge"}
        </h2>

        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {keysToRender.map((key) => renderInputField(key, formData[key]))}
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
