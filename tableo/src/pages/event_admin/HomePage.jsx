import SideNavigation from "../../components/SideNavigation";
import CardEvent from "../../components/CreateCardEvent";
import EventImage1 from "../../assets/pg1.jpg";
import React, { useState } from "react";
import { CalendarPlus } from "lucide-react";

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortAZ, setSortAZ] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([
    { id: 1, title: "Mr. & Ms. 2026", description: "...", date: "Feb 01 2060", location: "Araneta, USA", image: EventImage1 },
    { id: 2, title: "Tech Expo 2026", description: "...", date: "Mar 10 2060", location: "Manila", image: "" },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    description: "",
    date: "",
    rounds: 1,
    judges: 1,
    candidates: 1,
  });

  const toggleSort = () => setSortAZ(!sortAZ);
  const [sortOption, setSortOption] = useState("all");



  const filteredAndSortedEvents = [...events]
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      const eventDate = new Date(event.date);
      const now = new Date();

      let matchesDate = true;

      if (!isNaN(eventDate)) {
        if (sortOption === "all") {
          matchesDate = true;
        } else if (sortOption === "today") {
          matchesDate = eventDate.toDateString() === now.toDateString();
        } else if (sortOption === "thisWeek") {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          matchesDate = eventDate >= startOfWeek && eventDate <= endOfWeek;
        } else if (sortOption === "thisYear") {
          matchesDate = eventDate.getFullYear() === now.getFullYear();
        }
      }

      return matchesSearch && matchesDate;
    })
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
        <h1 className="text-3xl font-bold border-b-2 pb-2 border-gray-300 mb-6">Your Events</h1>

        {/* SORT + SEARCH BAR + ADD EVENT */}
        <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center mb-6 gap-4">

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort:</span>
            <select
              className="border border-gray-300 rounded-full px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-orange-400 hover:border-orange-400 transition"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>

          {/* A–Z Sorting Button */}
          <button
            onClick={toggleSort}
            className="border border-gray-300 rounded-full px-3 py-2 text-sm bg-white hover:bg-gray-100 transition"
          >
            {sortAZ ? "A–Z" : "Z–A"}
          </button>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded-full pl-9 pr-3 py-2 text-sm w-[200px] focus:outline-none focus:ring-1 focus:ring-orange-400"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
            </svg>
          </div>

          {/* Add Event Button */}
          <div>
            <button
              className="w-32 flex items-center justify-center gap-3 bg-[#FA824C] text-white py-3 rounded-2xl font-bold hover:bg-[#FF9768]"
              onClick={() => setIsModalOpen(true)}
            >
              <CalendarPlus size={18} />
              Add Event
            </button>
          </div>
        </div>

        {/* CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedEvents.map((event) => (
            <CardEvent
              key={event.id}
              title={event.title}
              description={event.description}
              date={event.date}
              location={event.location}
            >
              {event.image && (
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              )}
            </CardEvent>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto scrollbar-hide">

              {/* TITLE */}
              <h2 className="text-center text-xl font-semibold mb-6">
                Add Event
              </h2>

              <form className="space-y-5">

                {/* EVENT NAME */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-500 mb-1">Event Name</label>
                  <input
                    type="text"
                    placeholder="Enter event name"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    className="w-full rounded-full border border-orange-300 px-4 py-2"
                  />
                </div>

                {/* LOCATION */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-500 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={newEvent.location}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, location: e.target.value })
                    }
                    className="w-full rounded-full border border-orange-300 px-4 py-2"
                  />
                </div>

                {/* TIME + DATE */}
                <div className="flex flex-col w-full gap-3">
                  {/* TIME RANGE */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-1">Time</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        className="w-[140px] rounded-full border border-orange-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <input
                        type="time"
                        className="w-[140px] rounded-full border border-orange-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                      />
                    </div>
                  </div>
                </div>

                {/* DATE + NUMBER OF ROUNDS */}
                <div className="flex flex-col sm:flex-row sm:gap-4 gap-3 w-full">
                  {/* DATE */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <label className="text-sm text-gray-500 mb-1">Date</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={newEvent.date}
                          onChange={(e) => {
                            const selected = new Date(e.target.value);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            if (selected < today) return;

                            setNewEvent({ ...newEvent, date: e.target.value });
                          }}
                        className="w-full rounded-full border border-orange-300 px-3 py-2"
                      />
                  </div>

                  {/* NUMBER OF ROUNDS */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <label className="text-sm text-gray-500 mb-1">Number of Rounds</label>
                      <input
                        type="number"
                        min="1"
                        value={newEvent.rounds}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, rounds: Math.max(1, Number(e.target.value)) })
                        }
                        className="w-full rounded-full border border-orange-300 px-4 py-2"
                      />
                  </div>
                </div>


                {/* JUDGES + CANDIDATES */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-1">Total Judges</label>
                      <input
                        type="number"
                        min="1"
                        value={newEvent.judges}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            judges: Math.max(1, Number(e.target.value)),
                          })
                        }
                        className="w-full rounded-full border border-orange-300 px-4 py-2"
                      />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-1">Total Candidates</label>
                      <input
                        type="number"
                        min="1"
                        value={newEvent.candidates}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            candidates: Math.max(1, Number(e.target.value)),
                          })
                        }
                        className="w-full rounded-full border border-orange-300 px-4 py-2"
                      />
                  </div>
                </div>

                {/* OPTIONAL IMAGE */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-gray-400">Optional</span>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 rounded-full border border-orange-300 px-4 py-2 text-sm text-orange-500 hover:bg-orange-50 transition"
                  >
                    + Add Image
                  </button>
                </div>

                {/* DESCRIPTION */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-500 mb-1">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Enter description"
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                    className="w-full rounded-2xl border border-orange-300 px-4 py-2"
                  />
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    disabled={!newEvent.title.trim() || !newEvent.date}
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 rounded-full border border-orange-400 text-orange-500 hover:bg-orange-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!newEvent.title.trim()) return;
                          setEvents((prev) => [
                            ...prev,
                            {
                              id: Date.now(),
                              title: newEvent.title,
                              description: newEvent.description || "No description provided.",
                              date: newEvent.date,
                              location: newEvent.location || "TBD",
                              image: "",
                            },
                          ]);

                      setNewEvent({
                        title: "",
                        location: "",
                        description: "",
                        date: "",
                        rounds: 1,
                        judges: 1,
                        candidates: 1,
                      });
                      setIsModalOpen(false);
                    }}
                    className="px-6 py-2 rounded-full bg-[#FA824C] text-white hover:bg-orange-600 transition"
                  >
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
