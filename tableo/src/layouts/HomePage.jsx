import Navigation from "../components/Navigation";
import CardEvent from "../components/CreateCardEvent";
import EventImage1 from "../assets/pg1.jpg";
import React, { useState } from "react";
import "../index.css";

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortAZ, setSortAZ] = useState(true); 
  const [searchQuery, setSearchQuery] = useState("");


  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    description: "",
  });

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Mr. & Ms. 2026",
      description: "...",
      date: "Feb 01 2060 | 12:00pm – 5:00pm",
      location: "Araneta, USA",
      image: EventImage1
    },
    {
      id: 2,
      title: "Tech Expo 2026",
      description: "...",
      date: "Mar 10 2060 | 9:00am – 6:00pm",
      location: "Manila",
      image: ""
    },
    {
      id: 3,
      title: "Music Festival 2026",
      description: "...",
      date: "Apr 15 2060 | 2:00pm – 11:00pm",
      location: "Central Park, NYC",
      image: ""
    },
    {
      id: 4,
      title: "Art Fair 2026",
      description: "...",
      date: "May 20 2060 | 10:00am – 6:00pm",
      location: "Cebu",
      image: ""
    },
    {
      id: 5,
      title: "Art Fair 2026",
      description: "...",
      date: "May 20 2060 | 10:00am – 6:00pm",
      location: "Cebu",
      image: ""
    },
  ]);

  const toggleSort = () => setSortAZ(!sortAZ);

  const filteredAndSortedEvents = [...events]
    .filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortAZ
        ? a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        : b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
    );

  return (
    <>
      <Navigation />

      {/* PAGE CONTENT */}
      <div className="pt-24 px-16 w-full">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Events</h1>

          {/* CONTROLS */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Sort:</span>

            {/* Date filter (keep dropdown) */}
            <select
              className="border border-gray-300 rounded-full px-4 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-orange-400"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>

            {/* A–Z / Z–A toggle */}
            <button
              className="border border-gray-300 rounded-full px-3 py-2 text-sm bg-white hover:bg-gray-100 transition"
              onClick={toggleSort}
            >
              {sortAZ ? "A–Z" : "Z–A"}
            </button>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-full pl-9 pr-3 py-2 text-sm w-[160px] focus:outline-none focus:ring-1 focus:ring-orange-400"
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
        </div>

        {/* CARD GRID */}
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredAndSortedEvents.map((event) => (
            <CardEvent
              key={event.id}
              title={event.title}
              description={event.description}
              date={event.date}
              location={event.location}
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              )}
            </CardEvent>
          ))}
          </div>
        </div>
        
      </div>

      {/* FIXED CIRCLE ADD BUTTON */}
      <button
        className="fixed bottom-8 right-8 w-12 h-12 bg-[#FA824C] text-white rounded-full shadow-lg flex items-center justify-center text-3xl font-bold transition-transform hover:scale-110"
        onClick={() => setIsModalOpen(true)}
      >
        +
      </button>

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
                    className="w-full rounded-full border border-orange-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>

                {/* NUMBER OF ROUNDS */}
                <div className="flex flex-col flex-1 min-w-0">
                  <label className="text-sm text-gray-500 mb-1">Number of Rounds</label>
                  <input
                    type="number"
                    placeholder=""
                    className="w-full rounded-full border border-orange-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>
              </div>


            {/* JUDGES + CANDIDATES */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 mb-1">Total Judges</label>
                <input
                  type="number"
                  className="w-full rounded-full border border-orange-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 mb-1">Total Candidates</label>
                <input
                  type="number"
                  className="w-full rounded-full border border-orange-300 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
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
                      title: newEvent.title,
                      description: newEvent.description || "No description provided.",
                      date: "TBD",
                      location: newEvent.location || "TBD",
                      image: "",
                    },
                  ]);

                  setNewEvent({ title: "", location: "", description: "" });
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
    </>
  );
}

export default HomePage;
