import React, { useState, useEffect } from "react";

function EventModal({ isOpen, mode = "create", eventData, setEventData, onClose, onSubmit }) {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!eventData.image) {
            setPreview(null);
            return;
        }

        if (typeof eventData.image === "string") {
            setPreview(eventData.image); // existing image path
        } else {
            const objectUrl = URL.createObjectURL(eventData.image);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [eventData.image]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">
                <h2 className="text-center text-xl font-semibold mb-6">
                    {mode === "edit" ? "Edit Event" : "Add Event"}
                </h2>

                <form className="space-y-5">
                    {/* TITLE */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Event Name</label>
                        <input
                            type="text"
                            value={eventData.title || ""}
                            onChange={e => setEventData({ ...eventData, title: e.target.value })}
                            className="w-full rounded-full border border-orange-300 px-4 py-2"
                        />
                    </div>

                    {/* LOCATION */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Location</label>
                        <input
                            type="text"
                            value={eventData.location || ""}
                            onChange={(e) =>
                                setEventData({ ...eventData, location: e.target.value })
                            }
                            className="w-full rounded-full border border-orange-300 px-4 py-2"
                            placeholder="Event location"
                        />
                    </div>

                    {/* DATE */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Date</label>
                        <input
                            type="date"
                            value={eventData.date || ""}
                            onChange={e => setEventData({ ...eventData, date: e.target.value })}
                            className="w-full rounded-full border border-orange-300 px-3 py-2"
                        />
                    </div>

                    {/* TIME */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Time</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="time"
                                value={eventData.timeStart || ""}
                                onChange={e => setEventData({ ...eventData, timeStart: e.target.value })}
                                className="w-[140px] rounded-full border border-orange-300 px-3 py-2"
                            />
                            <span className="text-sm text-gray-500">to</span>
                            <input
                                type="time"
                                value={eventData.timeEnd || ""}
                                onChange={e => setEventData({ ...eventData, timeEnd: e.target.value })}
                                className="w-[140px] rounded-full border border-orange-300 px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* STAGES, JUDGES, CANDIDATES */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500 mb-1">Stages</label>
                            <input
                                type="number"
                                min="1"
                                value={eventData.stages ?? 1}
                                onChange={e => setEventData({ ...eventData, stages: Math.max(1, Number(e.target.value)) })}
                                className="w-full rounded-full border border-orange-300 px-4 py-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500 mb-1">Judges</label>
                            <input
                                type="number"
                                min="1"
                                value={eventData.judges ?? 1}
                                onChange={e => setEventData({ ...eventData, judges: Math.max(1, Number(e.target.value)) })}
                                className="w-full rounded-full border border-orange-300 px-4 py-2"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500 mb-1">Candidates</label>
                            <input
                                type="number"
                                min="1"
                                value={eventData.candidates ?? 1}
                                onChange={e => setEventData({ ...eventData, candidates: Math.max(1, Number(e.target.value)) })}
                                className="w-full rounded-full border border-orange-300 px-4 py-2"
                            />
                        </div>
                    </div>

                    {/* IMAGE UPLOAD */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Event Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e =>
                                setEventData({ ...eventData, image: e.target.files[0] || null })
                            }
                            className="text-sm"
                        />

                        {preview && (
                            <div className="mt-3 w-full h-40 rounded-xl overflow-hidden border border-orange-200">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-1">Description</label>
                        <textarea
                            rows="3"
                            value={eventData.description || ""}
                            onChange={e => setEventData({ ...eventData, description: e.target.value })}
                            className="w-full rounded-2xl border border-orange-300 px-4 py-2"
                        />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-full border border-orange-400 text-orange-500 hover:bg-orange-50 transition">
                            Cancel
                        </button>
                        <button type="button" onClick={onSubmit} className="px-6 py-2 rounded-full bg-[#FA824C] text-white hover:bg-orange-600 transition">
                            {mode === "edit" ? "Update" : "Confirm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EventModal;
