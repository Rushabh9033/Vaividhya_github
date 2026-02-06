import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API } from "../config/api";
import showToast from "../components/Toast";

function SearchReceipt() {
  const [enrollment, setEnrollment] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct Search via Backend instead of unreliable localStorage
      const response = await fetch(`${API.REGISTRATIONS}/enrollment/${enrollment}`);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("currentUserId", data._id);
        navigate("/register/receipt");
      } else {
        showToast("No registration found for this enrollment number.", "error");
      }
    } catch (err) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
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
            <button type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default SearchReceipt;
