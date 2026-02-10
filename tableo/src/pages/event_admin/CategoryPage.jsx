import React, { useEffect, useState } from "react";
import CategoryCard from "../../components/CategoryCard";
import SideNavigation from "../../components/SideNavigation";
import ViewOnlyTable from "../../components/ViewOnlyTable";
import { ChevronLeft, PlusCircle } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getEvent } from "../../services/event_service";
import {
  addCategoryToEvent,
  getCategoriesByEvent,
} from "../../services/category_service";
import CriteriaModal from "../../components/CriteriaModal";

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
  const [categoryName, setCategoryName] = useState("");
  const [categoryWeight, setCategoryWeight] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [selectedRound, setSelectedRound] = useState("");

  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);
  const [criteriaList, setCriteriaList] = useState([
    { name: "", weight: "" },
  ]);

  const tabs = ["Rounds", "Participants", "Judges"];

  // ============================
  // HELPERS
  // ============================
  const getStageIdByName = (stageName) =>
    event?.stages.find((s) => s.name === stageName)?.id;

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategoryWeight("");
    setMaxScore("");
    setSelectedRound(event?.stages?.[0]?.name || "");
    setCriteriaList([{ name: "", weight: "" }]);
  };

  const handleCriteriaChange = (index, field, value) => {
    const updated = [...criteriaList];
    updated[index][field] = value;
    setCriteriaList(updated);
  };

  const handleAddCriteriaRow = () => {
    setCriteriaList([...criteriaList, { name: "", weight: "" }]);
  };

  const handleRemoveCriteriaRow = (index) => {
    setCriteriaList(criteriaList.filter((_, i) => i !== index));
  };

  const handleConfirmCriteria = () => {
    console.log("Criteria confirmed", criteriaList);
    setIsCriteriaModalOpen(false);
  };

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
          setSelectedRound(evt.stages[0].name);
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

  // ============================
  // GUARDS
  // ============================
  if (loading) return <div className="p-10">Loading event...</div>;
  if (!event) return <div className="p-10 text-red-500">Event not found</div>;

  // ============================
  // ROUNDS
  // ============================
  const rounds = event.stages?.map((s) => s.name) || [];

  // ============================
  // FILTER CATEGORIES
  // ============================
  const filteredCategories = categories.filter((c) =>
    c.stages?.some((s) => s.name === activeRound)
  );

  // ============================
  // ADD CATEGORY
  // ============================
  const handleAddCategory = async () => {
    if (!categoryName.trim() || !categoryWeight || !maxScore || !selectedRound)
      return;

    const stageId = getStageIdByName(selectedRound);
    if (!stageId) {
      alert("Invalid round selected");
      return;
    }

    try {
      const payload = {
        name: categoryName.trim(),
        percentage: Number(categoryWeight),
        maxScore: Number(maxScore),
        stage_id: stageId,
      };

      await addCategoryToEvent(event.id, payload);
      await fetchCategories();
      setActiveRound(selectedRound);
      resetCategoryForm();

      // Show criteria modal automatically after creating a category
      setIsCategoryModalOpen(false);
      setIsCriteriaModalOpen(true);
    } catch (err) {
      console.error("Failed to create category", err);
      alert(err.response?.data?.message || "Failed to create category");
    }
  };

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
            <h1 className="text-4xl font-semibold">{event.title}</h1>
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
              onClick={() => {
                resetCategoryForm();
                setIsCategoryModalOpen(true);
              }}
              className="bg-[#FA824C] px-6 h-[50px] rounded-lg text-white font-medium hover:bg-orange-600"
            >
              + Add Category
            </button>
          )}
        </div>

        {/* ROUNDS */}
        {activeTopTab === "Rounds" && (
          <>
            {/* ROUND TABS */}
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

            {/* CATEGORY SELECT DROPDOWN */}
            <div className="flex items-center gap-4 mb-6 text-lg font-semibold">
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
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* JUDGING GRID */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-sm max-h-[520px] overflow-y-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead className="sticky top-0 bg-white z-10">
                  <tr>
                    <th className="w-64 px-6 py-4 text-left"></th>
                    {event.judges.map((judge) => (
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
                  {event.candidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="bg-gray-50 hover:bg-gray-100 transition rounded-xl"
                    >
                      <td className="px-6 py-4 font-medium text-gray-700 rounded-l-xl">
                        {candidate.name}
                      </td>
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

      {/* CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-center text-xl font-semibold mb-6">
              Add Category
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full rounded-full border px-4 py-2"
              />

              <select
                value={selectedRound}
                onChange={(e) => setSelectedRound(e.target.value)}
                className="w-full rounded-full border px-4 py-2"
              >
                {rounds.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Category Weight (%)"
                value={categoryWeight}
                onChange={(e) => setCategoryWeight(e.target.value)}
                className="w-full rounded-full border px-4 py-2"
              />

              <input
                type="number"
                placeholder="Max Score"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                className="w-full rounded-full border px-4 py-2"
              />

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-6 py-2 border rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-6 py-2 bg-[#FA824C] text-white rounded-full"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CRITERIA MODAL */}
      <CriteriaModal
        isOpen={isCriteriaModalOpen}
        criteriaList={criteriaList}
        handleCriteriaChange={handleCriteriaChange}
        handleAddCriteriaRow={handleAddCriteriaRow}
        handleRemoveCriteriaRow={handleRemoveCriteriaRow}
        handleConfirmCriteria={handleConfirmCriteria}
        setIsCriteriaModalOpen={setIsCriteriaModalOpen}
        setIsCategoryModalOpen={setIsCategoryModalOpen}
      />
    </div>
  );
}

export default CategoryPage;
