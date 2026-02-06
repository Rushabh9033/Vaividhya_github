import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import eventsData from "../data/eventsData";
import { API } from "../config/api";
import FALLBACK_IMAGE from "../assets/poster.jpg";

function Events() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

  // Filter Logic
  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "All" || event.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      <section className="events-page">
        {/* HEADER & SEARCH */}
        <div className="events-header-container">
          <h1 className="page-title">Explore <span>Events</span></h1>

          <div className="event-search-container">
            <input
              type="text"
              placeholder="Search for events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />

            <div className="filter-buttons">
              {["All", "Technical", "Non-Technical"].map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${category === cat ? "active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* EVENTS GRID */}
        <div className="events-block">
          {filteredEvents.length > 0 ? (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.slug}`}
                  className="event-card-link"
                >
                  <div className="event-card">
                    <img
                      src={event.poster || FALLBACK_IMAGE}
                      alt={event.name}
                      onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                    />

                    <div className="event-info">
                      <h3>{event.name}</h3>
                      <p className="event-category-badge">{event.category}</p>
                      <span className="fee">
                        {event.fee === 0 || event.fee === "FREE EVENT" ? "FREE" : `₹${event.fee}`}
                      </span>

                      <button className="event-btn">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No events found matching your search.</h3>
              <button
                className="reset-btn"
                onClick={() => { setSearchQuery(""); setCategory("All"); }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

      </section>

      <Footer />
    </>
  );
}

/* ✅ THIS LINE IS CRITICAL */
export default Events;