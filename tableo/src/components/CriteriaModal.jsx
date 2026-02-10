// src/components/CriteriaModal.jsx
import React from "react";

function CriteriaModal({
    isOpen,
    criteriaList,
    handleCriteriaChange,
    handleAddCriteriaRow,
    handleRemoveCriteriaRow,
    handleConfirmCriteria,
    setIsCriteriaModalOpen,
    setIsCategoryModalOpen,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white w-full max-w-md max-h-[90vh] rounded-2xl shadow-xl p-6 overflow-y-auto">

                {/* TITLE */}
                <h2 className="text-center text-xl font-semibold mb-6">
                    Criteria
                </h2>

                {/* CRITERIA INPUT ROWS */}
                {criteriaList.map((criteria, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[1fr_1fr_auto] gap-3 mb-4 items-end"
                    >
                        {/* CRITERIA NAME */}
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500 mb-1">Criteria</label>
                            <input
                                type="text"
                                value={criteria.name}
                                onChange={(e) =>
                                    handleCriteriaChange(index, "name", e.target.value)
                                }
                                placeholder="Enter criteria"
                                className="w-full rounded-full border border-orange-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                            />
                        </div>

                        {/* CRITERIA WEIGHT */}
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500 mb-1">Criteria Weight</label>
                            <input
                                type="number"
                                value={criteria.weight}
                                onChange={(e) =>
                                    handleCriteriaChange(index, "weight", e.target.value)
                                }
                                placeholder="%"
                                className="w-full rounded-full border border-orange-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                            />
                        </div>

                        {/* DELETE BUTTON */}
                        <button
                            type="button"
                            onClick={() => handleRemoveCriteriaRow(index)}
                            className="mb-1 px-2 py-1 rounded-full text-red-500 hover:bg-red-50 transition"
                            title="Remove"
                        >
                            ✕
                        </button>
                    </div>
                ))}

                {/* ADD CRITERIA BUTTON */}
                <button
                    type="button"
                    onClick={handleAddCriteriaRow}
                    className="w-full rounded-full bg-[#FA824C] text-white py-2 mb-6 hover:bg-orange-600 transition"
                >
                    + Add Criteria
                </button>

                {/* ACTION BUTTONS */}
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => {
                            setIsCriteriaModalOpen(false);
                            setIsCategoryModalOpen(true);
                        }}
                        className="px-6 py-2 rounded-full border border-orange-400 text-orange-500 hover:bg-orange-50 transition"
                    >
                        Previous
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirmCriteria}
                        className="px-6 py-2 rounded-full bg-[#FA824C] text-white hover:bg-orange-600 transition"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CriteriaModal;