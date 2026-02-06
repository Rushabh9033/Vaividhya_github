import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import eventsData from "../data/eventsData";
import { API } from "../config/api";
import showToast from "../components/Toast";

// ✅ Define technical categories (backend-compatible)
const TECHNICAL_CATEGORIES = [
  "Technical",
  "Robotics",
  "Coding",
  "Artificial Intelligence",
  "Cybersecurity",
  "Physics",
  "Engineering"
];

// 🚫 Restricted Events (Greyed Out)
const RESTRICTED_EVENTS = [
  "free-fire-pro",
  "mystic-mover",
  "web-treasure-hunting",
  "ludo-king",
  "real-life-among-us",
  "ai-shape-cipher",
  "bgmi",
  "logo-hunt",
  "word-wizard-english",
  "squid-game",
  "robo-mind-matrix",
  "break-the-bot",
  "treasure-hunt",
  "escape-room",
  "reverse-coding",
  "ai-quiz"
];

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

  // ================= LOAD EVENTS FROM LOCAL DATA =================
  useEffect(() => {
    if (!userId) {
      navigate("/register");
      return;
    }

    const mappedEvents = eventsData.map(e => ({
      event_id: e.slug,
      event_name: e.name,
      category: e.category,
      price: e.fee,
      image: e.poster
    }));

    setEvents(mappedEvents);
    setStatus({ loading: false, error: null, submitting: false });
  }, [userId, navigate]);

  // ================= CATEGORY COUNTS =================
  const selectedEvents = events.filter(e => selectedIds.includes(e.event_id));
  const techCount = selectedEvents.filter(e => TECHNICAL_CATEGORIES.includes(e.category)).length;
  const nonTechCount = selectedIds.length - techCount;

  // ================= FILTER EVENTS FOR UI =================
  const technicalList = events.filter(e => TECHNICAL_CATEGORIES.includes(e.category));
  const nonTechnicalList = events.filter(e => !TECHNICAL_CATEGORIES.includes(e.category));

  // ================= TOGGLE SELECTION =================
  function toggleEvent(eventId, eventCategory) {
    const isSelected = selectedIds.includes(eventId);
    const isTech = TECHNICAL_CATEGORIES.includes(eventCategory);

    if (isSelected) {
      setSelectedIds(prev => prev.filter(id => id !== eventId));
      return;
    }

    // Validation
    if (selectedIds.length >= 5) {
      showToast("Maximum 5 events total allowed.", "warning");
      return;
    }

    if (isTech && techCount >= 3) {
      showToast("Maximum 3 Technical events allowed.", "warning");
      return;
    }

    if (!isTech && nonTechCount >= 2) {
      showToast("Maximum 2 Non-Technical events allowed.", "warning");
      return;
    }

    setSelectedIds(prev => [...prev, eventId]);
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

  if (status.loading) return <div className="text-center p-20 text-xl font-bold">Loading Events...</div>;
  if (status.error) return <div className="text-center p-20 text-red-600">{status.error}</div>;

  return (
    <>
      <Navbar />
      <section className="event-selection-page">
        <div className="event-selection-container">
          <h1>Select Your Events</h1>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 max-w-2xl mx-auto">
            <p className="font-bold">🎉 Offers & Rules</p>
            <ul className="list-disc ml-5">
              <li>Maximum 5 events total</li>
              <li>Max 3 Technical + 2 Non-Technical</li>
              <li>Discount applied for 3+ events (-₹30)</li>
            </ul>
          </div>

          <EventSection
            title="Technical Events"
            events={technicalList}
            selectedIds={selectedIds}
            restrictedIds={RESTRICTED_EVENTS}
            onToggle={toggleEvent}
            isLimitReached={techCount >= 3}
            isMaxReached={selectedIds.length >= 5}
          />

          <EventSection
            title="Non-Technical Events"
            events={nonTechnicalList}
            selectedIds={selectedIds}
            restrictedIds={RESTRICTED_EVENTS}
            onToggle={toggleEvent}
            isLimitReached={nonTechCount >= 2}
            isMaxReached={selectedIds.length >= 5}
          />

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

function EventSection({ title, events, selectedIds, restrictedIds, onToggle, isLimitReached, isMaxReached }) {
  if (events.length === 0) return null;
  return (
    <>
      <h2 className="event-category-title">{title}</h2>
      <div className="event-select-grid">
        {events.map(event => {
          const isSelected = selectedIds.includes(event.event_id);
          const isRestricted = restrictedIds.includes(event.event_id);
          const isDisabled = (!isSelected && (isMaxReached || isLimitReached || isRestricted));

          return (
            <label key={event.event_id} className={`event-select-card ${isSelected ? "selected" : ""} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onToggle(event.event_id, event.category)}
              />
              <img src={event.image} alt={event.event_name} onError={(e) => { e.target.src = "/placeholder.png"; }} />
              <h3>{event.event_name}</h3>
              <p className="event-category">{event.category}</p>
              <p className="event-fee">{event.price === 0 ? "Free" : `₹${event.price}`}</p>
            </label>
          );
        })}
      </div>
    </>
  );
}

export default RegisterEvents;
