// src/pages/judge/JudgePage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JudgeTable from "../../components/JudgeTable";
import JudgeModal from "../../components/JudgeModal";
import { getEventForJudge } from "../../services/judge_service";

function JudgePage() {
  const { invitationCode } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeRound, setActiveRound] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Modal Control
  const [showJudgeModal, setShowJudgeModal] = useState(true);
  const [judgeInfo, setJudgeInfo] = useState(null);

  // Fetch event data
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getEventForJudge(invitationCode);
        setEventData(data);
        setActiveRound(data.event.stages[0]?.name || "");
        setSelectedCategory(data.event.categories[0]?.name || "");
      } catch (err) {
        setError(err.message || "Failed to load judge data");
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [invitationCode, navigate]);

  // Handle modal save
  const handleJudgeSave = (data) => {
    setJudgeInfo(data);
    setShowJudgeModal(false);
  };

  // ✅ Handle modal close (X button)
  const handleModalClose = () => {
    setShowJudgeModal(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!eventData) return null;

  const rounds = eventData.event.stages.map((stage) => stage.name);
  const currentRoundCategories =
    eventData.event.categories.filter((cat) => cat.stageId === activeRound) || [];
  const selectedCategoryData =
    currentRoundCategories.find((cat) => cat.name === selectedCategory) || null;

  let normalizedCriteria = [];
  if (selectedCategoryData) {
    const totalWeight = selectedCategoryData.criteria.reduce((sum, c) => sum + c.weight, 0);
    normalizedCriteria = selectedCategoryData.criteria.map((c) => ({
      ...c,
      weight: totalWeight > 0 ? (c.weight / totalWeight) * 100 : 0,
    }));
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Judge Modal */}
      <JudgeModal
        isOpen={showJudgeModal}
        onClose={handleModalClose} // ✅ now clicking X closes modal
        onSave={handleJudgeSave}
      />

      {/* HEADER */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-40">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 gap-2">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-full bg-[#FA824C] text-white text-sm hover:bg-[#FF9768] transition"
          >
            Back
          </button>

          <h1 className="text-lg sm:text-2xl font-semibold text-center">
            {eventData.event.title}
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
              className={`pb-3 whitespace-nowrap text-sm font-medium transition ${activeRound === round
                  ? "border-b-2 border-[#FA824C] text-[#FA824C]"
                  : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {round}
            </button>
          ))}
        </div>

        {/* JUDGE TABLE */}
        {!showJudgeModal && selectedCategoryData && (
          <div className="max-w-6xl mx-auto">
            <JudgeTable
              participants={selectedCategoryData.participants}
              criteria={normalizedCriteria}
              categoryName={selectedCategoryData.name}
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
