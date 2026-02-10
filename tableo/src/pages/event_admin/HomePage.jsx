import SideNavigation from "../../components/SideNavigation";
import CardEvent from "../../components/CreateCardEvent";
import EventModal from "../../components/EventModal";
import React, { useState, useEffect } from "react";
import { CalendarPlus } from "lucide-react";
import FullScreenLoader from "../../components/FullScreenLoader";
import Swal from "sweetalert2";
import { createEvent, getAllEvents, deleteEvent, updateEvent } from "../../services/event_service";
import { validateEvent } from "../../validations/event_validation";
import { showToast } from "../../utils/swal";
import { useNavigate } from "react-router-dom";
import { socket } from "../../utils/socket";

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [sortAZ, setSortAZ] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    description: "",
    date: "",
    timeStart: "",
    timeEnd: "",
    stages: 1,
    judges: 1,
    candidates: 1,
    image: null,
  });

  const openCreateModal = () => {
    setModalMode("create");
    setNewEvent({
      title: "",
      location: "",
      description: "",
      date: "",
      timeStart: "",
      timeEnd: "",
      stages: 1,
      judges: 1,
      candidates: 1,
      image: null,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setModalMode("edit");
    const formattedDate = event.date
      ? new Date(event.date).toISOString().split("T")[0]
      : "";
    setNewEvent({
      id: event.id,
      title: event.title,
      location: event.location,
      description: event.description,
      date: formattedDate,
      timeStart: event.timeStart ? event.timeStart.slice(0, 5) : "",
      timeEnd: event.timeEnd ? event.timeEnd.slice(0, 5) : "",
      stages: event.stages,
      judges: event.judges,
      candidates: event.candidates,
      image: event.image || null,
    });
    setIsModalOpen(true);
  };

  const handleUpdateEvent = async () => {
    const error = validateEvent(newEvent);
    if (error) return showToast("error", error);

    try {
      const formData = new FormData();

      formData.append("title", newEvent.title);
      formData.append("location", newEvent.location);
      formData.append("description", newEvent.description);
      formData.append("date", newEvent.date);
      formData.append("timeStart", newEvent.timeStart);
      formData.append("timeEnd", newEvent.timeEnd);
      formData.append("stages", newEvent.stages);
      formData.append("judges", newEvent.judges);
      formData.append("candidates", newEvent.candidates);

      if (newEvent.image && typeof newEvent.image !== "string") {
        formData.append("image", newEvent.image);
      }

      const res = await updateEvent(newEvent.id, formData);

      const updatedEvent = {
        ...res.data.event,
        image: res.data.event.path
          ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${res.data.event.path}`
          : newEvent.image,
      };

      setEvents((prev) =>
        prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
      );

      showToast("success", "Event updated successfully");
      setIsModalOpen(false);
    } catch (err) {
      showToast("error", err.message || "Failed to update event");
    }
  };

  const toggleSort = () => setSortAZ(!sortAZ);
  const [sortOption, setSortOption] = useState("all");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await getAllEvents();
        const formattedEvents = res.data.events.map((ev) => ({
          ...ev,
          image: ev.path
            ? `${import.meta.env.VITE_ASSET_URL}${ev.path}`
            : null,
        }));
        setEvents(formattedEvents);
      } catch (err) {
        showToast("error", err.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    // initial load
    fetchEvents();

    // 🔥 listen for backend updates
    socket.on("events:updated", () => {
      fetchEvents();
    });

    return () => {
      socket.off("events:updated");
    };
  }, []);

  const handleDeleteEvent = async (eventId) => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteEvent(eventId);

      setEvents((prev) => prev.filter((ev) => ev.id !== eventId));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Event has been deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to delete event",
      });
    }
  };


  const handleCreateEvent = async () => {
    const error = validateEvent(newEvent);
    if (error) return showToast("error", error);

    try {
      const formData = new FormData();

      formData.append("title", newEvent.title);
      formData.append("location", newEvent.location);
      formData.append("description", newEvent.description);
      formData.append("date", newEvent.date);
      formData.append("timeStart", newEvent.timeStart);
      formData.append("timeEnd", newEvent.timeEnd);
      formData.append("stages", newEvent.stages);
      formData.append("judges", newEvent.judges);
      formData.append("candidates", newEvent.candidates);

      if (newEvent.image) {
        formData.append("image", newEvent.image);
      }

      const res = await createEvent(formData);

      const newFormattedEvent = {
        ...res.data.event,
        image: res.data.event.path
          ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${res.data.event.path}`
          : null,
      };

      setEvents((prev) => [...prev, newFormattedEvent]);
      showToast("success", "Event created successfully");

      setIsModalOpen(false);
      setNewEvent({
        title: "",
        location: "",
        description: "",
        date: "",
        timeStart: "",
        timeEnd: "",
        stages: 1,
        judges: 1,
        candidates: 1,
        image: null,
      });
    } catch (err) {
      showToast("error", err.message || "Failed to create event");
    }
  };

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
        {/* Loader */}
        <FullScreenLoader show={loading} />

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
              onClick={openCreateModal}
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
              onClick={() => navigate(`/categories/${event.id}`)}
              onEdit={() => openEditModal(event)}
              onDelete={() => handleDeleteEvent(event.id)}
            >
              {event.image && (
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              )}
            </CardEvent>
          ))}
        </div>

        <EventModal
          isOpen={isModalOpen}
          mode={modalMode}
          eventData={newEvent}
          setEventData={setNewEvent}
          onClose={() => setIsModalOpen(false)}
          onSubmit={modalMode === "edit" ? handleUpdateEvent : handleCreateEvent}
        />
      </main>
    </div>
  );
}

export default HomePage;
