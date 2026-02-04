import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import eventDetailsData from "../data/eventDetailsData";


function EventDetails() {
  const { eventId } = useParams();
  const event = eventDetailsData[eventId];

  if (!event) {
    return (
      <>
        <Navbar />
        <section className="event-details-page">
          <div className="event-details-container">
            <h1>Event Not Found</h1>
            <p>The event details are not available.</p>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="event-details-page">
        <div className="event-details-container">

          {/* EVENT HERO */}
<div className="event-hero">

  <div className="event-hero-poster">
    <img
      src={event.poster || "/placeholder.png"}
      alt={event.name}
    />
  </div>

  <div className="event-hero-content">
    <h1 className="event-title">{event.name}</h1>
    <p className="event-tagline">“{event.tagline}”</p>

    <div className="event-meta">
      <span className="event-fee">₹ {event.fee}</span>
    </div>
<a
  href={`/register?event=${eventId}`}
  className="event-register-btn"
>
  Register Now
</a>

  </div>

</div>


          {/* ABOUT */}
          <div className="event-section">
            <h2>About Event</h2>
            <p>{event.about}</p>
          </div>

          {/* REGISTRATION */}
          <div className="event-section">
            <h2>Registration Details</h2>
            <p>{event.registration}</p>
          </div>

          {/* RULES */}
          <div className="event-section">
            <h2>Rules & Regulations</h2>
            <ul>
              {event.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          {/* ROUNDS */}
          <div className="event-section">
            <h2>Rounds</h2>
            <ul>
              {event.rounds.map((round, index) => (
                <li key={index}>{round}</li>
              ))}
            </ul>
          </div>

          {/* VENUE */}
          <div className="event-section">
            <h2>Venue & Timings</h2>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Time:</strong> {event.time}</p>
          </div>

          {/* PRIZES */}
          <div className="event-section">
            <h2>Prizes</h2>
            <p>{event.prizes}</p>
          </div>

          {/* COORDINATORS */}
          <div className="event-section">
            <h2>Faculty Coordinator</h2>
            <p>{event.facultyCoordinator}</p>

            <h2>Student Coordinators</h2>
            <ul>
              {event.studentCoordinators.map((student, index) => (
                <li key={index}>{student}</li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="event-section">
            <h2>Contact</h2>
            <p>{event.contact}</p>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}


export default EventDetails;
