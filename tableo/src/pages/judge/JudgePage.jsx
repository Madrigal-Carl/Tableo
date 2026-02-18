// src/pages/judge/JudgePage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JudgeTable from "../../components/JudgeTable";
import JudgeModal from "../../components/JudgeModal";
import { getEventForJudge, updateJudge } from "../../services/judge_service";
import { showToast } from "../../utils/swal";
import { validateJudgeData } from "../../validations/judge_validation";
import Swal from "sweetalert2";

function JudgePage() {
  const { invitationCode } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 Sequential control
  const [stageIndex, setStageIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Modal
  const [showJudgeModal, setShowJudgeModal] = useState(true);
  const [judgeInfo, setJudgeInfo] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getEventForJudge(invitationCode);
        setEventData(data);

        if (data.judge) {
          const suffix = data.judge.suffix;
          setJudgeInfo({
            name: data.judge.name,
            suffix: suffix,
          });

          setShowJudgeModal(!suffix);
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
      showToast("error", err.message || "Failed to save judge info");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!eventData) return null;

  const sortedStages = [...eventData.event.stages].sort(
    (a, b) => a.sequence - b.sequence,
  );

  const activeStage = sortedStages[stageIndex];

  const currentCategories =
    activeStage?.categories?.sort((a, b) => a.sequence - b.sequence) || [];

  const selectedCategory = currentCategories[categoryIndex] || null;

  // Normalize criteria
  let normalizedCriteria = [];
  if (selectedCategory?.criteria?.length) {
    const totalPercentage = selectedCategory.criteria.reduce(
      (sum, c) => sum + Number(c.percentage || 0),
      0,
    );

    normalizedCriteria = selectedCategory.criteria.map((c) => ({
      id: c.id,
      name: c.label,
      weight: totalPercentage > 0 ? (c.percentage / totalPercentage) * 100 : 0,
      maxScore: selectedCategory.maxScore || 100,
    }));
  }

  const handleProceed = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to proceed?",
      text: "You cannot go back after proceeding.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FA824C",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, Proceed",
    });

    if (result.isConfirmed) {
      const isLastCategory = categoryIndex === currentCategories.length - 1;
      const isLastStage = stageIndex === sortedStages.length - 1;

      if (!isLastCategory) {
        setCategoryIndex((prev) => prev + 1);
      } else if (!isLastStage) {
        setStageIndex((prev) => prev + 1);
        setCategoryIndex(0);
      } else {
        setIsFinished(true);
        Swal.fire({
          icon: "success",
          title: "Judging Completed!",
          text: "Thank you for submitting your scores.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Judge Info Modal */}
      <JudgeModal
        isOpen={showJudgeModal}
        onClose={() => setShowJudgeModal(false)}
        onSave={handleJudgeSave}
        initialData={judgeInfo}
      />

      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-40">
        <div className="flex justify-between items-center px-6 py-3">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-full bg-[#FA824C] text-white hover:bg-[#FF9768]"
          >
            Exit
          </button>

          <h1 className="text-xl font-semibold">{eventData.event.title}</h1>

          <div className="w-10" />
        </div>
      </div>

      <div className="pt-24 px-6">
        {!showJudgeModal && !isFinished && selectedCategory && (
          <div className="max-w-6xl mx-auto">
            <JudgeTable
              participants={eventData.event.candidates}
              criteria={normalizedCriteria}
              categoryName={selectedCategory.name}
            />

            <div className="flex justify-end mt-6">
              <button
                onClick={handleProceed}
                className="px-6 py-3 bg-[#FA824C] text-white rounded-xl hover:bg-[#FF9768]"
              >
                Proceed
              </button>
            </div>
          </div>
        )}

        {isFinished && (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-bold text-green-600">
              Judging Completed 🎉
            </h2>
            <p className="text-gray-500 mt-2">
              Thank you for submitting your scores.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default JudgePage;
