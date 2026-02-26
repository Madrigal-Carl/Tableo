import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JudgeTable from "../../components/JudgeTable";
import JudgeModal from "../../components/JudgeModal";
import FullScreenLoader from "../../components/FullScreenLoader";
import Swal from "sweetalert2";

import { getEventForJudge, updateJudge } from "../../services/judge_service";
import {
  submitScores,
  checkCategoryCompleted,
  getCategoryJudgeStatuses,
} from "../../services/competition_score_service";
import { showToast } from "../../utils/swal";
import { validateJudgeData } from "../../validations/judge_validation";
import { validateScores } from "../../validations/judge_score_validation";
import JudgeWaitingOverlay from "../../components/JudgeWaitingOverlay";
import { getStageCandidates } from "../../services/stage_service";
function JudgePage() {
  const { invitationCode } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stageIndex, setStageIndex] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const [showJudgeModal, setShowJudgeModal] = useState(true);
  const [judgeInfo, setJudgeInfo] = useState(null);

  const [scores, setScores] = useState({});
  const [showWaitingOverlay, setShowWaitingOverlay] = useState(false);

  const [judgeStatuses, setJudgeStatuses] = useState([]);
  const [stageCandidates, setStageCandidates] = useState([]);
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

        // ✅ DO NOT auto select on refresh
        // Let backend control stage pointer
        // autoSelectCategory is intentionally removed
      } catch (err) {
        setError(err.message || "Failed to load judge data");
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [invitationCode, navigate]);
  /* ===================================================== */
  /* AUTO SELECT CATEGORY */
  /* ===================================================== */

  const autoSelectCategory = async (data) => {
    const sortedStages = [...data.event.stages].sort(
      (a, b) => a.sequence - b.sequence
    );

    for (let s = 0; s < sortedStages.length; s++) {
      const stage = sortedStages[s];
      const categories = (stage.categories || []).sort(
        (a, b) => a.sequence - b.sequence
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
  /* POLLING FOR JUDGE STATUS (FIXED STABLE VERSION) */
  /* ===================================================== */

  const isTransitioning = useRef(false);

  useEffect(() => {
    if (!eventData) return;

    const fetchStatuses = async () => {
      try {
        if (!eventData.event?.stages || !eventData.judge) return;

        const sortedStages = [...eventData.event.stages].sort(
          (a, b) => a.sequence - b.sequence
        );

        const currentStage = sortedStages[stageIndex];
        if (!currentStage) return;

        const currentCategories = (currentStage.categories || []).sort(
          (a, b) => a.sequence - b.sequence
        );

        const currentCategory = currentCategories[categoryIndex];
        if (!currentCategory) return;
        const isLastCategory =
          categoryIndex + 1 >= currentCategories.length;
        /* ===================================================== */
        /* GET JUDGE STATUS (MOVE THIS BEFORE USING `statuses`) */
        /* ===================================================== */

        const statuses = await getCategoryJudgeStatuses(
          invitationCode,
          currentCategory.id
        );
        console.log("Polling statuses:", statuses);
        console.log("My judge id:", eventData.judge.id);
        if (!statuses || statuses.length === 0) {
          setShowWaitingOverlay(false);
          return;
        }

        /* ===================================================== */
        /* REMOVE LOGGED IN JUDGE FROM OVERLAY LIST */
        /* ===================================================== */

        const otherJudges = statuses.filter(
          (j) => j.id !== eventData.judge.id
        );

        setJudgeStatuses(otherJudges);
        /* ===================================================== */
        /* STRICT OVERLAY + MOVE CONTROL */
        /* ===================================================== */

        const myStatus = statuses.find(
          (j) =>
            j.id === eventData.judge.id
        );

        const youSubmitted =
          myStatus?.status === "done" ||
          myStatus?.status === "submitted" ||
          myStatus?.status === "completed";


        const allDone =
          statuses.length > 0 &&
          statuses.every((j) => j.status === "done");

        // 🟢 CASE 1: You finished but others haven't → SHOW overlay
        if (youSubmitted && !allDone) {
          setShowWaitingOverlay(true);
          return; // 🚫 STOP here (no movement)
        }

        // 🟢 CASE 2: Everyone finished → MOVE
        if (allDone) {
          setShowWaitingOverlay(false);

          if (!isTransitioning.current) {
            isTransitioning.current = true;

            await moveToNextCategory();

            setTimeout(() => {
              isTransitioning.current = false;
            }, 100); // Small buffer to prevent rapid transitions
          }

          return;
        }

        // 🟢 CASE 3: You haven't submitted → no overlay
        setShowWaitingOverlay(false);
        /* ===================================================== */
        /* ADMIN RELEASE → MOVE TO NEXT STAGE */
        /* ===================================================== */

        if (
          eventData.event.stage_status === "released" &&
          isLastCategory &&
          stageIndex + 1 < sortedStages.length
        ) {
          setStageIndex(stageIndex + 1);
          setCategoryIndex(0);
          setScores({});
          setShowWaitingOverlay(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    // ✅ Immediate fetch
    fetchStatuses();

    const interval = setInterval(fetchStatuses, 3000);

    return () => clearInterval(interval);
  }, [stageIndex, categoryIndex, eventData]);
  /* ===================================================== */
  /* FETCH QUALIFIED CANDIDATES WHEN STAGE CHANGES */
  /* ===================================================== */

  useEffect(() => {
    const fetchCandidates = async () => {
      if (!eventData) return;

      const activeStage = [...eventData.event.stages]
        .sort((a, b) => a.sequence - b.sequence)[stageIndex];

      if (!activeStage) return;

      const currentCategories = (activeStage.categories || []).sort(
        (a, b) => a.sequence - b.sequence
      );

      const selectedCategory = currentCategories[categoryIndex];
      if (!selectedCategory) return;

      try {
        const res = await getStageCandidates(
          eventData.event.id,
          activeStage.id
        );

        setStageCandidates(res.data.data);
      } catch (err) {
        console.error("Failed to fetch stage candidates:", err);
      }
    };

    fetchCandidates();
  }, [stageIndex, categoryIndex, eventData]);
  /* ===================================================== */
  /* COMPUTED STATE (SAFE POSITION) */
  /* ===================================================== */

  if (error) return <p>{error}</p>;
  if (!eventData) return null;

  const activeStage = [...eventData.event.stages].sort(
    (a, b) => a.sequence - b.sequence
  )[stageIndex];
  if (!activeStage) return null;
  const currentCategories = (activeStage?.categories || []).sort(
    (a, b) => a.sequence - b.sequence
  );
  const selectedCategory = currentCategories[categoryIndex] ?? null;
  const normalizedCriteria = selectedCategory
    ? normalizeCriteria(selectedCategory)
    : [];

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
    // 🔒 Prevent double scoring (refresh safe)
    const statuses = await getCategoryJudgeStatuses(
      invitationCode,
      selectedCategory?.id
    );

    const myStatus = statuses.find(
      (j) => j.id === eventData.judge.id
    );

    if (myStatus?.status === "done") {
      setShowWaitingOverlay(true);
      return;
    }

    const allFilled = validateScores(
      stageCandidates,
      normalizedCriteria,
      scores
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

    stageCandidates.forEach((candidate) => {
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

      // 🔥 First fetch updated statuses
      const statuses = await getCategoryJudgeStatuses(
        invitationCode,
        selectedCategory.id
      );

      const filtered = statuses.filter(
        (j) => j.id !== eventData.judge.id
      );

      setJudgeStatuses(filtered);

      // 🔥 Force overlay to open BEFORE toast
      setShowWaitingOverlay(true);

      // ✅ Small delay to allow overlay to render
      setTimeout(() => {
        showToast("success", "Scores submitted successfully");
      }, 200);
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message ||
        err.message ||
        "Failed to submit scores"
      );
    }
  };

  /* ===================================================== */
  /* MOVE CATEGORY */
  /* ===================================================== */

  const moveToNextCategory = () => {
    setJudgeStatuses([]);
    setShowWaitingOverlay(false);

    const stages = [...eventData.event.stages].sort(
      (a, b) => a.sequence - b.sequence
    );

    const currentStage = stages[stageIndex];

    const categories = (currentStage?.categories || []).sort(
      (a, b) => a.sequence - b.sequence
    );

    // ✅ Move to next category
    if (categoryIndex + 1 < categories.length) {
      setCategoryIndex((prev) => prev + 1);
      setScores({});
      return;
    }

    // ✅ Move to next stage
    if (stageIndex + 1 < stages.length) {
      setStageIndex((prev) => prev + 1);
      setCategoryIndex(0);
      setScores({});
      return;
    }

    // ✅ Finished
    setIsFinished(true);
  };
  /* ===================================================== */
  /* NORMALIZE */
  /* ===================================================== */

  function normalizeCriteria(category) {
    if (!category?.criteria?.length) return [];

    const total = category.criteria.reduce(
      (sum, c) => sum + Number(c.percentage || 0),
      0
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

          <h1 className="text-xl font-semibold">
            {eventData.event.title}
          </h1>

          <button
            onClick={() => setShowJudgeModal(true)}
            className="w-10 h-10 rounded-full bg-[#192BC2] text-white"
          >
            {judgeInfo?.name?.[0] ?? "J"}
          </button>
        </div>
      </div>

      <div className="pt-24 px-6">
        {!showJudgeModal &&
          !isFinished &&
          activeStage &&
          currentCategories.length > 0 &&
          selectedCategory && (
            <div className="max-w-6xl mx-auto">
              <JudgeTable
                participants={stageCandidates}
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