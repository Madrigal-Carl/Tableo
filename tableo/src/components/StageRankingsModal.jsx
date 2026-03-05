import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function StageRankingsModal({
  isOpen,
  onClose,
  event,
  rankingsData = {},
  onExport,
}) {
  const [activeStage, setActiveStage] = useState("");

  const stages = event?.stages
    ? [...event.stages].sort((a, b) => a.sequence - b.sequence)
    : [];

  // ✅ Auto select first stage when modal opens
  useEffect(() => {
    if (isOpen && stages.length > 0) {
      setActiveStage(stages[0].name);
    }
  }, [isOpen]); // DO NOT add stages here

  if (!isOpen || !event) return null;

  const stageData = rankingsData[activeStage] || { male: [], female: [] };

  const maleList = stageData.male || [];
  const femaleList = stageData.female || [];

  const showMale = maleList.length > 0;
  const showFemale = femaleList.length > 0;

  const gridClass =
    showMale && showFemale ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-6xl rounded-2xl shadow-xl p-6 relative">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-[#192BC2] mb-6">
          Stage Rankings
        </h2>

        {/* ================== CATEGORY PAGE STYLE STAGE TABS ================== */}
        <div className="relative flex bg-[#192BC2] p-1 rounded-md w-fit mb-6">
          {/* Sliding Background */}
          <div
            className="absolute top-1 left-1 h-10 bg-white rounded-sm transition-transform duration-300"
            style={{
              width: "140px",
              transform: `translateX(${
                stages.findIndex((s) => s.name === activeStage) * 140
              }px)`,
            }}
          />

          {stages.map((stage) => {
            const isActive = activeStage === stage.name;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.name)}
                className={`relative z-10 w-[140px] h-10 font-medium transition ${
                  isActive ? "text-gray-600" : "text-white"
                }`}
              >
                {stage.name}
              </button>
            );
          })}
        </div>

        {/* ================= NO DATA ================= */}
        {!showMale && !showFemale && (
          <p className="text-center text-gray-400 py-12">
            No rankings available for this stage.
          </p>
        )}

        {/* ================= GRID ================= */}
        {(showMale || showFemale) && (
          <div className={`grid gap-6 ${gridClass}`}>
            {/* ================= MALE ================= */}
            {showMale && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">
                  Male
                </h3>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {maleList
                    .sort((a, b) => a.rank - b.rank)
                    .slice(0, 3)
                    .map((candidate) => (
                      <div
                        key={candidate.candidate_id}
                        className="flex items-center justify-between bg-gray-100 p-3 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          {candidate.path ? (
                            <img
                              src={`${import.meta.env.VITE_ASSET_URL}${candidate.path}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-300" />
                          )}

                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-gray-500">
                              Avg:{" "}
                              {Number(candidate.stage_total || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="text-xl font-bold text-[#FA824C]">
                          #{candidate.rank}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ================= FEMALE ================= */}
            {showFemale && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-pink-600">
                  Female
                </h3>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {femaleList
                    .sort((a, b) => a.rank - b.rank)
                    .slice(0, 3)
                    .map((candidate) => (
                      <div
                        key={candidate.candidate_id}
                        className="flex items-center justify-between bg-gray-100 p-3 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          {candidate.path ? (
                            <img
                              src={`${import.meta.env.VITE_ASSET_URL}${candidate.path}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-300" />
                          )}

                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-gray-500">
                              Avg:{" "}
                              {Number(candidate.stage_total || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="text-xl font-bold text-[#FA824C]">
                          #{candidate.rank}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* ================= EXPORT BUTTON ================= */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => onExport(activeStage)}
            className="bg-green-600 px-6 h-12.5 rounded-lg text-white font-medium hover:bg-green-700"
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
