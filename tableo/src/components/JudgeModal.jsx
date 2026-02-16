// src/components/JudgeModal.jsx
import React, { useState, useEffect } from "react";

const SUFFIX_OPTIONS = [
    { label: "None", value: "" },
    { label: "Mr", value: "mr" },
    { label: "Mrs", value: "mrs" },
    { label: "Ms", value: "ms" },
];

function JudgeModal({ isOpen, onClose, onSave, initialData = null }) {
    const [name, setName] = useState("");
    const [suffix, setSuffix] = useState("");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setSuffix(initialData.suffix || "");
        } else {
            setName("");
            setSuffix("");
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Judge name is required");
            return;
        }

        onSave({
            name: name.trim(),
            suffix: suffix || null,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">
                    {initialData ? "Edit Judge" : "Add Judge"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Judge Name */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Judge Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring"
                            placeholder="Enter judge name"
                            required
                        />
                    </div>

                    {/* Suffix Dropdown */}
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Suffix
                        </label>
                        <select
                            value={suffix}
                            onChange={(e) => setSuffix(e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring"
                        >
                            {SUFFIX_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded border px-4 py-2 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default JudgeModal;
