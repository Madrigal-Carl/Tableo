// src/pages/judge/JudgePage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JudgeTable from "../../components/JudgeTable";
import JudgeModal from "../../components/JudgeModal";
import { getEventForJudge, updateJudge } from "../../services/judge_service";
import { showToast } from "../../utils/swal";
import { validateJudgeData } from "../../validations/judge_validation";

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

        console.log("EVENT STAGES:", data.event.stages);
        console.log("EVENT CATEGORIES:", data.event.categories);
        console.log("CATEGORY[0]:", data.event.categories?.[0]);
        setEventData(data);
        const firstStageName = data.event.stages[0]?.name || "";
        setActiveRound(firstStageName);

        const firstStage = data.event.stages.sort(
          (a, b) => a.sequence - b.sequence,
        )[0];

        setSelectedCategory(firstStage?.categories?.[0]?.name || "");

        if (data.judge) {
          const suffix = data.judge.suffix;
          setJudgeInfo({
            name: data.judge.name,
            suffix: suffix,
          });

          setShowJudgeModal(suffix === null || suffix === "");
        }
      } catch (err) {
        setError(err.message || "Failed to load judge data");
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [invitationCode, navigate]);

  useEffect(() => {
    if (!eventData) return;

    const stage = eventData.event.stages.find((s) => s.name === activeRound);

    setSelectedCategory(stage?.categories?.[0]?.name || "");
  }, [activeRound]);

  const handleJudgeSave = async (data) => {
    if (!validateJudgeData(data)) return;

    try {
      const res = await updateJudge(invitationCode, data);

      setJudgeInfo({
        name: res.judge.name,
        suffix: res.judge.suffix ?? "",
      });

      setShowJudgeModal(false);
      showToast("success", "Judge info saved successfully");
    } catch (err) {
      const backendMessage = err.message || "Failed to save judge info";
      showToast("error", backendMessage);
    }
  };

  // ✅ Handle modal close (X button)
  const handleModalClose = () => {
    setShowJudgeModal(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!eventData) return null;

  const rounds = eventData.event.stages
    .sort((a, b) => a.sequence - b.sequence)
    .map((stage) => stage.name);

  const activeStage =
    eventData.event.stages.find((s) => s.name === activeRound) ||
    eventData.event.stages[0];

  const currentRoundCategories = activeStage?.categories || [];
  const selectedCategoryData =
    currentRoundCategories.find((cat) => cat.name === selectedCategory) || null;

  let normalizedCriteria = [];
  if (selectedCategoryData?.criteria?.length) {
    const totalPercentage = selectedCategoryData.criteria.reduce(
      (sum, c) => sum + Number(c.percentage || 0),
      0,
    );

    normalizedCriteria = selectedCategoryData.criteria.map((c) => ({
      id: c.id,
      name: c.label, // ✅ FIX
      weight: totalPercentage > 0 ? (c.percentage / totalPercentage) * 100 : 0,
      maxScore: selectedCategoryData.maxScore || 100, // ✅ FIX
    }));
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Judge Modal */}
      <JudgeModal
        isOpen={showJudgeModal}
        onClose={handleModalClose}
        onSave={handleJudgeSave}
        initialData={judgeInfo}
      />

      {/* HEADER */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-40">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 gap-2">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-full bg-[#FA824C] text-white text-sm hover:bg-[#FF9768] transition"
          >
            Back
          </button>

          {/* Event Title */}
          <h1 className="text-lg sm:text-2xl font-semibold text-center">
            {eventData.event.title}
          </h1>

          {/* Profile Icon */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowJudgeModal(true)}
              className="relative w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition"
              title="Edit Profile"
            >
              {/* Use initials if name exists */}
              <span className="text-sm font-semibold text-gray-700">
                {judgeInfo?.name
                  ? judgeInfo.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "J"}
              </span>
            </button>
          </div>
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
        {!showJudgeModal &&
          selectedCategoryData &&
          normalizedCriteria.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <JudgeTable
                participants={eventData.event.candidates}
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
