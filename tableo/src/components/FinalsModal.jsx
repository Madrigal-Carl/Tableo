import React from "react";
import { X } from "lucide-react";

/* =========================================================
   WINNER CARD
========================================================= */
const WinnerCard = ({ winner }) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 flex items-center gap-6 min-w-[320px] border border-gray-200">
            {/* IMAGE */}
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                {winner?.path ? (
                    <img
                        src={`${import.meta.env.VITE_ASSET_URL}${winner.path}`}
                        alt={winner?.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        No Image
                    </div>
                )}
            </div>

            {/* INFO */}
            <div className="flex flex-col gap-2">
                <h3 className="text-xl font-bold text-[#192BC2]">
                    {winner?.name || "Unknown"}
                </h3>

                <div className="text-gray-700 text-sm">
                    <p>
                        <span className="font-semibold">Average:</span>{" "}
                        {Number(parseFloat(winner?.stage_total) || 0).toFixed(2)}
                    </p>

                    <p>
                        <span className="font-semibold">Rank:</span>{" "}
                        <span className="text-[#FA824C] font-bold">
                            {winner?.rank || "-"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

/* =========================================================
   FINALS MODAL
========================================================= */
function FinalsModal({ isOpen, onClose, results, onFinalize, loading }) {
    if (!isOpen) return null;

    const males = results?.males ?? [];
    const females = results?.females ?? [];

    const isEmpty = males.length === 0 && females.length === 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-100 rounded-3xl w-[95%] max-w-7xl max-h-[90vh] overflow-y-auto p-10 relative">

                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-600 hover:text-gray-900"
                >
                    <X size={28} />
                </button>

                <h2 className="text-3xl font-bold text-center text-[#192BC2] mb-12">
                    🏆 Event Final Results
                </h2>

                {/* EMPTY STATE */}
                {isEmpty ? (
                    <div className="text-center text-gray-600">
                        No final results available.
                    </div>
                ) : (
                    <div
                        className={`grid gap-16 ${males.length > 0 && females.length > 0
                                ? "grid-cols-1 lg:grid-cols-2"
                                : "grid-cols-1"
                            }`}
                    >
                        {/* MALE SECTION */}
                        {males.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-semibold text-center text-blue-600 mb-8">
                                    Male Winners
                                </h3>

                                <div className="flex flex-col items-center gap-6">
                                    {males.map((winner) => (
                                        <WinnerCard
                                            key={
                                                winner.candidate_id ??
                                                winner.id ??
                                                `${winner.name}-${Math.random()}`
                                            }
                                            winner={winner}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* FEMALE SECTION */}
                        {females.length > 0 && (
                            <div>
                                <h3 className="text-2xl font-semibold text-center text-pink-600 mb-8">
                                    Female Winners
                                </h3>

                                <div className="flex flex-col items-center gap-6">
                                    {females.map((winner) => (
                                        <WinnerCard
                                            key={
                                                winner.candidate_id ??
                                                winner.id ??
                                                `${winner.name}-${Math.random()}`
                                            }
                                            winner={winner}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ✅ FINALIZE BUTTON ALWAYS SHOWS */}
                <div className="flex justify-center mt-12">
                    <button
                        onClick={onFinalize || onClose}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition disabled:opacity-50"
                    >
                        {loading
                            ? "Finalizing..."
                            : "Confirm & Finalize Event"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default FinalsModal;