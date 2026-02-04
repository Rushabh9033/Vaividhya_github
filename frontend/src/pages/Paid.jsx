import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { EVENT_IMAGES } from "../Events";
import { API } from "../config/api";



function Paid() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- AUTH STATE ---
  // Initialize state based on localStorage to persist login across refreshes
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("is_adminnn") === "true";
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // --- DATA STATES ---
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // --- 1. HANDLE LOGIN ---
  // --- 1. HANDLE LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!usernameInput || !passwordInput) {
      setAuthError("Please enter both username and password");
      return;
    }

    try {
      const response = await fetch(`${API.ADMIN}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("is_adminnn", "true");
        localStorage.setItem("admin_username", data.username);
        setIsAdmin(true);
        setAuthError("");
      } else {
        setAuthError(data.detail || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setAuthError("Login failed. Check server connection.");
    }
  };

  // --- 2. FETCH DATA (Only runs if Admin is logged in) ---
  useEffect(() => {
    if (!isAdmin) return; // Skip fetching if not authenticated

    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");

    if (!userId) {
      setError("No User ID found in URL.");
      setLoading(false);
      return;
    }

    async function fetchReceipt() {
      try {
        const response = await fetch(`${API.REGISTRATIONS}/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch receipt details.");
        const data = await response.json();
        setReceiptData(data);
      } catch (err) {
        console.error(err);
        setError("Could not load receipt. Please check the ID and try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchReceipt();
  }, [location.search, isAdmin]); // Re-run effect when isAdmin becomes true

  // --- HANDLER: MARK PAID ---
  const handleMarkPaid = async () => {
    if (!receiptData) return;
    setUpdating(true);
    const id = receiptData._id;

    try {
      const response = await fetch(
        `${API.REGISTRATIONS}/${id}/mark-paid`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            admin_name: localStorage.getItem("admin_username") || "Admin",
            admin_dept: localStorage.getItem("admin_username") || "General"
          })
        }
      );

      if (!response.ok) throw new Error("Failed to mark as PAID");
      setReceiptData((prev) => ({ ...prev, payment_status: "PAID" }));

    } catch (err) {
      console.error("Error marking paid:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // --- HANDLER: MARK UNPAID ---
  const handleMarkUnpaid = async () => {
    if (!receiptData) return;
    setUpdating(true);
    const id = receiptData._id;

    try {
      const response = await fetch(
        `${API.REGISTRATIONS}/${id}/mark-unpaid`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to mark as UNPAID");
      setReceiptData((prev) => ({ ...prev, payment_status: "PENDING" }));

    } catch (err) {
      console.error("Error marking unpaid:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };


  // --- VIEW: LOGIN PROMPT (If not Admin) ---
  if (!isAdmin) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-dark text-white">
        <div className="card bg-secondary bg-opacity-25 p-4 shadow-lg border-secondary" style={{ maxWidth: '400px', width: '100%' }}>
          <h3 className="text-center mb-4"><i className="bi bi-shield-lock-fill me-2"></i>Admin Access</h3>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label text-white-50 small text-uppercase fw-bold">Team Name</label>
              <select
                className="form-select bg-dark text-white border-secondary"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                autoFocus
              >
                <option value="">-- Select Team --</option>
                <option value="TEAM1">Team 1</option>
                <option value="TEAM2">Team 2</option>
                <option value="TEAM3">Team 3</option>
                <option value="TEAM4">Team 4</option>
                <option value="TEAM5">Team 5</option>
                <option value="TEAM6">Team 6</option>
                <option value="TEAM7">Team 7</option>
                <option value="TEAM8">Team 8</option>
                <option value="TEAM9">Team 9</option>
                <option value="TEAM10">Team 10</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label text-white-50 small text-uppercase fw-bold">Password</label>
              <input
                type="password"
                className="form-control bg-dark text-white border-secondary"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="********"
              />
            </div>

            {authError && <div className="alert alert-danger py-2 small mb-3">{authError}</div>}

            <button type="submit" className="btn btn-primary w-100 fw-bold">
              <i className="bi bi-unlock-fill me-2"></i>Unlock
            </button>
          </form>

          <div className="text-center mt-3 border-top border-secondary pt-3">
            <button className="btn btn-link text-white-50 text-decoration-none btn-sm" onClick={() => navigate("/")}>
              &larr; Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: LOADING STATE ---
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // --- VIEW: ERROR STATE ---
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-danger fw-bold">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle display-1 mb-3"></i>
          <h3>{error}</h3>
          <button className="btn btn-outline-light mt-3" onClick={() => navigate("/")}>Go Home</button>
        </div>
      </div>
    );
  }

  if (!receiptData) return null;

  const {
    full_name, enrollment_no, email, phone, college, department, year,
    event_details, total_amount, payment_status, _id
  } = receiptData;

  // --- VIEW: MAIN CONTENT (If Admin & Loaded) ---
  return (
    <>
      <div className="d-print-none">
        <Navbar />
      </div>

      <div className="bg-dark min-vh-100 py-5">
        <div className="container">

          {/* LOGOUT BUTTON (Top Right) */}
          <div className="d-flex justify-content-end mb-3 d-print-none">
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                localStorage.removeItem("is_adminnn");
                setIsAdmin(false);
              }}
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout Admin
            </button>
          </div>

          {/* --- MAIN RECEIPT CARD --- */}
          <div className="card shadow-lg border-0 mx-auto" style={{ maxWidth: "850px" }}>

            {/* HEADER */}
            <div className="card-header bg-black text-white p-4 d-flex justify-content-between align-items-center border-bottom border-secondary">
              <div>
                <h2 className="fw-bold mb-0 text-uppercase">
                  Vaividhya <span className="text-warning">2K26</span>
                </h2>
                <small className="text-white-50 letter-spacing-2">OFFICIAL ENTRY PASS</small>
              </div>
              <div className="text-end d-none d-sm-block">
                <small className="text-white-50 d-block">RECEIPT ID</small>
                <span className="font-monospace fw-bold fs-5">#{_id.slice(-6).toUpperCase()}</span>
              </div>
            </div>

            <div className="card-body p-4 p-md-5 bg-white">
              {/* INFO & QR ROW */}
              <div className="row mb-4">
                <div className="col-md-8">
                  <h5 className="border-bottom pb-2 mb-3 text-secondary">Student Details</h5>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="text-muted small fw-bold text-uppercase">Name</label>
                      <p className="fw-bold fs-5 mb-0 text-capitalize text-dark">{full_name}</p>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small fw-bold text-uppercase">Enrollment No</label>
                      <p className="fw-bold fs-5 mb-0 text-dark">{enrollment_no}</p>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small fw-bold text-uppercase">College</label>
                      <p className="mb-0 text-capitalize text-dark">{college}</p>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small fw-bold text-uppercase">Dept / Year</label>
                      <p className="mb-0 text-capitalize text-dark">{department} ({year})</p>
                    </div>
                    <div className="col-12 mt-3">
                      <label className="text-muted small fw-bold text-uppercase">Contact</label>
                      <p className="mb-0 text-dark">{email} | {phone}</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 text-center border-start-md mt-4 mt-md-0 d-flex flex-column justify-content-center align-items-center">
                  {payment_status === "PAID" ? (
                    <div className="badge bg-success text-white px-4 py-2 fs-6 border border-success">
                      <i className="bi bi-check-circle-fill me-2"></i>PAID
                    </div>
                  ) : (
                    <div className="badge bg-danger text-white px-4 py-2 fs-6 border border-danger">
                      <i className="bi bi-clock-history me-2"></i>PENDING
                    </div>
                  )}
                </div>
              </div>

              {/* EVENT LIST */}
              <div className="mt-5">
                <h5 className="border-bottom pb-2 mb-3 text-secondary d-flex align-items-center gap-2">
                  <i className="bi bi-ticket-perforated-fill"></i> Registered Events
                </h5>

                <div className="list-group list-group-flush">
                  {event_details && event_details.map((event) => {
                    const imageUrl = EVENT_IMAGES[event.event_id] || EVENT_IMAGES["DEFAULT"];

                    return (
                      <div key={event.event_id} className="list-group-item d-flex align-items-center p-3 border rounded mb-2 shadow-sm">
                        <div className="flex-shrink-0">
                          <img
                            src={imageUrl}
                            alt={event.event_name}
                            className="rounded"
                            style={{ width: "70px", height: "70px", objectFit: "cover" }}
                            onError={(e) => (e.target.src = EVENT_IMAGES["DEFAULT"])}
                          />
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h5 className="mb-1 fw-bold text-dark">
                            {event.event_name}
                            {event.price === 0 && (
                              <span className="badge bg-warning text-dark ms-2" style={{ fontSize: "0.7rem" }}>FREE</span>
                            )}
                          </h5>
                        </div>
                        <div className="text-end ms-3">
                          <span className="fs-5 fw-bold font-monospace text-dark">₹{event.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TOTAL */}
              <div className="row mt-4">
                <div className="col-12 text-end">
                  <p className="text-muted text-uppercase fw-bold small mb-0">Total Amount Payable</p>
                  <h1 className="text-primary fw-bold display-6">₹{total_amount}</h1>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top d-print-none">
                <button onClick={() => navigate("/")} className="btn btn-outline-secondary">
                  &larr; Back
                </button>
                <button onClick={() => window.print()} className="btn btn-dark">
                  <i className="bi bi-printer me-2"></i>Print Receipt
                </button>
              </div>

            </div>
          </div>

          {/* --- ADMIN / VOLUNTEER CONTROLS --- */}
          <div className="d-print-none text-center mt-5 mb-5">
            <div className="card bg-secondary bg-opacity-25 border-secondary mx-auto" style={{ maxWidth: "600px" }}>
              <div className="card-body">
                <h5 className="text-white mb-3">Volunteer Controls</h5>
                <div className="d-flex justify-content-center gap-3">

                  {/* Mark as PAID Button */}
                  <button
                    className={`btn ${payment_status === 'PAID' ? 'btn-success' : 'btn-outline-success'} btn-lg px-4`}
                    onClick={handleMarkPaid}
                    disabled={payment_status === 'PAID' || updating}
                  >
                    {updating && payment_status !== 'PAID' ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <i className="bi bi-check-lg me-2"></i>
                    )}
                    Mark as Paid
                  </button>

                  {/* Mark as UNPAID Button */}
                  <button
                    className={`btn ${payment_status !== 'PAID' ? 'btn-danger' : 'btn-outline-danger'} btn-lg px-4`}
                    onClick={handleMarkUnpaid}
                    disabled={payment_status !== 'PAID' || updating}
                  >
                    {updating && payment_status === 'PAID' ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <i className="bi bi-x-lg me-2"></i>
                    )}
                    Mark as Unpaid
                  </button>
                </div>

                {updating && <small className="text-info mt-2 d-block">Updating status...</small>}
                {!updating && <small className="text-white-50 mt-2 d-block">*Updates are saved to server immediately</small>}

              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="d-print-none">
        <Footer />
      </div>

      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .card, .card * { visibility: visible; }
            .card { position: absolute; left: 0; top: 0; width: 100%; border: 1px solid #000 !important; box-shadow: none !important; margin: 0 !important; }
            .bg-dark, .bg-black { background-color: white !important; color: black !important; }
            .text-white, .text-white-50, .text-light { color: black !important; }
            .d-print-none { display: none !important; }
          }
        `}
      </style>
    </>
  );
}

export default Paid;