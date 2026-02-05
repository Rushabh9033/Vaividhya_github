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


          {/* SPEAKER PROFILE (For Workshops) */}
          {event.speaker && (
            <div className="event-section">
              <h2>Speaker Profile</h2>
              <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-blue-900">{event.speaker.name}</h3>
                <p className="font-semibold text-gray-700 mb-2">{event.speaker.designation}</p>

                <div className="mb-4">
                  <h4 className="font-bold text-gray-800">Academic Background:</h4>
                  <ul className="list-disc ml-5 text-gray-700">
                    {event.speaker.academic.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-gray-800">About the Speaker:</h4>
                  <p className="text-gray-700">{event.speaker.about}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-gray-800">Workshop Focus:</h4>
                  <p className="text-gray-700">{event.speaker.focus}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-bold text-gray-800">Teaching Philosophy:</h4>
                  <p className="text-gray-700 italic">"{event.speaker.philosophy}"</p>
                </div>

                <div className="mt-4 p-4 rounded border border-blue-500/30 bg-blue-900/20">
                  <p className="text-blue-200 font-serif text-lg text-center italic">"{event.speaker.quote}"</p>
                </div>

              </div>
            </div>
          )}

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
