import React, { useEffect } from "react";
import { getCategoriesByStage } from "../services/category_service";
import { showToast } from "../utils/swal";

function AddCategoryModal({
    isOpen,
    selectedStage,
    setSelectedStage,
    categoryList,
    setCategoryList,
    handleCategoryChange,
    handleAddCategoryRow,
    handleRemoveCategoryRow,
    handleConfirmCategories,
    setIsCategoryModalOpen,
    stages = [],
    eventId,
    eventStages = [],
}) {
    useEffect(() => {
        if (!isOpen || !selectedStage) return;

        async function fetchCategories() {
            try {
                const stageId = eventStages.find((s) => s.name === selectedStage)?.id;
                if (!stageId) return;

                const res = await getCategoriesByStage(eventId, stageId);
                const fetchedCategories = res.data.categories || [];

                if (fetchedCategories.length > 0) {
                    setCategoryList(
                        fetchedCategories.map((c) => ({
                            name: c.name || "",
                            weight: c.percentage || "",
                            maxScore: c.maxScore || "",
                        }))
                    );
                } else {
                    setCategoryList([{ name: "", weight: "", maxScore: "" }]);
                }
            } catch (err) {
                console.error("Failed to fetch categories in modal", err);
                showToast("error", "Failed to load categories for this stage");
            }
        }

        fetchCategories();
    }, [isOpen, selectedStage, eventId, eventStages, setCategoryList]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-2xl shadow-xl p-6 overflow-y-auto">

                <h2 className="text-center text-xl font-semibold mb-4">Add Categories</h2>

                {/* CATEGORY ROWS */}
                {categoryList.map((category, index) => (
                    <div key={index} className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-3 mb-4 items-end">
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500 mb-1">Category</label>
                            <input
                                type="text"
                                value={category.name}
                                onChange={(e) => handleCategoryChange(index, "name", e.target.value)}
                                placeholder="Category name"
                                className="w-full rounded-full border border-orange-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500 mb-1">Weight %</label>
                            <input
                                type="number"
                                value={category.weight}
                                onChange={(e) => handleCategoryChange(index, "weight", e.target.value)}
                                placeholder="%"
                                className="w-full rounded-full border border-orange-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500 mb-1">Max</label>
                            <input
                                type="number"
                                value={category.maxScore}
                                onChange={(e) => handleCategoryChange(index, "maxScore", e.target.value)}
                                placeholder="Score"
                                className="w-full rounded-full border border-orange-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveCategoryRow(index)}
                            className="mb-1 px-2 py-1 rounded-full text-red-500 hover:bg-red-50 transition"
                            title="Remove"
                        >
                            ✕
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={handleAddCategoryRow}
                    className="w-full rounded-full bg-[#FA824C] text-white py-2 mb-6 hover:bg-orange-600 transition"
                >
                    + Add Category
                </button>

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(false)}
                        className="px-6 py-2 rounded-full border border-orange-400 text-orange-500 hover:bg-orange-50 transition"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirmCategories}
                        className="px-6 py-2 rounded-full bg-[#FA824C] text-white hover:bg-orange-600 transition"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCategoryModal;
