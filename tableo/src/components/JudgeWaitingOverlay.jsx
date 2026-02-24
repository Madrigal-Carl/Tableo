// JudgeWaitingOverlay.jsx
import React from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function JudgeWaitingOverlay({
    isOpen,
    judges = [],
    categoryName = "",
}) {
    if (!isOpen) return null;

    const total = judges.length;
    const finished = judges.filter((j) => j.status === "done").length;

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white w-[500px] max-w-[95%] rounded-2xl shadow-2xl p-8">

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">
                        Waiting for Judges
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Category:{" "}
                        <span className="font-semibold">
                            {categoryName || "N/A"}
                        </span>
                    </p>
                </div>

                {/* Progress Summary */}
                <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-2">
                        {finished} of {total} judges finished scoring
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-green-500 h-3 transition-all duration-500"
                            style={{
                                width: `${total === 0 ? 0 : (finished / total) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Judges List */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {judges.map((judge) => (
                        <div
                            key={judge.id}
                            className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl"
                        >
                            {/* Judge Name + Progress */}
                            <div>
                                <p className="font-medium">{judge.name}</p>
                                <p className="text-xs text-gray-500">
                                    {judge.scored} / {judge.required} scores
                                </p>
                            </div>

                            {/* Status Icon */}
                            <div>
                                {judge.status === "done" && (
                                    <CheckCircle
                                        className="text-green-500"
                                        size={22}
                                    />
                                )}

                                {judge.status === "scoring" && (
                                    <Loader2
                                        className="text-blue-500 animate-spin"
                                        size={22}
                                    />
                                )}

                                {judge.status === "pending" && (
                                    <XCircle
                                        className="text-gray-400"
                                        size={22}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    Please wait while all judges finish scoring...
                </div>

            </div>
        </div>
    );
}