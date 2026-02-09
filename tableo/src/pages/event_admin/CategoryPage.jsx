import React, { useEffect, useState } from "react";
import CategoryCard from "../../components/CategoryCard";
import SideNavigation from "../../components/SideNavigation";
import ViewOnlyTable from "../../components/ViewOnlyTable";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getEvent } from "../../services/event_service";
import {
  addCategoryToEvent,
  getCategoriesByEvent,
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
  const [activeTopTab, setActiveTopTab] = useState("Rounds");
  const [activeRound, setActiveRound] = useState("");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryWeight, setCategoryWeight] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [selectedRound, setSelectedRound] = useState("");
  const [openCriteriaId, setOpenCriteriaId] = useState(null);

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
  };

  // ============================
  // FETCH CATEGORIES
  // ============================
  const fetchCategories = async () => {
    try {
      const res = await getCategoriesByEvent(eventId);
      // ✅ FIX: Use res.data.categories instead of res.data
      setCategories(res.data.categories || []);
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

      // 🔥 Always re-fetch from backend
      await fetchCategories();

      setActiveRound(selectedRound);
      resetCategoryForm();
      setIsCategoryModalOpen(false);
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
            <div className="flex gap-6 border-b mb-6 pl-6">
              {rounds.map((round) => (
                <button
                  key={round}
                  onClick={() => setActiveRound(round)}
                  className={`pb-3 text-lg font-medium ${activeRound === round
                      ? "border-b-2 border-[#FA824C] text-[#FA824C]"
                      : "text-gray-400"
                    }`}
                >
                  {round}
                </button>
              ))}
            </div>

            <CategoryCard
              categories={filteredCategories}
              openCriteriaId={openCriteriaId}
              setOpenCriteriaId={setOpenCriteriaId}
            />
          </>
        )}

        {activeTopTab === "Participants" && (
          <ViewOnlyTable title="Participants" data={event.participants || []} />
        )}

        {activeTopTab === "Judges" && (
          <ViewOnlyTable title="Judges" data={event.judges || []} />
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
    </div>
  );
}

export default CategoryPage;
