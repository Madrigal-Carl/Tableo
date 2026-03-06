import React, { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";

export default function StageRankingsModal({
  isOpen,
  onClose,
  event,
  rankingsData = {},
  onExport,
}) {
  const [activeStage, setActiveStage] = useState("");

  /* =========================================================
     STAGES FROM BACKEND
  ========================================================== */

  const stages = useMemo(() => {
    if (!event?.stages) return [];
    return [...event.stages].sort((a, b) => a.sequence - b.sequence);
  }, [event]);

  /* =========================================================
     AUTO SELECT FIRST AVAILABLE STAGE
  ========================================================== */

  useEffect(() => {
    if (!isOpen) return;

    const availableStages = Object.keys(rankingsData || {});

    if (availableStages.length > 0) {
      setActiveStage(availableStages[0]);
    } else if (stages.length > 0) {
      setActiveStage(stages[0].name);
    }
  }, [isOpen, rankingsData, stages]);

  if (!isOpen || !event) return null;

  /* =========================================================
     GET CURRENT STAGE DATA
  ========================================================== */

  const stageData = rankingsData?.[activeStage] || {};
  const overall = stageData?.overall || { male: [], female: [] };
  const categories = stageData?.categories || {};

  const overallMale = overall.male || [];
  const overallFemale = overall.female || [];

  const showOverall =
    overallMale.length > 0 || overallFemale.length > 0;

  const stageTabs = Object.keys(rankingsData || {}).length
    ? Object.keys(rankingsData)
    : stages.map((s) => s.name);

  /* ========================================================= */

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-7xl rounded-2xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh]">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-[#192BC2] mb-6">
          Stage Rankings - {activeStage || "Loading..."}
        </h2>

        {/* ================= STAGE TABS ================= */}

        <div className="relative flex bg-[#192BC2] p-1 rounded-md w-fit mb-8">
          <div
            className="absolute top-1 left-1 h-10 bg-white rounded-sm transition-transform duration-300"
            style={{
              width: "140px",
              transform: `translateX(${stageTabs.findIndex((s) => s === activeStage) * 140
                }px)`,
            }}
          />

          {stageTabs.map((stageName) => {
            const isActive = activeStage === stageName;

            return (
              <button
                key={stageName}
                onClick={() => setActiveStage(stageName)}
                className={`relative z-10 w-[140px] h-10 font-medium ${isActive ? "text-gray-600" : "text-white"
                  }`}
              >
                {stageName}
              </button>
            );
          })}
        </div>

        {/* =========================================================
           🟢 OVERALL RANKINGS
        ========================================================== */}

        {showOverall && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-[#192BC2] mb-4">
              Overall Rankings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {overallMale.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-blue-600 mb-3">
                    Male
                  </h4>

                  <div className="space-y-3">
                    {overallMale
                      .sort((a, b) => a.rank - b.rank)
                      .map((c) => (
                        <RankingCard
                          key={c.candidate_id}
                          candidate={c}
                        />
                      ))}
                  </div>
                </div>
              )}

              {overallFemale.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-pink-600 mb-3">
                    Female
                  </h4>

                  <div className="space-y-3">
                    {overallFemale
                      .sort((a, b) => a.rank - b.rank)
                      .map((c) => (
                        <RankingCard
                          key={c.candidate_id}
                          candidate={c}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================
           🔵 CATEGORY RANKINGS
        ========================================================== */}

        <div>
          <h3 className="text-xl font-bold text-[#192BC2] mb-6">
            Category Rankings
          </h3>

          {Object.keys(categories).length === 0 && (
            <p className="text-gray-400">
              No category rankings available.
            </p>
          )}

          {Object.entries(categories).map(([categoryName, data]) => {
            const males = data?.males || [];
            const females = data?.females || [];

            if (males.length === 0 && females.length === 0)
              return null;

            return (
              <div
                key={categoryName}
                className="mb-10 bg-gray-50 p-6 rounded-xl"
              >
                <h4 className="text-lg font-semibold text-gray-700 mb-4">
                  {categoryName}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {males.length > 0 && (
                    <div>
                      <h5 className="text-blue-600 font-medium mb-3">
                        Male
                      </h5>

                      <div className="space-y-3">
                        {males
                          .sort((a, b) => a.rank - b.rank)
                          .map((c) => (
                            <RankingCard
                              key={c.id || c.candidate_id}
                              candidate={c}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {females.length > 0 && (
                    <div>
                      <h5 className="text-pink-600 font-medium mb-3">
                        Female
                      </h5>

                      <div className="space-y-3">
                        {females
                          .sort((a, b) => a.rank - b.rank)
                          .map((c) => (
                            <RankingCard
                              key={c.id || c.candidate_id}
                              candidate={c}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= EXPORT ================= */}

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

/* =========================================================
   ✅ REUSABLE CARD (WITH SEQUENCE FIX)
========================================================= */

function RankingCard({ candidate }) {
  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
      <div className="flex items-center gap-4">
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

          {/* ✅ Candidate No (Sequence) */}
          <p className="text-xs text-gray-500">
            Candidate No.: {candidate.sequence ?? "—"}
          </p>

          <p className="text-sm text-gray-500">
            Avg:{" "}
            {Number(
              candidate.total_average ||
              candidate.stage_total ||
              0
            ).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="text-xl font-bold text-[#FA824C]">
        #{candidate.rank}
      </div>
    </div>
  );
}