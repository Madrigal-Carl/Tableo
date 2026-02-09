import React, { useEffect, useState } from "react";
import CategoryCard from "../../components/CategoryCard";
import SideNavigation from "../../components/SideNavigation";
import { ChevronLeft } from "lucide-react";
<<<<<<< HEAD
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getEvent } from "../../services/event_service"; // optional if fetching API
=======
import ViewOnlyTable from "../../components/ViewOnlyTable";

>>>>>>> main

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
  const [isCriteriaModalOpen, setIsCriteriaModalOpen] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [categoryWeight, setCategoryWeight] = useState("");
  const [maxScore, setMaxScore] = useState("");

  const [criteriaList, setCriteriaList] = useState([{ name: "", weight: "" }]);
  const [pendingCategory, setPendingCategory] = useState(null);
  const [openCriteriaId, setOpenCriteriaId] = useState(null);

  const tabs = ["Rounds", "Participants", "Judges"];

  // ============================
  // FETCH EVENT IF NOT IN STATE
  // ============================
  useEffect(() => {
    if (event) return;

    async function fetchEvent() {
      try {
        setLoading(true);
        const res = await getEvent(eventId); // API should return your JSON
        const evt = res.data;

        setEvent(evt);

        if (evt.categories?.length) setCategories(evt.categories);
        if (evt.stages?.length) setActiveRound(evt.stages[0].name);
      } catch (err) {
        console.error("Failed to load event", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [event, eventId]);

  // ============================
  // LOADING / GUARD
  // ============================
  if (loading) return <div className="p-10">Loading event...</div>;
  if (!event) return <div className="p-10 text-red-500">Event not found</div>;

  // ============================
  // ROUNDS FROM STAGES
  // ============================
  const rounds = event.stages?.map((s) => s.name) || [];

  // ============================
  // FILTER CATEGORIES
  // ============================
  const filteredCategories = categories.filter(
    (c) => c.eventId === event.id && c.round === activeRound
  );

  // ============================
  // HELPERS
  // ============================
  const resetCategoryForm = () => {
    setCategoryName("");
    setCategoryWeight("");
    setMaxScore("");
  };

  const resetCriteriaForm = () => {
    setCriteriaList([{ name: "", weight: "" }]);
  };

  const handleAddCategory = () => {
    if (!categoryName.trim() || !categoryWeight || !maxScore) return;

    const alreadyExists = categories.some(
      (c) =>
        c.round === selectedRound &&
        c.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (alreadyExists) {
      alert("Category already exists in this round");
      return;
    }

    const newCategory = {
      id: Date.now(),
      eventId: event.id,
      name: categoryName.trim(),
      round: activeRound,
      weight: Number(categoryWeight),
      maxScore: Number(maxScore),
      criteria: [],
    };

    setPendingCategory(newCategory);

    // 🔥 IMPORTANT: switch to the selected round
    setActiveRound(selectedRound);

    setIsCategoryModalOpen(false);
    setIsCriteriaModalOpen(true);
  };


  const handleAddCriteriaRow = () => {
    setCriteriaList([...criteriaList, { name: "", weight: "" }]);
  };

  const handleRemoveCriteriaRow = (index) => {
    if (criteriaList.length === 1) return;
    setCriteriaList(criteriaList.filter((_, i) => i !== index));
  };

  const handleCriteriaChange = (index, field, value) => {
    const updated = [...criteriaList];
    updated[index][field] = value;
    setCriteriaList(updated);
  };

  const handleConfirmCriteria = () => {
    if (!pendingCategory) return;

    const validCriteria = criteriaList.filter((c) => c.name.trim() && c.weight);

    if (!validCriteria.length) return;

    setCategories((prev) => [
      ...prev,
      {
        ...pendingCategory,
        criteria: validCriteria.map((c) => ({
          name: c.name.trim(),
          weight: Number(c.weight),
        })),
      },
    ]);

    setPendingCategory(null);
    resetCategoryForm();
    resetCriteriaForm();
    setIsCriteriaModalOpen(false);
  };

<<<<<<< HEAD
  // ============================
  // RENDER
  // ============================
=======
  const participants = [
    { id: 1, name: "Juan Dela Cruz", gender: "Male" },
    { id: 2, name: "Maria Clara", gender: "Female" },
  ];

  const judges = [
    { id: 1, name: "Judge A", gender: "Male" },
    { id: 2, name: "Judge B", gender: "Female" },
  ];


>>>>>>> main
  return (
    <div className="flex h-screen bg-gray-100">
      <SideNavigation />

      <section className="flex-1 ml-72 p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="mt-5 mb-6 text-gray-700">
          <div className="flex items-center gap-3">
            {/* Back button */}
            <ChevronLeft
              size={30}
              onClick={() => navigate("/events")}
              className="cursor-pointer hover:text-gray-900"
            />
            {/* Title */}
            <h1 className="text-4xl font-semibold">{event.title}</h1>
          </div>

          {/* Description below the title */}
          <p className="text-sm text-gray-500 leading-snug mt-2">
            {event.description}
          </p>
        </div>

<<<<<<< HEAD
        {/* TOP TABS */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex bg-[#FA824C] p-1 rounded-md overflow-hidden">
            <div
              className="absolute top-1 left-1 h-[40px] bg-white rounded-sm transition-transform duration-300"
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
=======
      <div className="flex items-center justify-between ml-3 mb-8">
        {/* LEFT TABS */}
      <div className="relative flex w-fit bg-[#FA824C] p-1 rounded-2xl overflow-hidden">
        
        {/* SLIDING INDICATOR */}
        <div
          className="absolute top-1 left-1 h-[40px] bg-white rounded-2xl transition-transform duration-300 ease-out"
          style={{
            width: "110px",
            transform: `translateX(${activeIndex * 110}px)`,
          }}
        />
>>>>>>> main

          <button
            onClick={() => {
              resetCategoryForm();
              resetCriteriaForm();
              setIsCategoryModalOpen(true);
            }}
            className="bg-[#FA824C] px-6 h-[50px] rounded-lg text-white font-medium hover:bg-orange-600"
          >
            + Add Category
          </button>
        </div>

<<<<<<< HEAD
        {/* ROUND TABS */}
        <div className="flex gap-6 border-b border-gray-300 mb-6 pl-6">
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

        {/* CATEGORY LIST */}
        <CategoryCard
          categories={filteredCategories}
          openCriteriaId={openCriteriaId}
          setOpenCriteriaId={setOpenCriteriaId}
        />
=======
      </div>
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="w-fit bg-[#FA824C] p-3 rounded-lg h-[50px] text-white font-medium hover:bg-orange-600 transition"
        >
          + Add Category
        </button>
      </div>

        {/* TAB CONTENT */}

        {activeTopTab === "Rounds" && (
          <>
            {/* ROUND SELECTOR */}
            <div className="flex gap-3 mb-6 px-6 border-b border-gray-200">
              {rounds.map((round) => (
                <button
                  key={round}
                  onClick={() => setActiveRound(round)}
                  className={`px-4 py-2 text-sm font-medium transition
                    ${
                      activeRound === round
                        ? "text-[#FA824C] border-b-2 border-[#FA824C]"
                        : "text-gray-500 hover:text-[#FA824C] hover:border-b-2"
                    }`}
                >
                  {round}
                </button>
              ))}
            </div>

            <div className="flex-1 px-6">
              <CategoryCard
                categories={filteredCategories}
                openCriteriaId={openCriteriaId}
                setOpenCriteriaId={setOpenCriteriaId}
              />
            </div>
          </>
        )}

        {activeTopTab === "Participants" && (
          <ViewOnlyTable
            title="Participants"
            data={participants}
            nameLabel="Name"
            editable
            onEdit={(p) => console.log("Edit", p)}
            onDelete={(p) => console.log("Delete", p)}
          />
        )}

        {activeTopTab === "Judges" && (
          <ViewOnlyTable
            title="Judges"
            data={judges}
            nameLabel="Judge Name"
          />
        )}

>>>>>>> main
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
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CRITERIA MODAL */}
      {isCriteriaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-center text-xl font-semibold mb-6">Criteria</h2>

            {criteriaList.map((c, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 mb-4">
                <input
                  placeholder="Criteria"
                  value={c.name}
                  onChange={(e) =>
                    handleCriteriaChange(i, "name", e.target.value)
                  }
                  className="rounded-full border px-4 py-2"
                />
                <input
                  type="number"
                  placeholder="%"
                  value={c.weight}
                  onChange={(e) =>
                    handleCriteriaChange(i, "weight", e.target.value)
                  }
                  className="rounded-full border px-4 py-2"
                />
                <button
                  onClick={() => handleRemoveCriteriaRow(i)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              onClick={handleAddCriteriaRow}
              className="w-full bg-[#FA824C] text-white rounded-full py-2 mb-4"
            >
              + Add Criteria
            </button>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setIsCriteriaModalOpen(false);
                  setIsCategoryModalOpen(true);
                }}
                className="px-6 py-2 border rounded-full"
              >
                Previous
              </button>
              <button
                onClick={handleConfirmCriteria}
                className="px-6 py-2 bg-[#FA824C] text-white rounded-full"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
