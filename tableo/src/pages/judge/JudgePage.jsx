import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JudgeTable from "../../components/JudgeTable";
import JudgeModal from "../../components/JudgeModal";
import FullScreenLoader from "../../components/FullScreenLoader";
import Swal from "sweetalert2";
import AdminDecisionOverlay from "../../components/AdminDecisionOverlay";
import {
  getEventForJudge,
  updateJudge,
  getPassedCandidates,
  checkReadyForNextStage,
} from "../../services/judge_service";
import {
  submitScores,
  checkCategoryCompleted,
  getCategoryJudgeStatuses,
} from "../../services/competition_score_service";
import { showToast } from "../../utils/swal";
import { validateJudgeData } from "../../validations/judge_validation";
import { validateScores } from "../../validations/judge_score_validation";
import JudgeWaitingOverlay from "../../components/JudgeWaitingOverlay";

function JudgePage() {
  const { invitationCode } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stageIndex, setStageIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const prevAdminOverlayRef = useRef(false);
  const [showJudgeModal, setShowJudgeModal] = useState(true);
  const [judgeInfo, setJudgeInfo] = useState(null);
  const [blockedStageId, setBlockedStageId] = useState(null);
  const [scores, setScores] = useState({});
  const [showWaitingOverlay, setShowWaitingOverlay] = useState(false);
  const [showAdminOverlay, setShowAdminOverlay] = useState(false);
  // ✅ NEW STATE FOR LIVE JUDGE STATUSES
  const [judgeStatuses, setJudgeStatuses] = useState([]);
  const [passedCandidates, setPassedCandidates] = useState([]);
  const [justSubmitted, setJustSubmitted] = useState(false);

  /* ===================================================== */
  /* FETCH DATA */
  /* ===================================================== */

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

  useEffect(() => {
    if (!eventData) return;

    const fetchPassedCandidates = async () => {
      try {
        const activeStage = [...eventData.event.stages].sort(
          (a, b) => a.sequence - b.sequence,
        )[stageIndex];

        if (!activeStage) return;

        const res = await getPassedCandidates(invitationCode, activeStage.id);

        setPassedCandidates(res.candidates || []);
      } catch (err) {
        console.error("Failed to fetch passed candidates", err);
      }
    };

    fetchPassedCandidates();
  }, [stageIndex, eventData]);

  useEffect(() => {
    if (prevAdminOverlayRef.current && !showAdminOverlay) {
      window.location.reload();
    }

    prevAdminOverlayRef.current = showAdminOverlay;
  }, [showAdminOverlay]);

  /* ===================================================== */
  /* AUTO SELECT CATEGORY */
  /* ===================================================== */

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

  /* ===================================================== */
  /* POLLING FOR OTHER JUDGES (UPDATED) */
  /* ===================================================== */

  useEffect(() => {
    if (!eventData) return;

    const fetchStatuses = async () => {
      try {
        const currentStage = [...eventData.event.stages].sort(
          (a, b) => a.sequence - b.sequence,
        )[stageIndex];

        const currentCategories = (currentStage?.categories || []).sort(
          (a, b) => a.sequence - b.sequence,
        );

        const currentCategory = currentCategories[categoryIndex];

        if (!currentCategory) return;

        const statuses = await getCategoryJudgeStatuses(
          invitationCode,
          currentCategory.id,
        );

        const filtered = statuses.filter((j) => j.id !== eventData.judge.id);

        setJudgeStatuses(filtered);

        const myStatus = statuses.find((j) => j.id === eventData.judge.id);

        const iHaveScored = myStatus?.status === "done";

        const allCompleted =
          statuses.length > 0 && statuses.every((j) => j.status === "done");

        /**
         * ⭐ CRITICAL FIX
         * Only open waiting overlay if:
         * - I just submitted
         * - Backend confirms I am done
         */
        if (justSubmitted && iHaveScored && !showAdminOverlay) {
          setShowWaitingOverlay(true);
        }

        /**
         * Move forward if everyone finished
         */
        if (allCompleted) {
          setShowWaitingOverlay(false);
          await moveToNextCategory();
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    fetchStatuses();

    const interval = setInterval(fetchStatuses, 3000);

    return () => clearInterval(interval);
  }, [stageIndex, categoryIndex, eventData, justSubmitted, showAdminOverlay]);

  /* ===================================================== */
  /* POLLING FOR ADMIN DECISION */
  /* ===================================================== */

  useEffect(() => {
    if (!showAdminOverlay || !blockedStageId) return;

    const interval = setInterval(async () => {
      try {
        const { ready } = await checkReadyForNextStage(
          invitationCode,
          blockedStageId,
        );

        if (ready) {
          setShowAdminOverlay(false);
          setBlockedStageId(null);
          setStageIndex((prev) => prev + 1);
          setCategoryIndex(0);
          setScores({});
          setShowWaitingOverlay(false);
        }
      } catch (err) {}
    }, 3000);

    return () => clearInterval(interval);
  }, [showAdminOverlay, blockedStageId, invitationCode]);

  /* ===================================================== */
  /* COMPUTED STATE (SAFE POSITION) */
  /* ===================================================== */

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

  /* ===================================================== */
  /* SAVE JUDGE */
  /* ===================================================== */

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

  /* ===================================================== */
  /* HANDLE PROCEED */
  /* ===================================================== */

  const handleProceed = async () => {
    if (!selectedCategory) return;

    const allFilled = validateScores(
      passedCandidates,
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
      confirmButtonColor: "#192BC2",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, Proceed",
    });

    if (!result.isConfirmed) return;

    const scoresToSubmit = [];
    const judgeId = eventData.judge.id;

    passedCandidates.forEach((candidate) => {
      normalizedCriteria.forEach((criterion) => {
        scoresToSubmit.push({
          candidate_id: candidate.id,
          judge_id: judgeId,
          criterion_id: criterion.id,
          score: scores[candidate.id]?.[criterion.id] ?? 0,
        });
      });
    });

    try {
      await submitScores(invitationCode, scoresToSubmit);

      setJustSubmitted(true); // 🔥 mark submission event
      setShowWaitingOverlay(true);

      showToast("success", "Scores submitted successfully");

      const statuses = await getCategoryJudgeStatuses(
        invitationCode,
        selectedCategory.id,
      );

      const filtered = statuses.filter((j) => j.id !== eventData.judge.id);

      setJudgeStatuses(filtered);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || err.message || "Failed to submit scores",
      );
    }
  };

  /* ===================================================== */
  /* MOVE CATEGORY */
  /* ===================================================== */

  const moveToNextCategory = async () => {
    const stages = [...eventData.event.stages].sort(
      (a, b) => a.sequence - b.sequence,
    );

    const categories =
      stages[stageIndex]?.categories?.sort((a, b) => a.sequence - b.sequence) ||
      [];

    // ✅ If still categories inside current stage → normal flow
    if (categoryIndex + 1 < categories.length) {
      setCategoryIndex(categoryIndex + 1);
      setScores({});
      setShowWaitingOverlay(false);
      setJustSubmitted(false);
      return;
    }

    // 🔥 We are about to move to next stage
    if (stageIndex + 1 < stages.length) {
      const currentStage = stages[stageIndex];

      try {
        const { ready } = await checkReadyForNextStage(
          invitationCode,
          currentStage.id,
        );

        if (!ready) {
          setShowWaitingOverlay(false);
          setBlockedStageId(currentStage.id);
          setShowAdminOverlay(true);
          return;
        }

        // ✅ Ready → move to next stage
        setShowAdminOverlay(false);
        setStageIndex(stageIndex + 1);
        setCategoryIndex(0);
        setScores({});
        setShowWaitingOverlay(false);
      } catch (err) {
        console.error("Stage readiness check failed:", err);
        setShowWaitingOverlay(true);
      }

      return;
    }

    // ✅ No more stages
    setIsFinished(true);
    setShowWaitingOverlay(false);
  };

  /* ===================================================== */
  /* NORMALIZE */
  /* ===================================================== */

  function normalizeCriteria(category) {
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
  }

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <FullScreenLoader show={loading} />

      <JudgeWaitingOverlay
        isOpen={showWaitingOverlay}
        judges={judgeStatuses}
        categoryName={selectedCategory?.name ?? ""}
      />

      <AdminDecisionOverlay isOpen={showAdminOverlay} />

      <JudgeModal
        isOpen={showJudgeModal}
        onClose={() => setShowJudgeModal(false)}
        onSave={handleJudgeSave}
        initialData={judgeInfo}
      />

      <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-40">
        <div className="flex justify-between items-center px-6 py-3">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-full bg-[#192BC2] text-white"
          >
            Exit
          </button>

          <h1 className="text-xl font-semibold">{eventData.event.title}</h1>

          <button
            onClick={() => setShowJudgeModal(true)}
            className="w-10 h-10 rounded-full bg-[#192BC2] text-white"
          >
            {judgeInfo?.name?.[0] ?? "J"}
          </button>
        </div>
      </div>

      <div className="pt-24 px-6">
        {!showJudgeModal && !isFinished && selectedCategory && (
          <div className="max-w-6xl mx-auto">
            <JudgeTable
              participants={passedCandidates}
              criteria={normalizedCriteria}
              categoryName={selectedCategory.name}
              categoryMaxScore={selectedCategory.maxScore}
              categoryPercentage={selectedCategory.percentage}
              scores={scores}
              setScores={setScores}
              categoryKey={`${stageIndex}-${categoryIndex}`}
            />

            <div className="flex justify-end mt-6">
              <button
                onClick={handleProceed}
                className="px-6 py-3 bg-[#192BC2] text-white rounded-xl"
              >
                Proceed
              </button>
            </div>
          </div>
        )}

        {isFinished && (
          <div className="text-center mt-60">
            <h2 className="text-5xl font-extrabold text-green-600 mb-4">
              Judging Completed 🎉
            </h2>
            <p className="text-xl text-gray-600">
              Thank you for submitting your scores.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default JudgePage;
