import { useState, useEffect } from "react";
import JudgeTable from "../../components/JudgeTable";

function JudgePage() {
  const rounds = ["Preliminary", "Semi Finals", "Grand Finals"];
  const [activeRound, setActiveRound] = useState("Preliminary");
  const [selectedCategory, setSelectedCategory] = useState("");

  const roundData = {
    "Preliminary": [
      {
        categoryName: "Swimwear",
        participants: [
          { id: 1, name: "Jessy Mary" },
          { id: 2, name: "Jane Doe" },
          { id: 3, name: "Kristy Krab" },
        ],
        criteria: [
          { id: "creative", name: "Creative", weight: 30, maxScore: 50 },
          { id: "stage", name: "Stage Presence", weight: 20, maxScore: 40 },
          { id: "poise", name: "Poise & Bearing", weight: 20, maxScore: 40 },
          { id: "audience", name: "Audience Impact", weight: 30, maxScore: 50 },
        ],
      },
      {
        categoryName: "Evening Gown",
        participants: [
          { id: 1, name: "Jessy Mary" },
          { id: 2, name: "Jane Doe" },
          { id: 3, name: "Kristy Krab" },
        ],
        criteria: [
          { id: "grace", name: "Grace", weight: 40, maxScore: 50 },
          { id: "poise", name: "Poise", weight: 60, maxScore: 50 },
        ],
      },
    ],
    "Semi Finals": [
      {
        categoryName: "Swimwear",
        participants: [
          { id: 4, name: "Sophie Hans" },
          { id: 5, name: "Stephannie Curry" },
        ],
        criteria: [
          { id: "confidence", name: "Confidence", weight: 40, maxScore: 50 },
          { id: "presentation", name: "Presentation", weight: 60, maxScore: 60 },
        ],
      },
    ],
    "Grand Finals": [
      {
        categoryName: "Evening Gown",
        participants: [
          { id: 1, name: "Jessy Mary" },
          { id: 5, name: "Stephannie Curry" },
        ],
        criteria: [
          { id: "creativity", name: "Creativity", weight: 50, maxScore: 50 },
          { id: "stage", name: "Stage Presence", weight: 50, maxScore: 50 },
        ],
      },
    ],
  };

  const currentRoundCategories = roundData[activeRound] || [];

  useEffect(() => {
    if (currentRoundCategories.length > 0) {
      setSelectedCategory(currentRoundCategories[0].categoryName);
    } else {
      setSelectedCategory("");
    }
  }, [activeRound]);

  const selectedCategoryData =
    currentRoundCategories.find((cat) => cat.categoryName === selectedCategory) || null;

  let normalizedCriteria = [];
  if (selectedCategoryData) {
    const totalWeight = selectedCategoryData.criteria.reduce((sum, c) => sum + c.weight, 0);
    normalizedCriteria = selectedCategoryData.criteria.map((c) => ({
      ...c,
      weight: (c.weight / totalWeight) * 100,
    }));
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 gap-2">
          <button className="px-5 py-2 rounded-full bg-[#FA824C] text-white text-sm hover:bg-[#FF9768] transition">
            Back
          </button>
          <h1 className="text-lg sm:text-2xl font-semibold text-center">
            Event Title
          </h1>
          <div className="hidden sm:block w-12" />
        </div>
      </div>

      {/* ROUND TABS */}
      <div className="pt-28 px-4 sm:px-6">
        <div className="flex gap-6 overflow-x-auto border-b border-gray-200 mb-4 max-w-6xl mx-auto">
          {rounds.map((round) => (
            <button
              key={round}
              onClick={() => setActiveRound(round)}
              className={`pb-3 whitespace-nowrap text-sm font-medium transition ${
                activeRound === round
                  ? "border-b-2 border-[#FA824C] text-[#FA824C]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {round}
            </button>
          ))}
        </div>

        {/* JUDGE TABLE */}
        {selectedCategoryData && (
          <div className="max-w-6xl mx-auto">
            <JudgeTable
              participants={selectedCategoryData.participants}
              criteria={normalizedCriteria}
              categoryName={selectedCategoryData.categoryName}
              categories={currentRoundCategories}
              onCategorySelect={setSelectedCategory}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default JudgePage;
