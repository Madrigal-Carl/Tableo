import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JudgeTable from "../../components/JudgeTable";
import JudgeModal from "../../components/JudgeModal";
import FullScreenLoader from "../../components/FullScreenLoader";
import Swal from "sweetalert2";

import { getEventForJudge, updateJudge } from "../../services/judge_service";
import {
  submitScores,
  checkCategoryCompleted,
} from "../../services/competition_score_service";
import { showToast } from "../../utils/swal";
import { validateJudgeData } from "../../validations/judge_validation";
import { validateScores } from "../../validations/judge_score_validation";

function JudgePage() {
  const { invitationCode } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sequential control
  const [stageIndex, setStageIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Modal
  const [showJudgeModal, setShowJudgeModal] = useState(true);
  const [judgeInfo, setJudgeInfo] = useState(null);

  const [scores, setScores] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEventForJudge(invitationCode);
        setEventData(data);

        if (data.judge) {
          const suffix = data.judge.suffix;
          setJudgeInfo({ name: data.judge.name, suffix });
          setShowJudgeModal(!suffix);
        }

        await autoSelectCategory(data);
      } catch (err) {
        setError(err.message || "Failed to load judge data");
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [invitationCode, navigate]);

  const autoSelectCategory = async (data) => {
    const sortedStages = [...data.event.stages].sort(
      (a, b) => a.sequence - b.sequence,
    );

    for (let s = 0; s < sortedStages.length; s++) {
      const stage = sortedStages[s];
      const categories = (stage.categories || []).sort(
        (a, b) => a.sequence - b.sequence,
      );

      for (let c = 0; c < categories.length; c++) {
        const cat = categories[c];
        const completed = await checkCategoryCompleted(invitationCode, cat.id);

        if (!completed) {
          setStageIndex(s);
          setCategoryIndex(c);
          return;
        }
      }
    }

    setIsFinished(true);
  };

  const handleJudgeSave = async (data) => {
    if (!validateJudgeData(data)) return;

    try {
      const res = await updateJudge(invitationCode, data);
      setJudgeInfo({ name: res.judge.name, suffix: res.judge.suffix ?? "" });
      setShowJudgeModal(false);
      showToast("success", "Judge info saved successfully");
    } catch (err) {
      showToast("error", err.message || "Failed to save judge info");
    }
  };

  const handleProceed = async () => {
    const selectedCategory =
      eventData.event.stages[stageIndex].categories[categoryIndex];
    const normalizedCriteria = normalizeCriteria(selectedCategory);

    const allFilled = validateScores(
      eventData.event.candidates,
      normalizedCriteria,
      scores,
    );

    if (!allFilled) {
      showToast("error", "Please fill in all scores before proceeding");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure you want to proceed?",
      text: "You cannot go back after proceeding.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FA824C",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, Proceed",
    });

    if (!result.isConfirmed) return;

    // Prepare scores for submission
    const scoresToSubmit = [];
    const judgeId = eventData.judge.id;

    eventData.event.candidates.forEach((candidate) => {
      normalizedCriteria.forEach((criterion) => {
        scoresToSubmit.push({
          candidate_id: candidate.id,
          judge_id: judgeId,
          criterion_id: criterion.id,
          score: scores[candidate.id][criterion.id], // always number
        });
      });
    });

    try {
      await submitScores(invitationCode, scoresToSubmit);
      showToast("success", "Scores submitted successfully");
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to submit scores";
      showToast("error", msg);
      return;
    }

    // Move to next category/stage
    const currentStageCategories = eventData.event.stages[
      stageIndex
    ].categories.sort((a, b) => a.sequence - b.sequence);

    if (categoryIndex + 1 < currentStageCategories.length) {
      // Move to next category in the same stage
      setCategoryIndex(categoryIndex + 1);
      setScores({});
    } else if (stageIndex + 1 < eventData.event.stages.length) {
      // Move to first category of the next stage
      setStageIndex(stageIndex + 1);
      setCategoryIndex(0);
      setScores({});
    } else {
      // Finished all stages and categories
      setIsFinished(true);
    }
  };

  const normalizeCriteria = (category) => {
    if (!category?.criteria?.length) return [];
    const total = category.criteria.reduce(
      (sum, c) => sum + Number(c.percentage || 0),
      0,
    );
    return category.criteria.map((c) => ({
      id: c.id,
      name: c.label,
      weight: total > 0 ? (c.percentage / total) * 100 : 0,
      maxScore: category.maxScore || 100,
    }));
  };

  if (error) return <p>{error}</p>;
  if (!eventData) return null;

  const activeStage = [...eventData.event.stages].sort(
    (a, b) => a.sequence - b.sequence,
  )[stageIndex];
  const currentCategories = (activeStage?.categories || []).sort(
    (a, b) => a.sequence - b.sequence,
  );
  const selectedCategory = currentCategories[categoryIndex] ?? null;
  const normalizedCriteria = normalizeCriteria(selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <FullScreenLoader show={loading} />

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
              categoryMaxScore={selectedCategory.maxScore}
              scores={scores}
              setScores={setScores}
              categoryKey={`${stageIndex}-${categoryIndex}`}
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
          <div className="text-center mt-60">
            <h2 className="text-5xl md:text-6xl font-extrabold text-green-600 mb-4">
              Judging Completed 🎉
            </h2>
            <p className="text-xl md:text-2xl text-gray-600">
              Thank you for submitting your scores.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default JudgePage;
