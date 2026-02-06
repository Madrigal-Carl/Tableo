import React, { useState } from "react";
import CategoryCard from "../../components/CategoryCard";
import SideNavigation from "../../components/SideNavigation";
import { ChevronLeft } from "lucide-react";

function CategoryPage() {
  const [categoryName, setCategoryName] = useState("");
  const [categoryWeight, setCategoryWeight] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedRound, setSelectedRound] = useState("");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [criteriaList, setCriteriaList] = useState([{ name: "", weight: "" }]);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [openCriteriaId, setOpenCriteriaId] = useState(null);
  const [activeTopTab, setActiveTopTab] = useState("Rounds");
  const tabs = ["Rounds", "Participants", "Judges"];

  const activeIndex = tabs.indexOf(activeTopTab);

  const rounds = ["Round 1", "Round 2", "Round 3", "Round 4", "Round 5"];
  const [activeRound, setActiveRound] = useState("Round 1");

  const filteredCategories = categories.filter(
    (c) => c.round === activeRound
  );

  // ============================
  // CATEGORY HANDLERS
  // ============================
  const handleAddCategory = () => {
    if (!categoryName.trim() || !selectedRound) return;

    setPendingCategory({
      id: Date.now(),
      name: categoryName,
      round: selectedRound,
      weight: categoryWeight,
      criteria: [],
    });

    setIsCategoryModalOpen(false);
    setIsCriteriaModalOpen(true);
  };

  const handleAddCriteriaRow = () => {
    setCriteriaList([...criteriaList, { name: "", weight: "" }]);
  };

  const handleRemoveCriteriaRow = (index) => {
    if (criteriaList.length === 1) return;
    setCriteriaList(criteriaList.filter((_, i) => i !== index));
  };

  const handleCriteriaChange = (index, field, value) => {
    const updated = [...criteriaList];
    updated[index][field] = value;
    setCriteriaList(updated);
  };

  const handleConfirmCriteria = () => {
    if (!pendingCategory) return;

    setCategories((prev) => [
      ...prev,
      {
        ...pendingCategory,
        criteria: criteriaList.filter((c) => c.name.trim() && c.weight),
      },
    ]);

    setPendingCategory(null);
    setCriteriaList([{ name: "", weight: "" }]);
    setSelectedRound("");
    setCategoryName("");
    setCategoryWeight("");
    setIsCriteriaModalOpen(false);
  };

  return (
    <>
    <div className="flex h-screen bg-gray-100">
            <SideNavigation />

      {/* MAIN SECTION */}
      <section className="flex-1 ml-72 p-8 overflow-y-auto">
        
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mt-5 mb-14">
        <div className="flex items-center gap-3 text-gray-700">
          <ChevronLeft size={30} className="cursor-pointer hover:text-gray-900" />
          <h1 className="text-4xl font-semibold">Mr. & Mrs. 2026</h1>
        </div>
      </div>

      <div className="flex items-center justify-between ml-3 mb-8">
        {/* LEFT TABS */}
      <div className="relative flex w-fit bg-[#FA824C] p-1 rounded-md overflow-hidden">
        
        {/* SLIDING INDICATOR */}
        <div
          className="absolute top-1 left-1 h-[40px] bg-white rounded-sm transition-transform duration-300 ease-out"
          style={{
            width: "110px",
            transform: `translateX(${activeIndex * 110}px)`,
          }}
        />

        {/* BUTTONS */}
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTopTab(tab)}
            className={`relative z-10 w-[110px] h-[40px] text-base font-medium transition-colors
              ${
                activeTopTab === tab
                  ? "text-gray-600"
                  : "text-white"
              }
            `}
          >
            {tab}
          </button>
        ))}

      </div>
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="w-fit bg-[#FA824C] p-3 rounded-lg h-[50px] text-white font-medium hover:bg-orange-600 transition"
        >
          + Add Category
        </button>
      </div>

      {/* ROUND TABS */}
      <div className="flex gap-6 border-b border-gray-300 mb-6 pl-25">
        {rounds.map(round => (
          <button
            key={round}
            onClick={() => setActiveRound(round)}
            className={`pb-3 text-lg font-medium ${
              activeRound === round
                ? "border-b-2 border-[#FA824C] text-[#FA824C]"
                : "text-gray-400"
            }`}
          >
            {round}
          </button>
        ))}
      </div>

        {/* CATEGORY TABLE */}
        <div className="flex-1 px-6">
          <CategoryCard
            categories={filteredCategories}
            openCriteriaId={openCriteriaId}
            setOpenCriteriaId={setOpenCriteriaId}
          />
        </div>
      </section>

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-center text-xl font-semibold mb-6">
              Add Category
            </h2>
            <form className="space-y-5">

              {/* CATEGORY NAME */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full rounded-full border border-orange-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
              </div>

              {/* ROUND SELECT */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 mb-1">
                  Round
                </label>
                <select
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(e.target.value)}
                  className="w-full rounded-full border border-orange-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                >
                  <option value="" disabled>
                    Select a round
                  </option>
                  {rounds.map((round) => (
                    <option key={round} value={round}>
                      {round}
                    </option>
                  ))}
                </select>
              </div>

              {/* WEIGHT + MAX SCORE */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-500 mb-1">
                    Category Weight (%)
                  </label>
                  <input
                    type="number"
                    value={categoryWeight}
                    onChange={(e) => setCategoryWeight(e.target.value)}
                    placeholder="Enter weight %"
                    className="w-full rounded-full border border-orange-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                  <span className="text-xs text-gray-400 mt-1">
                    All category weights must total 100%.
                  </span>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-500 mb-1">
                    Max Score
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-full border border-orange-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                  <span className="text-xs text-gray-400 mt-1">
                    Maximum points available for this category.
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-6 py-2 rounded-full border border-orange-400 text-orange-500 hover:bg-orange-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-6 py-2 rounded-full bg-[#FA824C] text-white hover:bg-orange-600 transition"
                >
                  Confirm
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CRITERIA MODAL */}
      {isCriteriaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-h-[90vh] max-w-md rounded-2xl shadow-xl p-6 overflow-y-auto">
            <h2 className="text-center text-xl font-semibold mb-6">
              Criteria
            </h2>

            {criteriaList.map((criteria, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_auto] gap-3 mb-4 items-end"
              >
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
                <div className="flex flex-col">
                  <label className="text-sm text-gray-500 mb-1">
                    Criteria Weight
                  </label>
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

            <button
              type="button"
              onClick={handleAddCriteriaRow}
              className="w-full rounded-full bg-[#FA824C] text-white py-2 mb-6 hover:bg-orange-600 transition"
            >
              + Add Criteria
            </button>

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
      )}
    </div>
    </>
  );
}

export default CategoryPage;
