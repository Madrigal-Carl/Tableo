import React, { useEffect, useState } from "react";
import SideNavigation from "../../components/SideNavigation";
import ViewOnlyTable from "../../components/ViewOnlyTable";
import { ChevronLeft, PlusCircle } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getEvent } from "../../services/event_service";
import { addCategoryToEvent, getCategoriesByEvent, editCategoriesByEvent } from "../../services/category_service";
import AddCategoryModal from "../../components/AddCategoryModal";
import CriteriaModal from "../../components/CriteriaModal";
import { showToast } from "../../utils/swal";

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
  const [activeTopTab, setActiveTopTab] = useState("Rounds");
  const [activeRound, setActiveRound] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryList, setCategoryList] = useState([{ name: "", weight: "", maxScore: "", categoryId: null }]);

  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [criteriaList, setCriteriaList] = useState([{ name: "", weight: "" }]);

  const tabs = ["Rounds", "Participants", "Judges"];

  // ============================
  // HELPERS
  // ============================
  const getStageIdByName = (stageName) =>
    event?.stages.find((s) => s.name === stageName)?.id;

  const resetCategoryForm = () => {
    setCategoryList([{ name: "", weight: "", maxScore: "", categoryId: null }]);
  };

  const handleStageChangeInModal = (newStageName) => {
    setActiveRound(newStageName);

    const stageCategories = categories
      .filter((c) => c.stages?.some((s) => s.name === newStageName))
      .map((c) => ({
        name: c.name,
        weight: c.percentage,
        maxScore: c.maxScore,
        categoryId: c.id,
      }));

    setCategoryList(
      stageCategories.length > 0
        ? stageCategories
        : [{ name: "", weight: "", maxScore: "", categoryId: null }]
    );
  };

  const handleOpenAddCategoryModal = () => {
    const stageCategories = categories
      .filter((c) => c.stages?.some((s) => s.name === activeRound))
      .map((c) => ({
        name: c.name,
        weight: c.percentage,
        maxScore: c.maxScore,
        categoryId: c.id,
      }));

    setCategoryList(
      stageCategories.length > 0
        ? stageCategories
        : [{ name: "", weight: "", maxScore: "", categoryId: null }]
    );
    setIsCategoryModalOpen(true);
  };

  const handleCriteriaChange = (index, field, value) => {
    const updated = [...criteriaList];
    updated[index][field] = value;
    setCriteriaList(updated);
  };

  const handleAddCriteriaRow = () => setCriteriaList([...criteriaList, { name: "", weight: "" }]);
  const handleRemoveCriteriaRow = (index) => setCriteriaList(criteriaList.filter((_, i) => i !== index));
  const handleConfirmCriteria = () => setIsCriteriaModalOpen(false);

  // ============================
  // FETCH CATEGORIES
  // ============================
  const fetchCategories = async () => {
    try {
      const res = await getCategoriesByEvent(eventId);
      const allCategories = res.data.categories || [];
      setCategories(allCategories);

      const roundCategories = allCategories.filter((c) =>
        c.stages?.some((s) => s.name === activeRound)
      );
      setSelectedCategory(roundCategories[0] || null);
    } catch (err) {
      console.error("Failed to fetch categories", err);
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
          setActiveRound(evt.stages[0].name);
        }

        await fetchCategories();
      } catch (err) {
        console.error("Failed to load event", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [event, eventId]);

  // ============================
  // UPDATE SELECTED CATEGORY WHEN ROUND CHANGES
  // ============================
  useEffect(() => {
    if (!categories.length) return;
    const roundCategories = categories.filter((c) =>
      c.stages?.some((s) => s.name === activeRound)
    );
    setSelectedCategory(roundCategories[0] || null);
  }, [activeRound, categories]);

  const filteredCategories = categories.filter((c) =>
    c.stages?.some((s) => s.name === activeRound)
  );

  // ============================
  // CATEGORY MODAL HANDLERS
  // ============================
  const handleCategoryChange = (index, field, value) => {
    const updated = [...categoryList];
    updated[index][field] = value;
    setCategoryList(updated);
  };

  const handleAddCategoryRow = () => {
    setCategoryList([...categoryList, { name: "", weight: "", maxScore: "", categoryId: null }]);
  };

  const handleRemoveCategoryRow = (index) => {
    setCategoryList(categoryList.filter((_, i) => i !== index));
  };

  const handleConfirmCategories = async () => {
    try {
      const validCategories = categoryList.filter((c) => c.name && c.weight && c.maxScore);

      if (!validCategories.length) {
        showToast("error", "Please add at least one valid category");
        return;
      }

      const stageId = getStageIdByName(activeRound);
      if (!stageId) {
        showToast("error", "Please select a valid round");
        return;
      }

      const newCategories = validCategories
        .filter((c) => !c.categoryId)
        .map((c) => ({
          name: c.name.trim(),
          percentage: Number(c.weight),
          maxScore: Number(c.maxScore),
          stage_id: stageId,
        }));

      const existingCategories = validCategories
        .filter((c) => c.categoryId)
        .map((c) => ({
          categoryId: c.categoryId,
          name: c.name.trim(),
          percentage: Number(c.weight),
          maxScore: Number(c.maxScore),
          stage_id: stageId,
        }));

      if (newCategories.length > 0) {
        await addCategoryToEvent(event.id, {
          stage_id: stageId,
          categories: newCategories,
        });
      }

      if (existingCategories.length > 0) {
        await editCategoriesByEvent(event.id, {
          categories: existingCategories,
        });
      }

      await fetchCategories();
      resetCategoryForm();
      setIsCategoryModalOpen(false);
      showToast("success", "Categories saved successfully");
    } catch (err) {
      console.error(err);
      showToast("error", err.response?.data?.message || "Failed to save categories");
    }
  };

  // ============================
  // GUARDS
  // ============================
  if (loading) return <div className="p-10">Loading event...</div>;
  if (!event) return <div className="p-10 text-red-500">Event not found</div>;

  const rounds = event.stages?.map((s) => s.name) || [];

  // ============================
  // RENDER
  // ============================
  return (
    <div className="flex h-screen bg-gray-100">
      <SideNavigation />

      <section className="flex-1 ml-72 p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="mt-5 mb-6 text-gray-700">
          <div className="flex items-center gap-3">
            <ChevronLeft
              size={30}
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer hover:text-gray-900"
            />
            <h1 className="text-4xl font-semibold text-[#FA824C]">{event.title}</h1>
          </div>
          <p className="text-sm text-gray-500 mt-2">{event.description}</p>
        </div>

        {/* TOP TABS */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex bg-[#FA824C] p-1 rounded-md">
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

          {activeTopTab === "Rounds" && (
            <button
              onClick={handleOpenAddCategoryModal}
              className="bg-[#FA824C] px-6 h-[50px] rounded-lg text-white font-medium hover:bg-orange-600"
            >
              + Add Category
            </button>
          )}
        </div>

        {/* ROUND TABS AND CATEGORY TABLE */}
        {activeTopTab === "Rounds" && (
          <>
            <div className="flex gap-8 border-b mb-8 pl-6">
              {rounds.map((round) => (
                <button
                  key={round}
                  onClick={() => setActiveRound(round)}
                  className={`pb-3 text-lg font-semibold transition ${activeRound === round
                      ? "border-b-2 border-[#FA824C] text-[#FA824C]"
                      : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {round}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-6 text-lg font-semibold">
              <PlusCircle
                className="text-[#FA824C] w-6 h-6 cursor-pointer"
                onClick={() => setIsCriteriaModalOpen(true)}
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
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm max-h-[520px] overflow-y-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead className="sticky top-0 bg-white z-10">
                  <tr>
                    <th className="w-64 px-6 py-4 text-left"></th>
                    {event.judges.map((judge) => (
                      <th key={judge.id} className="px-6 py-4 text-center font-medium text-gray-600">
                        {judge.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {event.candidates.map((candidate) => (
                    <tr key={candidate.id} className="bg-gray-50 hover:bg-gray-100 transition rounded-xl">
                      <td className="px-6 py-4 font-medium text-gray-700 rounded-l-xl">{candidate.name}</td>
                      {event.judges.map((judge) => (
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
            data={event.candidates || []}
            nameLabel="Name"
            fieldLabel="Sex"
            fieldKey="sex"
          />
        )}

        {activeTopTab === "Judges" && (
          <ViewOnlyTable
            title="Judges"
            data={event.judges || []}
            nameLabel="Name"
            fieldLabel="Suffix"
            fieldKey="suffix"
          />
        )}
      </section>

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        categoryList={categoryList}
        handleCategoryChange={handleCategoryChange}
        handleAddCategoryRow={handleAddCategoryRow}
        handleRemoveCategoryRow={handleRemoveCategoryRow}
        handleConfirmCategories={handleConfirmCategories}
        setIsCategoryModalOpen={setIsCategoryModalOpen}
        rounds={rounds}
        selectedRound={activeRound}
        setSelectedRound={handleStageChangeInModal}
      />

      <CriteriaModal
        isOpen={isCriteriaModalOpen}
        criteriaList={criteriaList}
        handleCriteriaChange={handleCriteriaChange}
        handleAddCriteriaRow={handleAddCriteriaRow}
        handleRemoveCriteriaRow={handleRemoveCriteriaRow}
        handleConfirmCriteria={handleConfirmCriteria}
        setIsCriteriaModalOpen={setIsCriteriaModalOpen}
      />
    </div>
  );
}

export default CategoryPage;
