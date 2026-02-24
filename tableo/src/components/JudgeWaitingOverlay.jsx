// JudgeWaitingOverlay.jsx
import React, { useMemo } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function JudgeWaitingOverlay({
    isOpen,
    judges = [],
    categoryName = "",
}) {
    if (!isOpen) return null;

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

                {/* Judges List */}
                <div className="space-y-4 max-h-[350px] overflow-y-auto">
                    {judges.map((judge) => {
                        // ✅ Normalize status safely
                        const normalizedStatus = (
                            judge?.status || "pending"
                        )
                            .toString()
                            .toLowerCase();

                        // ✅ Map backend variations to correct values
                        const finalStatus =
                            normalizedStatus === "completed"
                                ? "done"
                                : normalizedStatus;

                        return (
                            <div
                                key={judge.id}
                                className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl"
                            >
                                {/* Left: Judge Name + Progress */}
                                <div>
                                    <p className="font-medium">
                                        {judge.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {judge.scored ?? 0} /{" "}
                                        {judge.required ?? 0} candidates scored
                                    </p>
                                </div>

                                {/* Right: Status */}
                                <div className="flex items-center gap-2">
                                    {finalStatus === "done" ? (
                                        <>
                                            <span className="text-green-600 text-sm font-medium">
                                                Completed
                                            </span>
                                            <CheckCircle
                                                className="text-green-500"
                                                size={20}
                                            />
                                        </>
                                    ) : finalStatus === "scoring" ? (
                                        <>
                                            <span className="text-blue-600 text-sm font-medium">
                                                Scoring
                                            </span>
                                            <Loader2
                                                className="text-blue-500 animate-spin"
                                                size={20}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <span className="text-gray-400 text-sm">
                                                Pending
                                            </span>
                                            <XCircle
                                                className="text-gray-400"
                                                size={20}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-sm text-gray-500">
                    Please wait while judges finish scoring...
                </div>

            </div>
        </div>
    );
}