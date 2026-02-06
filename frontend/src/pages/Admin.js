import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Admin() {
  const [regId, setRegId] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const ADMIN_PASSWORD = "vaividhya2026"; // demo password

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthorized(true);
      setError("");
    } else {
      setError("Invalid admin password");
    }
  }

  function handleSearch() {
    const stored = JSON.parse(localStorage.getItem("registration"));

    if (!stored || stored.regId !== regId) {
      setError("Registration ID not found");
      setData(null);
    } else {
      setData(stored);
      setError("");
    }
  }

  function markAsPaid() {
    const updated = {
      ...data,
      paymentStatus: "PAID"
    };

    localStorage.setItem("registration", JSON.stringify(updated));
    setData(updated);
  }

  return (
    <>
      <Navbar />

      <div className="admin-wrapper">

        {!authorized ? (
          <div className="admin-card">
            <h2>Admin Login</h2>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            {error && <p className="error">{error}</p>}
          </div>
        ) : (
          <div className="admin-card">
            <h2>Payment Verification</h2>

            <input
              placeholder="Enter Registration ID"
              value={regId}
              onChange={(e) => setRegId(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>

            {error && <p className="error">{error}</p>}

            {data && (
              <div className="admin-details">
                <p><strong>Name:</strong> {data.name}</p>
                <p><strong>Total Amount:</strong> ₹{data.totalAmount}</p>
                <p><strong>Status:</strong> {data.paymentStatus}</p>

                {data.paymentStatus === "UNPAID" && (
                  <button className="paid-btn" onClick={markAsPaid}>
                    Mark as PAID
                  </button>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}

export default Admin;
