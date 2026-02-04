import adreanaPoster from "../assets/ADARENA.jpeg";
import bgmiposter from "../assets/BGMI.jpeg"
import freefire from "../assets/FREEFIREPRO.png"

function EventsSection() {
  return (
    <section className="events-preview" id="events">
      <h2 className="section-title">
        Featured <span>Events</span>
      </h2>

      <div className="event-cards">
        {/* EVENT CARD 1 */}
        <div className="event-card">
          <img src={adreanaPoster} alt="ADRENA Event Poster" />

          <div className="event-info">
            <h3>ADRENA</h3>
            <p>Adventure & Action Event</p>

            <a href="/events" className="event-btn">
              View Details
            </a>
          </div>
        </div>

        {/* PLACEHOLDER CARDS (you can duplicate later) */}
        <div className="event-card">
    <img src={bgmiposter} alt="BGMI Event Poster" />
    <div className="event-info">
      <h3>BGMI</h3>
      <p>Battle Royale Gaming Event</p>
      <a href="/events" className="event-btn">View Details</a>
    </div>
  </div>

        <div className="event-card">
    <img src={freefire} alt="BGMI Event Poster" />
    <div className="event-info">
      <h3>FREE FIRE PRO</h3>
      <p>PRO Gaming Event</p>
      <a href="/events" className="event-btn">View Details</a>
    </div>
  </div>
      </div>

      {/* VIEW ALL CTA */}
      <div className="events-cta">
        <a href="/events" className="view-all-btn">
          View All Events →
        </a>
      </div>
    </section>
  );
}

export default EventsSection;
