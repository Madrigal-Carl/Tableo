import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, PlusCircle, Pencil } from "lucide-react";
import EditStageModal from "../../components/EditStageModal";
import SideNavigation from "../../components/SideNavigation";
import NextStageModal from "../../components/NextStageModal";
import ViewOnlyTable from "../../components/ViewOnlyTable";
import AddCategoryModal from "../../components/AddCategoryModal";
import CriteriaModal from "../../components/CriteriaModal";
import FullScreenLoader from "../../components/FullScreenLoader";
import { validateCategories } from "../../validations/category_validation";
import { showToast } from "../../utils/swal";
import {
  addCriteria,
  getCriteriaByCategory,
} from "../../services/criterion_service";
import { validateCriteria } from "../../validations/criterion_validation";
import { isEventEditable } from "../../utils/eventEditable";
import { getEvent } from "../../services/event_service";
import { deleteJudge } from "../../services/judge_service";
import {
  addCategoryToEvent,
  getCategoriesByStage,
} from "../../services/category_service";
import {
  createOrUpdateCandidates,
  deleteCandidate,
  editCandidate,
} from "../../services/candidate_service";
import Swal from "sweetalert2";
import { createOrUpdate as createOrUpdateJudges } from "../../services/judge_service";
import {
  updateStage,
  getStageResults,
  advanceStageCandidates,
  getActiveStage,
  getStageOverallResult,
} from "../../services/stage_service";
import { ArrowRight } from "lucide-react";

function CategoryPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();

  // ============================
  // STATE
  // ============================
  const [event, setEvent] = useState(location.state?.event || null);
  const canEditEvent = event ? isEventEditable(event) : false;
  const [loading, setLoading] = useState(!event);
  const [categories, setCategories] = useState([]);
  const [activeTopTab, setActiveTopTab] = useState("Stages");
  const [activeStage, setActiveStage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditStageModalOpen, setIsEditStageModalOpen] = useState(false);
  const [selectedStageObj, setSelectedStageObj] = useState(null);
  const [isNextStageModalOpen, setIsNextStageModalOpen] = useState(false);
  const [advanceQueue, setAdvanceQueue] = useState([]);
  const [currentAdvanceIndex, setCurrentAdvanceIndex] = useState(0);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([
    { name: "", weight: "", maxScore: "" },
  ]);

  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [criteriaList, setCriteriaList] = useState([{ name: "", weight: "" }]);

  const [sexFilter, setSexFilter] = useState("ALL");

  const [advanceCounts, setAdvanceCounts] = useState({
    maleCount: null,
    femaleCount: null,
  });

  const [stageResults, setStageResults] = useState({});

  const participantsData = event?.candidates || [];

  useEffect(() => {
    async function fetchResults() {
      if (!activeStage) return;

      const stageId = getStageIdByName(activeStage);
      if (!stageId) return;

      try {
        const res = await getStageResults(stageId);
        setStageResults(res.data.data || {});
      } catch (err) {
        console.error(err);
        setStageResults({});
      }
    }

    fetchResults();
  }, [activeStage, event]);

  const rankedCandidates = React.useMemo(() => {
    if (!selectedCategory || !stageResults) return [];

    const categoryName = selectedCategory.name;

    const categoryData = stageResults[categoryName];
    if (!categoryData) return [];

    let combined = [
      ...(categoryData.males || []),
      ...(categoryData.females || []),
    ];

    if (sexFilter !== "ALL") {
      combined = combined.filter(
        (c) => c.sex?.toLowerCase() === sexFilter.toLowerCase(),
      );
    }

    return combined;
  }, [stageResults, selectedCategory, sexFilter]);

  const tabs = ["Stages", "Participants", "Judges"];

  const handleEditParticipant = async (updated) => {
    try {
      setLoading(true);

      const { id, formData, isFile, ...rest } = updated;

      if (isFile && formData) {
        await editCandidate(id, formData, true);
      } else {
        await editCandidate(id, rest);
      }

      const eventRes = await getEvent(eventId);
      setEvent(eventRes.data);

      showToast("success", "Participant updated successfully");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteParticipant = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to delete ${item.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      await deleteCandidate(item.id);

      const res = await getEvent(eventId);
      setEvent(res.data);

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Participant has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddParticipant = async () => {
    try {
      setLoading(true);

      await createOrUpdateCandidates(eventId);

      const res = await getEvent(eventId);
      setEvent(res.data);

      showToast("success", "Participant added successfully");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditJudge = (updated) => {
    console.log("Edit judge:", updated);
  };

  const handleDeleteJudge = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to delete ${item.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      await deleteJudge(item.id);

      const res = await getEvent(eventId);
      setEvent(res.data);

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Judge has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStageIdByName = (stageName) =>
    event?.stages.find((s) => s.name === stageName)?.id;

  const resetCategoryForm = () => {
    setCategoryList([{ name: "", weight: "", maxScore: "" }]);
  };

  const fetchCategories = async (stageName = activeStage) => {
    try {
      const stageId = getStageIdByName(stageName);
      if (!stageId) return;

      setLoading(true); // Show loader while fetching categories
      const res = await getCategoriesByStage(eventId, stageId);
      const stageCategories = res.data.categories || [];

      setCategories(stageCategories);
      setSelectedCategory(stageCategories[0] || null);
    } catch (err) {
      showToast("error", "Failed to load categories for this stage");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStage = async (updatedStage) => {
    try {
      setLoading(true);

      // 🔥 Call backend to update BOTH name and sequence
      await updateStage(updatedStage.id, {
        name: updatedStage.name,
        sequence: updatedStage.sequence,
      });

      // 🔥 Refetch full event so ordering is correct
      const res = await getEvent(eventId);
      setEvent(res.data);

      // Set active stage to updated name
      setActiveStage(updatedStage.name);

      showToast("success", "Stage updated successfully");
    } catch (err) {
      showToast("error", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (event) return;

    async function fetchEvent() {
      try {
        setLoading(true);

        const res = await getEvent(eventId);
        const evt = res.data;

        evt.judges = (evt.judges || []).map((j) => ({
          id: j.id,
          name: j.name,
          invitationCode: j.invitationCode || "",
          suffix: j.suffix || "",
          sequence: j.sequence || 0,
        }));

        setEvent(evt);

        // ⭐ Get active stage from backend (IMPORTANT)
        try {
          const activeRes = await getActiveStage(eventId);

          const activeStageName = activeRes.data?.data?.name;

          if (activeStageName) {
            setActiveStage(activeStageName);
          } else if (evt.stages?.length) {
            // fallback safety
            const sorted = evt.stages
              .slice()
              .sort((a, b) => a.sequence - b.sequence);

            setActiveStage(sorted[0]?.name || "");
          }
        } catch (err) {
          console.error("Active stage fetch failed:", err);

          if (evt.stages?.length) {
            const sorted = evt.stages
              .slice()
              .sort((a, b) => a.sequence - b.sequence);

            setActiveStage(sorted[0]?.name || "");
          }
        }

        await fetchCategories(evt.stages?.[0]?.name);
      } catch (err) {
        showToast("error", "Failed to load event");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [event, eventId]);

  useEffect(() => {
    if (!activeStage) return;
    fetchCategories(activeStage);
  }, [activeStage, eventId]);

  const handleCategoryChange = (index, field, value) => {
    const updated = [...categoryList];
    updated[index][field] = value;
    setCategoryList(updated);
  };

  const handleAddCategoryRow = () => {
    setCategoryList([...categoryList, { name: "", weight: "", maxScore: "" }]);
  };

  const handleRemoveCategoryRow = (index) => {
    setCategoryList(categoryList.filter((_, i) => i !== index));
  };

  const handleConfirmCategories = async () => {
    const error = validateCategories(categoryList);
    if (error) {
      showToast("error", error);
      return;
    }

    try {
      const stageId = getStageIdByName(activeStage);
      if (!stageId) {
        showToast("error", "Please select a valid stage");
        return;
      }

      setLoading(true);

      await addCategoryToEvent(eventId, {
        stage_id: stageId,
        categories: categoryList.map((c) => ({
          name: c.name.trim(),
          percentage: Number(c.weight),
          maxScore: Number(c.maxScore),
        })),
      });

      await fetchCategories(activeStage);
      resetCategoryForm();
      setIsCategoryModalOpen(false);

      showToast("success", "Categories added successfully");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCriteria = async () => {
    if (!selectedCategory) {
      showToast("error", "Please select a category first");
      return;
    }

    const errorMessage = validateCriteria(criteriaList);
    if (errorMessage) {
      showToast("error", errorMessage);
      return;
    }

    try {
      setLoading(true);

      const payload = criteriaList.map((c) => ({
        label: c.name.trim(),
        percentage: Number(c.weight),
      }));

      await addCriteria(selectedCategory.id, { criteria: payload });

      showToast("success", "Criteria saved successfully");

      setCriteriaList([{ name: "", weight: "" }]);
      setIsCriteriaModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const stages =
    event?.stages
      ?.slice()
      .sort((a, b) => a.sequence - b.sequence)
      .map((s) => s.name) || [];
  const filteredCategories = categories;

  return (
    <>
      {/* Loader */}
      <FullScreenLoader show={loading} />

      <div className="flex h-screen bg-gray-100">
        <SideNavigation />

        <section className="flex-1 ml-72 p-8 overflow-y-auto">
          {/* HEADER */}
          <div className="mt-5 mb-6 text-gray-700 flex items-center justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <ChevronLeft
                  size={30}
                  onClick={() => navigate("/events")}
                  className="cursor-pointer hover:text-gray-900"
                />
                <h1 className="text-4xl font-semibold text-[#FA824C]">
                  {event?.title}
                </h1>
              </div>
              <p className="text-sm text-gray-500 mt-2">{event?.description}</p>
            </div>

            <div className="relative flex bg-[#FA824C] p-1 rounded-md w-fit">
              <div
                className="absolute top-1 left-1 h-10 bg-white rounded-sm transition-transform"
                style={{
                  width: "110px",
                  transform: `translateX(${tabs.indexOf(activeTopTab) * 110}px)`,
                }}
              />
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTopTab(tab)}
                  className={`relative z-10 w-27.5 h-10 font-medium ${
                    activeTopTab === tab ? "text-gray-600" : "text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* STAGE TABS */}
          {activeTopTab === "Stages" && (
            <>
              <div className="flex gap-8 border-b mb-8 pl-6">
                {event?.stages
                  ?.slice()
                  .sort((a, b) => a.sequence - b.sequence)
                  .map((stageObj) => (
                    <div
                      key={stageObj.id}
                      className="flex items-center gap-2 group"
                    >
                      <button
                        onClick={() => {
                          if (!canEditEvent) return;
                          setActiveStage(stageObj.name);
                        }}
                        className={`pb-3 text-lg font-semibold transition ${
                          activeStage === stageObj.name
                            ? "border-b-2 border-[#FA824C] text-[#FA824C]"
                            : "text-gray-400 hover:text-gray-600"
                        } ${!canEditEvent ? "cursor-not-allowed" : ""}`}
                      >
                        {stageObj.name}
                      </button>

                      {canEditEvent && (
                        <Pencil
                          size={16}
                          className="cursor-pointer text-gray-400 hover:text-[#FA824C] transition"
                          onClick={() => {
                            setSelectedStageObj(stageObj);
                            setIsEditStageModalOpen(true);
                          }}
                        />
                      )}
                    </div>
                  ))}
              </div>

              {/* CATEGORY SELECT */}
              <div className="flex items-center justify-between gap-4 mb-6 text-lg font-semibold">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="categoryFilter"
                      className="font-medium text-gray-700"
                    >
                      Category:
                    </label>
                    <select
                      id="categoryFilter"
                      className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                      value={selectedCategory?.id || ""}
                      onChange={(e) => {
                        const selectedId = parseInt(e.target.value);
                        const cat = filteredCategories.find(
                          (c) => c.id === selectedId,
                        );
                        setSelectedCategory(cat || null);
                      }}
                    >
                      <option value="" disabled>
                        Select a Category
                      </option>
                      {filteredCategories.map((cat) => (
                        <option key={cat.id} value={cat.id} title={cat.name}>
                          {cat.name.length > 30
                            ? cat.name
                                .slice(0, 30)
                                .replace(/\b\w/g, (l) => l.toUpperCase()) + "…"
                            : cat.name.replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Criteria Button */}
                  <button
                    onClick={async () => {
                      if (!canEditEvent) return; // Prevent opening
                      if (!selectedCategory) {
                        showToast("error", "Please select a category first");
                        return;
                      }

                      try {
                        setLoading(true);
                        const res = await getCriteriaByCategory(
                          selectedCategory.id,
                        );
                        const criteria = res.data.data || [];
                        setCriteriaList(
                          criteria.length > 0
                            ? criteria.map((c) => ({
                                name: c.label,
                                weight: c.percentage,
                              }))
                            : [{ name: "", weight: "" }],
                        );
                        setIsCriteriaModalOpen(true);
                      } catch (err) {
                        console.error(err);
                        showToast(
                          "error",
                          "Failed to load criteria for this category",
                        );
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={!canEditEvent}
                    className={`bg-[#FA824C] px-6 h-12.5 rounded-lg text-white font-medium 
    ${canEditEvent ? "hover:bg-orange-600" : "opacity-50 cursor-not-allowed"}`}
                  >
                    Criteria
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-gray-600 font-medium">
                    Filter by Sex:
                  </label>
                  <select
                    value={sexFilter}
                    onChange={(e) => setSexFilter(e.target.value)}
                    className="px-4 py-2 rounded-md focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="ALL">All</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>

                {/* Category Button */}
                <button
                  onClick={() => {
                    if (!canEditEvent) return;
                    resetCategoryForm();
                    setIsCategoryModalOpen(true);
                  }}
                  disabled={!canEditEvent}
                  className={`bg-[#FA824C] px-6 h-12.5 rounded-lg text-white font-medium 
    ${canEditEvent ? "hover:bg-orange-600" : "opacity-50 cursor-not-allowed"}`}
                >
                  Category
                </button>
              </div>

              {/* JUDGING GRID */}
              <div className="overflow-x-auto bg-white rounded-2xl shadow-sm max-h-130 overflow-y-auto">
                <table className="min-w-full border-separate border-spacing-y-2">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr>
                      {/* 🔢 NO. COLUMN */}
                      <th className="w-20 px-6 py-4 text-center font-semibold text-[#FA824C]">
                        No.
                      </th>

                      {/* Candidate Name */}
                      <th className="w-64 px-6 py-4 text-left font-semibold text-[#FA824C]">
                        Candidate Name
                      </th>

                      {/* Judges */}
                      {event?.judges?.map((judge) => (
                        <th
                          key={judge.id}
                          className="px-6 py-4 text-center font-medium text-gray-600"
                        >
                          {judge.name}
                        </th>
                      ))}

                      <th className="px-6 py-4 text-center font-semibold text-[#FA824C]">
                        Total
                      </th>
                      <th className="px-6 py-4 text-center font-semibold text-[#FA824C]">
                        Ranking
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedCandidates.map((candidate) => {
                      return (
                        <tr
                          key={candidate.candidate_id}
                          className="bg-gray-50 hover:bg-gray-100 transition rounded-xl"
                        >
                          {/* 🔢 NO. */}
                          <td className="px-6 py-4 text-center font-semibold text-gray-700">
                            {candidate.sequence ?? ""}
                          </td>

                          {/* Candidate Name with Image */}
                          <td className="px-6 py-4 font-medium text-gray-700">
                            <div className="flex items-center gap-3">
                              {candidate.path ? (
                                <img
                                  src={`${import.meta.env.VITE_ASSET_URL}${candidate.path}`}
                                  alt={candidate.name}
                                  className="w-10 h-10 object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                  N/A
                                </div>
                              )}

                              <span>{candidate.name}</span>
                            </div>
                          </td>

                          {/* Judges */}
                          {event?.judges?.map((judge) => {
                            const judgeData = candidate.judge_scores?.find(
                              (j) => j.judge_id === judge.id,
                            );

                            const score = judgeData?.score ?? null;

                            return (
                              <td
                                key={judge.id}
                                className="px-4 py-3 text-center"
                              >
                                {score !== null ? (
                                  <div className="w-14 h-10 rounded-lg bg-orange-100 flex items-center justify-center font-semibold text-gray-700 mx-auto">
                                    {Number(score).toFixed(2)}
                                  </div>
                                ) : (
                                  <div className="w-14 h-10 rounded-lg bg-gray-100 mx-auto" />
                                )}
                              </td>
                            );
                          })}

                          {/* TOTAL */}
                          <td className="px-6 py-3 text-center font-semibold text-gray-700">
                            {candidate.total_average?.toFixed(2)}
                          </td>

                          {/* RANK */}
                          <td className="px-6 py-3 text-center font-semibold text-[#FA824C]">
                            {candidate.rank ?? ""}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {!canEditEvent && (
                <button
                  className="bg-[#FA824C] px-6 h-12.5 rounded-lg text-white font-medium hover:bg-orange-600 mt-6 ml-auto flex items-center gap-2 cursor-pointer"
                  onClick={async () => {
                    if (!activeStage) return;

                    const stageId = getStageIdByName(activeStage);
                    if (!stageId) return;

                    try {
                      setLoading(true);

                      const res = await getStageOverallResult(stageId); // 🔥 new API
                      const data = res.data.data;

                      const maleContestants = (data.males || []).map((c) => ({
                        ...c,
                        average: c.stage_total, // 🔹 use stage_total
                        rank: c.rank,
                        sex: "Male",
                      }));

                      const femaleContestants = (data.females || []).map(
                        (c) => ({
                          ...c,
                          average: c.stage_total, // 🔹 use stage_total
                          rank: c.rank,
                          sex: "Female",
                        }),
                      );

                      const queue = [];

                      if (maleContestants.length)
                        queue.push({
                          sex: "Male",
                          contestants: maleContestants,
                        });

                      if (femaleContestants.length)
                        queue.push({
                          sex: "Female",
                          contestants: femaleContestants,
                        });

                      setAdvanceQueue(queue);
                      setCurrentAdvanceIndex(0);
                      setIsNextStageModalOpen(true);
                    } catch (err) {
                      showToast("error", err.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Proceed
                  <ArrowRight size={24} />
                </button>
              )}
            </>
          )}

          {activeTopTab === "Participants" && (
            <ViewOnlyTable
              title="Participants"
              data={participantsData}
              nameLabel="Participant Name"
              fieldLabel="Sex"
              fieldKey="sex"
              editable
              canEdit={canEditEvent}
              onEdit={handleEditParticipant}
              onDelete={handleDeleteParticipant}
              onAdd={handleAddParticipant}
            />
          )}

          {activeTopTab === "Judges" && (
            <ViewOnlyTable
              title="Judges"
              data={(event?.judges || []).map((j) => ({
                id: j.id,
                name: j.name,
                invitationCode: j.invitationCode || "",
                suffix: j.suffix || "",
                displayInfo:
                  `${j.invitationCode || ""} ${j.suffix || ""}`.trim(),
              }))}
              nameLabel="Judge Name"
              fieldLabel="Info"
              fieldKey="displayInfo"
              editable
              canEdit={canEditEvent}
              isJudge={true}
              onEdit={handleEditJudge}
              onDelete={handleDeleteJudge}
              // CategoryPage.jsx
              onAdd={async () => {
                if (!canEditEvent) return;

                try {
                  setLoading(true);
                  const newCount = Number((event?.judges || []).length + 1);
                  await createOrUpdateJudges(eventId, newCount); // pass number directly
                  const res = await getEvent(eventId);
                  setEvent(res.data);
                  showToast("success", "Judge added successfully");
                } catch (err) {
                  console.error(err);
                  showToast("error", err.message);
                } finally {
                  setLoading(false);
                }
              }}
            />
          )}
        </section>

        {/* CATEGORY MODAL */}
        <AddCategoryModal
          isOpen={isCategoryModalOpen}
          categoryList={categoryList}
          setCategoryList={setCategoryList}
          handleCategoryChange={handleCategoryChange}
          handleAddCategoryRow={handleAddCategoryRow}
          handleRemoveCategoryRow={handleRemoveCategoryRow}
          handleConfirmCategories={handleConfirmCategories}
          setIsCategoryModalOpen={setIsCategoryModalOpen}
          selectedStage={activeStage}
          eventId={eventId}
          eventStages={event?.stages || []}
        />

        {/* CRITERIA MODAL */}
        <CriteriaModal
          isOpen={isCriteriaModalOpen}
          criteriaList={criteriaList}
          handleCriteriaChange={(i, f, v) => {
            const updated = [...criteriaList];
            updated[i][f] = v;
            setCriteriaList(updated);
          }}
          handleAddCriteriaRow={() =>
            setCriteriaList([...criteriaList, { name: "", weight: "" }])
          }
          handleRemoveCriteriaRow={(i) =>
            setCriteriaList(criteriaList.filter((_, idx) => idx !== i))
          }
          handleConfirmCriteria={handleConfirmCriteria}
          setIsCriteriaModalOpen={setIsCriteriaModalOpen}
        />

        <EditStageModal
          isOpen={isEditStageModalOpen}
          setIsOpen={setIsEditStageModalOpen}
          currentStage={selectedStageObj}
          stages={event?.stages || []} // ✅ ADD THIS
          onSave={handleUpdateStage}
        />

        <NextStageModal
          isOpen={isNextStageModalOpen}
          onClose={() => {
            setIsNextStageModalOpen(false);
            setAdvanceCounts({ maleCount: null, femaleCount: null });
          }}
          contestants={advanceQueue[currentAdvanceIndex]?.contestants || []}
          roundTitle={`${activeStage} - ${
            advanceQueue[currentAdvanceIndex]?.sex || ""
          }`}
          onProceed={async (advanceCount) => {
            const sex = advanceQueue[currentAdvanceIndex]?.sex;

            if (!advanceCount || Number(advanceCount) <= 0) {
              showToast("error", "Please enter a valid number");
              return;
            }

            // 🔹 Store count but DO NOT call backend yet
            if (sex === "Male") {
              setAdvanceCounts((prev) => ({
                ...prev,
                maleCount: Number(advanceCount),
              }));
            }

            if (sex === "Female") {
              setAdvanceCounts((prev) => ({
                ...prev,
                femaleCount: Number(advanceCount),
              }));
            }

            const nextIndex = currentAdvanceIndex + 1;

            // 🔹 If there's another modal (Female after Male)
            if (nextIndex < advanceQueue.length) {
              setCurrentAdvanceIndex(nextIndex);
              return;
            }

            // 🔥 BOTH inputs are done → now call backend
            try {
              setLoading(true);

              const stageId = getStageIdByName(activeStage);

              const payload = {
                maleCount:
                  sex === "Male"
                    ? Number(advanceCount)
                    : advanceCounts.maleCount,
                femaleCount:
                  sex === "Female"
                    ? Number(advanceCount)
                    : advanceCounts.femaleCount,
              };

              await advanceStageCandidates(stageId, payload);

              // 🔥 Refetch full event
              const res = await getEvent(eventId);
              const updatedEvent = res.data;
              setEvent(updatedEvent);

              // 🔥 Determine next stage by sequence
              const sortedStages = updatedEvent.stages
                .slice()
                .sort((a, b) => a.sequence - b.sequence);

              const currentIndex = sortedStages.findIndex(
                (s) => s.id === stageId,
              );

              const nextStage = sortedStages[currentIndex + 1];

              if (nextStage) {
                setActiveStage(nextStage.name);
              }

              showToast("success", "Candidates advanced successfully");

              // Reset modal state
              setIsNextStageModalOpen(false);
              setAdvanceQueue([]);
              setCurrentAdvanceIndex(0);
              setAdvanceCounts({ maleCount: null, femaleCount: null });
            } catch (err) {
              showToast("error", err.response?.data?.message || err.message);
            } finally {
              setLoading(false);
            }
          }}
        />
      </div>
    </>
  );
}

export default CategoryPage;
