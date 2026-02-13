import SideNavigation from "../../components/SideNavigation";
import RestoreCardEvent from "../../components/RestoreCardEvent";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/swal";
import { getDeletedEvents, restoreEvent } from "../../services/event_service";
import Swal from "sweetalert2";

function ArchivePage() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAZ, setSortAZ] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArchivedEvents = async () => {
      try {
        const res = await getDeletedEvents();

        const archivedEvents = res.data.events.map(ev => ({
          ...ev,
          image: ev.path
            ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${ev.path}`
            : null,
        }));

        setEvents(archivedEvents);
      } catch (err) {
        showToast("error", "Failed to load archived events");
      }
    };

    fetchArchivedEvents();
  }, []);

  const handleRestore = async (eventId) => {
    try {
      await restoreEvent(eventId);

      showToast("success", "Event restored successfully");

      navigate("/events");

    } catch (err) {
      showToast("error", "Failed to restore event");
    }
  };

  const confirmRestore = async (eventId) => {
    const result = await Swal.fire({
      title: "Restore event?",
      text: "This event will be moved back to active events.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Restore",
    });

    if (result.isConfirmed) {
      handleRestore(eventId);
    }
  };

  const filteredAndSortedEvents = [...events]
    .filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortAZ
        ? a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        : b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
    );

  return (
    <div className="flex h-screen">
      <SideNavigation />

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-72 p-8 bg-gray-50 overflow-y-auto">
        {/* HEADER */}
        <h1 className="text-3xl font-bold border-b-2 pb-2 border-gray-300 mb-6">
          Archived Events
        </h1>

        {/* SORT + SEARCH */}
        <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center mb-6 gap-4">

          {/* A–Z Button */}
          <button
            onClick={() => setSortAZ(!sortAZ)}
            className="border border-gray-300 rounded-full px-3 py-2 text-sm bg-white hover:bg-gray-100 transition"
          >
            {sortAZ ? "A–Z" : "Z–A"}
          </button>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search archived events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-full pl-9 pr-3 py-2 text-sm w-[220px] focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        </div>

        {/* CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedEvents.length === 0 && (
            <p className="text-gray-500 text-center col-span-full mt-10">
              No archived events found
            </p>
          )}
          {filteredAndSortedEvents.map(event => (
            <RestoreCardEvent
              key={event.id}
              title={event.title}
              description={event.description}
              date={event.date}
              location={event.location}
              onRestore={() => confirmRestore(event.id)}
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              )}
            </RestoreCardEvent>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ArchivePage;
