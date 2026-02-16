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

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">

                {/* CLOSE BUTTON */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 px-2 py-1 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* HEADER */}
                <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-900 text-center">
                        Judge Information
                    </h2>
                    <p className="text-sm text-gray-500 text-center mt-1">
                        Please enter your details to continue
                    </p>
                </div>

                {/* BODY */}
                <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">

                    {/* Judge Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Judge Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FA824C]"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    {/* Suffix */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Suffix
                        </label>
                        <select
                            value={suffix}
                            onChange={(e) => setSuffix(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FA824C]"
                        >
                            {SUFFIX_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ACTION */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-[#FA824C] py-2.5 text-sm font-semibold text-white hover:bg-[#FF9768] transition"
                        >
                            Continue to Scoring
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default JudgeModal;
