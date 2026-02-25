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
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // ✅ Events requested to be disabled/greyed out
  const DISABLED_EVENTS = [];

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

  // ================= LOAD EVENTS FROM LOCAL DATA (NOW MERGED WITH DB) =================
  useEffect(() => {
    if (!userId) {
      navigate("/register");
      return;
    }

    async function loadEvents() {
      try {
        // Fetch from Database
        const response = await fetch(API.EVENTS);
        if (!response.ok) throw new Error("Failed to load events");
        const dbEvents = await response.json();

        // Map backend prices while keeping local images
        const mappedEvents = dbEvents.map(dbEvent => {
          // Find matching local event for the poster image
          const localMatch = eventsData.find(e =>
            e.slug === dbEvent.event_id ||
            String(e.id) === String(dbEvent.event_id) ||
            e.name === dbEvent.event_name
          );

          return {
            event_id: dbEvent.event_id,
            event_name: dbEvent.event_name,
            category: dbEvent.category,
            // Favor DB price (checking both price and fee keys)
            price: dbEvent.price !== undefined ? dbEvent.price : (dbEvent.fee || 0),
            image: localMatch ? localMatch.poster : "/placeholder.png"
          };
        });

        // Also add any local events that are NOT in the database yet (fallback)
        const dbIds = dbEvents.map(e => e.event_id);
        const missingLocalEvents = eventsData.filter(e => !dbIds.includes(e.slug)).map(e => ({
          event_id: e.slug,
          event_name: e.name,
          category: e.category,
          price: e.fee || 0,
          image: e.poster
        }));

        setEvents([...mappedEvents, ...missingLocalEvents]);
        setStatus({ loading: false, error: null, submitting: false });

      } catch (err) {
        console.error("Using fallback local data due to error:", err);
        // Fallback to purely local if DB fails
        const fallbackEvents = eventsData.map(e => ({
          event_id: e.slug,
          event_name: e.name,
          category: e.category,
          price: e.fee || 0,
          image: e.poster
        }));
        setEvents(fallbackEvents);
        setStatus({ loading: false, error: null, submitting: false });
      }
    }

    loadEvents();

  }, [userId, navigate]);



  // ================= FILTER EVENTS =================
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.event_name.toLowerCase().includes(searchQuery.toLowerCase());
    const isTech = TECHNICAL_CATEGORIES.includes(e.category);

    let matchesCategory = true;
    if (categoryFilter === "TECHNICAL") matchesCategory = isTech;
    if (categoryFilter === "NON_TECHNICAL") matchesCategory = !isTech;

    return matchesSearch && matchesCategory;
  });

  const technicalEvents = filteredEvents.filter(
    e => TECHNICAL_CATEGORIES.includes(e.category)
  );

  const nonTechnicalEvents = filteredEvents.filter(
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

          {/* SEARCH & FILTER UI */}
          <div className="registration-filters">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search events (e.g. Robo, AI)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              <button
                className={categoryFilter === "ALL" ? "active" : ""}
                onClick={() => setCategoryFilter("ALL")}
              >
                All
              </button>
              <button
                className={categoryFilter === "TECHNICAL" ? "active" : ""}
                onClick={() => setCategoryFilter("TECHNICAL")}
              >
                Technical
              </button>
              <button
                className={categoryFilter === "NON_TECHNICAL" ? "active" : ""}
                onClick={() => setCategoryFilter("NON_TECHNICAL")}
              >
                Non-Technical
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 max-w-2xl mx-auto rounded-r-lg shadow-sm" style={{ color: "#856404" }}>
            <p className="font-bold">🎉 Offers & Rules</p>
            <ul className="list-disc ml-5">
              <li>Max 3 Technical & 2 Non-Technical Events</li>
              <li>Discount applied for 3+ events (-₹30)</li>
            </ul>
          </div>

          {/* EMPTY STATE */}
          {technicalEvents.length === 0 && nonTechnicalEvents.length === 0 && (
            <div className="no-events-found">
              <i className="fas fa-search"></i>
              <h3>No events found matching "{searchQuery}"</h3>
              <p>Try searching for a different keyword or changing the category filter.</p>
              <button
                className="clear-search-btn"
                onClick={() => { setSearchQuery(""); setCategoryFilter("ALL"); }}
              >
                Clear Filters
              </button>
            </div>
          )}
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
                    isPermanentlyDisabled={DISABLED_EVENTS.includes(event.event_id)}
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
                    isPermanentlyDisabled={DISABLED_EVENTS.includes(event.event_id)}
                  />
                ))}
              </div>
            </>
          )}

          {/* SUBMIT */}
          <div className="proceed-btn-wrapper">
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#00e5ff" }}>Total: ₹{finalTotal}</span>
              {discount > 0 && <span style={{ marginLeft: "10px", color: "#22c55e", fontSize: "0.9rem" }}>(₹30 Discount Applied)</span>}
            </div>
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
function EventCard({ event, selectedIds, onToggle, isPermanentlyDisabled }) {
  const isSelected = selectedIds.includes(event.event_id);

  // Fix: Check against MAX TOTAL (5), logic handles category splits
  const isMaxReached = selectedIds.length >= 5 && !isSelected;
  const isDisabled = isMaxReached || isPermanentlyDisabled;

  return (
    <label className={`event-select-card ${isSelected ? "selected" : ""} ${isPermanentlyDisabled ? "permanently-disabled" : ""}`}>
      <input
        type="checkbox"
        checked={isSelected}
        disabled={isDisabled}
        onChange={() => !isPermanentlyDisabled && onToggle(event.event_id, event.category)}
      />
      <img
        src={event.image}
        alt={event.event_name}
        style={isPermanentlyDisabled ? { filter: "grayscale(100%) opacity(0.5)" } : {}}
        onError={(e) => {
          if (e.target.src.includes("placeholder.png")) return; // Prevent loop
          e.target.src = "/placeholder.png";
        }}
      />
      <h3 style={isPermanentlyDisabled ? { color: "#64748b" } : {}}>{event.event_name}</h3>
      <p className="event-category">{event.category}</p>
      <p className="event-fee">
        {isPermanentlyDisabled ? "Closed" : (event.price == 0 ? "Free" : `₹${event.price}`)}
      </p>
    </label>
  );
}

export default RegisterEvents;
