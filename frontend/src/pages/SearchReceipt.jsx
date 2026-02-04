import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function SearchReceipt() {
  const [enrollment, setEnrollment] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();

    const allRegistrations =
      JSON.parse(localStorage.getItem("allRegistrations")) || [];

    const found = allRegistrations.find(
      reg => reg.enrollment === enrollment
    );

    if (!found) {
      setError("No registration found for this enrollment number.");
      return;
    }

    // ✅ Store full receipt data and redirect
    localStorage.setItem("registration", JSON.stringify(found));
    setError("");
    navigate("/receipt");
  }

  return (
    <>
      <Navbar />

      <section className="search-receipt-page">
        <div className="search-receipt-container">

          <h1>Find Your Receipt</h1>
          <p>Enter your enrollment number to view your receipt</p>

          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Enter Enrollment Number"
              value={enrollment}
              onChange={e => setEnrollment(e.target.value)}
              required
            />
            <button type="submit">Search</button>
          </form>

          {error && <p className="error-text">{error}</p>}

        </div>
      </section>

      <Footer />
    </>
  );
}

export default SearchReceipt;
