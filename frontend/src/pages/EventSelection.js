import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const EVENTS = [
  { id: 1, name: "AI Quiz", category: "Technical", department: "CSE", fee: 100 },
  { id: 2, name: "Robotics Challenge", category: "Technical", department: "ME", fee: 200 },
  { id: 3, name: "Hackathon", category: "Technical", department: "IT", fee: 150 },
  { id: 4, name: "Poster Presentation", category: "Non-Technical", department: "General", fee: 50 },
  { id: 5, name: "Photography Contest", category: "Non-Technical", department: "Media", fee: 50 }
];

function EventSelection() {
  const navigate = useNavigate();
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("registration");
    if (!stored) {
      navigate("/register");
    }
  }, [navigate]);

  function toggleEvent(event) {
    let updatedEvents;

    if (selectedEvents.find(e => e.id === event.id)) {
      updatedEvents = selectedEvents.filter(e => e.id !== event.id);
    } else {
      updatedEvents = [...selectedEvents, event];
    }

    setSelectedEvents(updatedEvents);
    calculateTotal(updatedEvents);
  }

  function calculateTotal(events) {
    const total = events.reduce((sum, e) => sum + e.fee, 0);
    setTotalAmount(total);
  }

  function handleProceed() {
    const stored = JSON.parse(localStorage.getItem("registration"));

    const updatedRegistration = {
      ...stored,
      events: selectedEvents,
      totalAmount: totalAmount
    };

    localStorage.setItem("registration", JSON.stringify(updatedRegistration));
    navigate("/register/receipt");
  }

  return (
    <>
      <Navbar />

      <div className="event-wrapper">
        <h2 className="event-title">Select Your Events</h2>

        <div className="event-grid">
          {EVENTS.map(event => (
            <div
              key={event.id}
              className={`event-card ${
                selectedEvents.find(e => e.id === event.id) ? "selected" : ""
              }`}
              onClick={() => toggleEvent(event)}
            >
              <h3>{event.name}</h3>
              <p>{event.category}</p>
              <p>Department: {event.department}</p>
              <span>₹{event.fee}</span>
            </div>
          ))}
        </div>

        <div className="event-summary">
          <p>Selected Events: {selectedEvents.length}</p>
          <p>Total Amount: ₹{totalAmount}</p>

          <button
            disabled={selectedEvents.length === 0}
            onClick={handleProceed}
          >
            Proceed to Receipt →
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default EventSelection;
