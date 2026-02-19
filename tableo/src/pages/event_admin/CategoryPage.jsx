import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, PlusCircle, Pencil } from "lucide-react";
import EditStageModal from "../../components/EditStageModal";
import SideNavigation from "../../components/SideNavigation";
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
<<<<<<< HEAD

=======
>>>>>>> main

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

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([
    { name: "", weight: "", maxScore: "" },
  ]);

  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [criteriaList, setCriteriaList] = useState([{ name: "", weight: "" }]);

  const [sexFilter, setSexFilter] = useState("ALL");

  const filteredCandidates = (
    sexFilter === "ALL"
      ? event?.candidates || []
      : (event?.candidates || []).filter(
        (c) => c.sex?.toLowerCase() === sexFilter.toLowerCase(),
      )
  ).sort((a, b) => {
    if (a.sequence == null && b.sequence != null) return 1;
    if (a.sequence != null && b.sequence == null) return -1;

    if (!a.sex && b.sex) return 1;
    if (a.sex && !b.sex) return -1;

    if (a.sequence != null && b.sequence != null)
      return a.sequence - b.sequence;

    return 0;
  });

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

      // 👉 Replace this with your actual API service if you have one
      // Example:
      // await updateStage(updatedStage.id, { name: updatedStage.name });

      // For now: update locally
      const updatedStages = event.stages.map((s) =>
        s.id === updatedStage.id ? { ...s, name: updatedStage.name } : s,
      );

      setEvent({ ...event, stages: updatedStages });
      setActiveStage(updatedStage.name);

      showToast("success", "Stage updated successfully");
    } catch (err) {
      showToast("error", "Failed to update stage");
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

        // Normalize judges so every judge has name, invitationCode, and suffix
        evt.judges = (evt.judges || []).map((j) => ({
          id: j.id,
          name: j.name,
          invitationCode: j.invitationCode || "", // default if null
          suffix: j.suffix || "", // default if null
          sequence: j.sequence || 0,
        }));

        setEvent(evt);

        if (evt.stages?.length) {
          setActiveStage(evt.stages[0].name);
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
                  className={`relative z-10 w-27.5 h-10 font-medium ${activeTopTab === tab ? "text-gray-600" : "text-white"
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
                        onClick={() => setActiveStage(stageObj.name)}
                        className={`pb-3 text-lg font-semibold transition ${activeStage === stageObj.name
                            ? "border-b-2 border-[#FA824C] text-[#FA824C]"
                            : "text-gray-400 hover:text-gray-600"
                          }`}
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
                      <th className="w-64 px-6 py-4 text-left"></th>
                      {event?.judges?.map((judge) => (
                        <th
                          key={judge.id}
                          className="px-6 py-4 text-center font-medium text-gray-600"
                        >
                          {judge.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((candidate) => (
                      <tr
                        key={candidate.id}
                        className="bg-gray-50 hover:bg-gray-100 transition rounded-xl"
                      >
                        <td className="px-6 py-4 font-medium text-gray-700 rounded-l-xl">
                          {candidate.name}
                        </td>
                        {event?.judges?.map((judge) => (
                          <td key={judge.id} className="px-6 py-3 text-center">
                            <div className="w-14 h-10 rounded-lg bg-gray-100 mx-auto" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTopTab === "Participants" && (
            <ViewOnlyTable
              title="Participants"
              data={filteredCandidates}
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
                displayInfo: `${j.invitationCode || ""} ${j.suffix || ""}`.trim(),
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
          onSave={handleUpdateStage}
        />
      </div>
    </>
  );
}

export default CategoryPage;
