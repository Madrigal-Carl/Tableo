import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ChevronLeft, PlusCircle } from "lucide-react";

import SideNavigation from "../../components/SideNavigation";
import ViewOnlyTable from "../../components/ViewOnlyTable";
import AddCategoryModal from "../../components/AddCategoryModal";
import CriteriaModal from "../../components/CriteriaModal";
import FullScreenLoader from "../../components/FullScreenLoader";
import { validateCategories } from "../../validations/category_validation";
import { showToast } from "../../utils/swal";

import { getEvent } from "../../services/event_service";
import {
  addCategoryToEvent,
  getCategoriesByStage,
} from "../../services/category_service";

function CategoryPage() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();

  // ============================
  // STATE
  // ============================
  const [event, setEvent] = useState(location.state?.event || null);
  const [loading, setLoading] = useState(!event);
  const [categories, setCategories] = useState([]);
  const [activeTopTab, setActiveTopTab] = useState("Stages");
  const [activeStage, setActiveStage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([{ name: "", weight: "", maxScore: "" }]);

  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [criteriaList, setCriteriaList] = useState([{ name: "", weight: "" }]);

  const tabs = ["Stages", "Participants", "Judges"];

  // ============================
  // HELPERS
  // ============================
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
      console.error("Failed to fetch categories for stage", err);
      showToast("error", "Failed to load categories for this stage");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // FETCH EVENT
  // ============================
  useEffect(() => {
    if (event) return;

    async function fetchEvent() {
      try {
        setLoading(true);
        const res = await getEvent(eventId);
        const evt = res.data;

        setEvent(evt);

        if (evt.stages?.length) {
          setActiveStage(evt.stages[0].name);
        }

        await fetchCategories(evt.stages?.[0]?.name);
      } catch (err) {
        console.error("Failed to load event", err);
        showToast("error", "Failed to load event");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [event, eventId]);

  // ============================
  // UPDATE SELECTED CATEGORY WHEN STAGE CHANGES
  // ============================
  useEffect(() => {
    if (!activeStage) return;
    fetchCategories(activeStage);
  }, [activeStage, eventId]);

  // ============================
  // CATEGORY MODAL HANDLERS
  // ============================
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
    const errors = validateCategories(categoryList);

    if (errors.length > 0) {
      const firstError = errors
        .map(row => Object.values(row)[0])
        .find(Boolean);
      showToast("error", firstError);
      return;
    }

    try {
      const stageId = getStageIdByName(activeStage);
      if (!stageId) {
        showToast("error", "Please select a valid stage");
        return;
      }

      setLoading(true);

      // Connect to backend createOrUpdate API
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
      showToast(
        "error",
        err.message || "Failed to add categories"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // STAGES & FILTERED CATEGORIES
  // ============================
  const stages = event?.stages?.map((s) => s.name) || [];
  const filteredCategories = categories;

  // ============================
  // RENDER
  // ============================
  // Early return is no longer needed; just reuse FullScreenLoader
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
                  onClick={() => navigate("/dashboard")}
                  className="cursor-pointer hover:text-gray-900"
                />
                <h1 className="text-4xl font-semibold text-[#FA824C]">{event?.title}</h1>
              </div>
              <p className="text-sm text-gray-500 mt-2">{event?.description}</p>
            </div>


            <div className="relative flex bg-[#FA824C] p-1 rounded-md w-fit">
              <div
                className="absolute top-1 left-1 h-[40px] bg-white rounded-sm transition-transform"
                style={{
                  width: "110px",
                  transform: `translateX(${tabs.indexOf(activeTopTab) * 110}px)`,
                }}
              />
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTopTab(tab)}
                  className={`relative z-10 w-[110px] h-[40px] font-medium ${activeTopTab === tab ? "text-gray-600" : "text-white"
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
                {stages.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => setActiveStage(stage)}
                    className={`pb-3 text-lg font-semibold transition ${activeStage === stage
                      ? "border-b-2 border-[#FA824C] text-[#FA824C]"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>

              {/* CATEGORY SELECT */}
              <div className="flex items-center justify-between gap-4 mb-6 text-lg font-semibold">
                <div className="flex items-center">
                  <PlusCircle
                    className="text-[#FA824C] w-6 h-6 cursor-pointer"
                    onClick={() => {
                      resetCategoryForm();
                      setIsCategoryModalOpen(true);
                    }}
                  />
                  <select
                    className="px-4 py-2"
                    value={selectedCategory?.id || ""}
                    onChange={(e) => {
                      const selectedId = parseInt(e.target.value);
                      const cat = filteredCategories.find((c) => c.id === selectedId);
                      setSelectedCategory(cat || null);
                    }}
                  >
                    <option value="" disabled>Select a Stage</option>
                    {filteredCategories.map((cat) => (
                      <option key={cat.id} value={cat.id} title={cat.name}>
                        {cat.name.length > 30 ? cat.name.slice(0, 30) + "…" : cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setIsCriteriaModalOpen(true);
                  }}
                  className="bg-[#FA824C] px-6 h-[50px] rounded-lg text-white font-medium hover:bg-orange-600"
                >
                  + Add Category
                </button>
              </div>

              {/* JUDGING GRID */}
              <div className="overflow-x-auto bg-white rounded-2xl shadow-sm max-h-[520px] overflow-y-auto">
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
                    {event?.candidates?.map((candidate) => (
                      <tr
                        key={candidate.id}
                        className="bg-gray-50 hover:bg-gray-100 transition rounded-xl"
                      >
                        <td className="px-6 py-4 font-medium text-gray-700 rounded-l-xl">
                          {candidate.name}
                        </td>
                        {event?.judges?.map((judge) => (
                          <td key={judge.id} className="px-6 py-3 text-center">
                            <div className="w-14 h-10 rounded-lg border border-gray-300 bg-gray-100 mx-auto" />
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
              data={event?.candidates || []}
              nameLabel="Name"
              fieldLabel="Sex"
              fieldKey="sex"
            />
          )}

          {activeTopTab === "Judges" && (
            <ViewOnlyTable
              title="Judges"
              data={event?.judges || []}
              nameLabel="Name"
              fieldLabel="Suffix"
              fieldKey="suffix"
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
          handleConfirmCriteria={() => setIsCriteriaModalOpen(false)}
          setIsCriteriaModalOpen={setIsCriteriaModalOpen}
          setIsCategoryModalOpen={setIsCategoryModalOpen}
        />
      </div>
    </>
  );
}

export default CategoryPage;
