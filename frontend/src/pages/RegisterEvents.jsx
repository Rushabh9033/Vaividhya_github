import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { EVENT_IMAGES } from "../Events";
import { API } from "../config/api";
import showToast from "../components/Toast";

function RegisterEvents() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("currentUserId");

  const [events, setEvents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [status, setStatus] = useState({
    loading: true,
    error: null,
    submitting: false
  });

  // ✅ Define technical categories (backend-compatible)
  const TECHNICAL_CATEGORIES = [
    "Robotics",
    "Coding",
    "Artificial Intelligence",
    "Cybersecurity",
    "Physics",
    "Engineering"
  ];

  // ================= FETCH EVENTS =================
  useEffect(() => {
    if (!userId) {
      navigate("/register");
      return;
    }

    async function fetchEvents() {
      try {
        const response = await fetch(
          `${API.EVENTS}/`
        );

        if (!response.ok) throw new Error("Fetch failed");

        const apiData = await response.json();

        // ✅ Merge images safely
        const enriched = apiData.map(event => ({
          ...event,
          image: EVENT_IMAGES[event.event_id] || "/placeholder.png"
        }));

        setEvents(enriched);
        setStatus({ loading: false, error: null, submitting: false });
      } catch (err) {
        setStatus({
          loading: false,
          error: "Could not load events. Please try again.",
          submitting: false
        });
      }
    }

    fetchEvents();
  }, [userId, navigate]);

  // ================= FILTER EVENTS =================
  const technicalEvents = events.filter(
    e => TECHNICAL_CATEGORIES.includes(e.category)
  );

  const nonTechnicalEvents = events.filter(
    e => !TECHNICAL_CATEGORIES.includes(e.category)
  );

  // ================= TOGGLE SELECTION =================
  function toggleEvent(eventId) {
    setSelectedIds(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      }

      if (prev.length >= 3) {
        showToast("You can select a maximum of 3 events.", "warning");
        return prev;
      }

      return [...prev, eventId];
    });
  }

  // ================= SUBMIT =================
  async function handleProceed() {
    if (selectedIds.length === 0) {
      showToast("Please select at least one event.", "warning");
      return;
    }

    setStatus(prev => ({ ...prev, submitting: true }));

    try {
      const response = await fetch(
        `${API.REGISTRATIONS}/${userId}/events`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ events: selectedIds })
        }
      );

      if (response.ok) {
        navigate("/register/receipt");
      } else {
        const data = await response.json();
        showToast(data.detail || "Submission failed", "error");
        setStatus(prev => ({ ...prev, submitting: false }));
      }
    } catch (err) {
      showToast("Network error. Please try again.", "error");
      setStatus(prev => ({ ...prev, submitting: false }));
    }
  }

  // ================= UI STATES =================
  if (status.loading)
    return (
      <div className="text-center p-20 text-xl font-bold">
        Loading Events...
      </div>
    );

  if (status.error)
    return (
      <div className="text-center p-20 text-red-600">
        {status.error}
      </div>
    );

  return (
    <>
      <Navbar />

      <section className="event-selection-page">
        <div className="event-selection-container">

          <h1>Select Your Events</h1>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 max-w-2xl mx-auto">
            <p className="font-bold">🎉 Offers</p>
            <ul className="list-disc ml-5">
              <li>Select maximum 3 events</li>
              <li>₹50 & ₹100 events available</li>
            </ul>
          </div>

          {/* TECHNICAL */}
          {technicalEvents.length > 0 && (
            <>
              <h2 className="event-category-title">Technical Events</h2>
              <div className="event-select-grid">
                {technicalEvents.map(event => (
                  <EventCard
                    key={event.event_id}
                    event={event}
                    selectedIds={selectedIds}
                    onToggle={toggleEvent}
                  />
                ))}
              </div>
            </>
          )}

          {/* NON TECHNICAL */}
          {nonTechnicalEvents.length > 0 && (
            <>
              <h2 className="event-category-title">Non-Technical Events</h2>
              <div className="event-select-grid">
                {nonTechnicalEvents.map(event => (
                  <EventCard
                    key={event.event_id}
                    event={event}
                    selectedIds={selectedIds}
                    onToggle={toggleEvent}
                  />
                ))}
              </div>
            </>
          )}

          {/* SUBMIT */}
          <div className="proceed-btn-wrapper">
            <button
              className="proceed-btn"
              disabled={selectedIds.length === 0 || status.submitting}
              onClick={handleProceed}
            >
              {status.submitting ? "Processing..." : "Proceed →"}
            </button>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}

// ================= EVENT CARD =================
function EventCard({ event, selectedIds, onToggle }) {
  const isSelected = selectedIds.includes(event.event_id);
  const isMaxReached = selectedIds.length >= 3 && !isSelected;

  return (
    <label className={`event-select-card ${isSelected ? "selected" : ""}`}>
      <input
        type="checkbox"
        checked={isSelected}
        disabled={isMaxReached}
        onChange={() => onToggle(event.event_id)}
      />
      <img
        src={event.image}
        alt={event.event_name}
        onError={(e) => {
          if (e.target.src.includes("placeholder.png")) return; // Prevent loop
          e.target.src = "/placeholder.png";
        }}
      />
      <h3>{event.event_name}</h3>
      <p className="event-category">{event.category}</p>
      <p className="event-fee">₹{event.price}</p>
    </label>
  );
}

export default RegisterEvents;
