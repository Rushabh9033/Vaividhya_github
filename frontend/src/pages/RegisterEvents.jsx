import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import eventsData from "../data/eventsData";
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
    "Technical", // Added to catch generic technical events
    "Robotics",
    "Coding",
    "Artificial Intelligence",
    "Cybersecurity",
    "Physics",
    "Engineering"
  ];

  // ================= LOAD EVENTS FROM LOCAL DATA =================
  // Users requested to use the same logic as Events page (which uses local data)
  // This guarantees images load and we send the correct SLUG to backend.
  useEffect(() => {
    if (!userId) {
      navigate("/register");
      return;
    }

    // Map local eventsData to the structure expected by this component
    const mappedEvents = eventsData.map(e => ({
      event_id: e.slug,       // USE SLUG AS ID (Matches backend seed)
      event_name: e.name,
      category: e.category,
      price: e.fee,
      image: e.poster         // Direct image usage (Guaranteed to work)
    }));

    setEvents(mappedEvents);
    setStatus({ loading: false, error: null, submitting: false });

  }, [userId, navigate]);



  // ================= FILTER EVENTS =================
  const technicalEvents = events.filter(
    e => TECHNICAL_CATEGORIES.includes(e.category)
  );

  const nonTechnicalEvents = events.filter(
    e => !TECHNICAL_CATEGORIES.includes(e.category)
  );

  // ================= TOGGLE SELECTION =================
  function toggleEvent(eventId, category) {
    setSelectedIds(prev => {
      // 1. Uncheck: Always allow
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      }

      // 2. Count current selections by category
      const currentEvents = events.filter(e => prev.includes(e.event_id));
      const techCount = currentEvents.filter(e => TECHNICAL_CATEGORIES.includes(e.category)).length;
      const nonTechCount = currentEvents.filter(e => !TECHNICAL_CATEGORIES.includes(e.category)).length;
      const isTech = TECHNICAL_CATEGORIES.includes(category);

      // 3. Validation Rules
      if (prev.length >= 5) {
        showToast("Maximum 5 events total.", "warning");
        return prev;
      }

      if (isTech && techCount >= 3) {
        showToast("Maximum 3 Technical events allowed.", "warning");
        return prev;
      }

      if (!isTech && nonTechCount >= 2) {
        showToast("Maximum 2 Non-Technical events allowed.", "warning");
        return prev;
      }

      // 4. Proceed
      return [...prev, eventId];
    });
  }

  // ================= CALCULATE TOTALS =================
  const selectedEventsList = events.filter(e => selectedIds.includes(e.event_id));
  const rawTotal = selectedEventsList.reduce((sum, e) => sum + (e.price || 0), 0);
  const discount = selectedIds.length >= 3 ? 30 : 0;
  const finalTotal = Math.max(0, rawTotal - discount);

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
          body: JSON.stringify({
            events: selectedIds,
            // Pass calculated amount just in case backend needs it, 
            // though backend usually recalculates.
            // But frontend display is key here.
          })
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

      <section className="event-selection-page" style={{ paddingBottom: "100px" }}>
        <div className="event-selection-container">

          <h1>Select Your Events</h1>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 max-w-2xl mx-auto">
            <p className="font-bold">🎉 Offers & Rules</p>
            <ul className="list-disc ml-5">
              <li>Max 3 Technical & 2 Non-Technical Events</li>
              <li>Discount applied for 3+ events (-₹30)</li>
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

          {/* FIXED BOTTOM BAR */}
          <div className="fixed-bottom-bar">
            <div className="total-display">
              <span className="text-lg">Selected: {selectedIds.length}</span>
              <div className="price-stack">
                {discount > 0 && <span className="original-price">₹{rawTotal}</span>}
                <span className="final-price">₹{finalTotal}</span>
                {discount > 0 && <span className="discount-badge text-xs bg-green-500 text-white px-1 rounded">-₹30</span>}
              </div>
            </div>
            <button
              className="proceed-btn-small"
              disabled={selectedIds.length === 0 || status.submitting}
              onClick={handleProceed}
            >
              {status.submitting ? "..." : "Proceed →"}
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

  // Fix: Check against MAX TOTAL (5), logic handles category splits
  const isMaxReached = selectedIds.length >= 5 && !isSelected;
  const isDisabled = isMaxReached;

  return (
    <label className={`event-select-card ${isSelected ? "selected" : ""}`}>
      <input
        type="checkbox"
        checked={isSelected}
        disabled={isDisabled}
        onChange={() => onToggle(event.event_id, event.category)}
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
      <p className="event-fee">
        {event.price == 0 ? "Free" : `₹${event.price}`}
      </p>
    </label>
  );
}

export default RegisterEvents;
