import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { EVENT_IMAGES } from "../Events";
import eventsData from "../data/eventsData";
import { API } from "../config/api";

function Receipt() {
  const navigate = useNavigate();
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (!userId) {
      console.warn("No userId found in localStorage, redirecting to home.");
      navigate("/");
      return;
    }

    async function fetchReceipt() {
      try {
        console.log("Fetching receipt for user ID:", userId);
        const response = await fetch(`${API.REGISTRATIONS}/${userId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Registration record not found.");
          }
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.detail || "Failed to load receipt details.");
        }

        const data = await response.json();
        console.log("Successfully fetched receipt data.");
        setReceiptData(data);
      } catch (err) {
        console.error("Receipt error:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchReceipt();
  }, [navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="fw-bold text-secondary">Preparing Your Entry Pass...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center p-4 bg-white">
        <div className="mb-4 bg-danger-subtle p-3 rounded-circle">
          <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
        </div>
        <h2 className="fw-bold text-dark mb-2">Display Error</h2>
        <p className="text-muted mb-4 max-w-lg mx-auto">{error}</p>
        <button onClick={() => navigate("/")} className="btn btn-primary px-5 py-2 rounded-pill shadow-sm">
          Back to Registration
        </button>
      </div>
    );
  }

  if (!receiptData) {
    return (
      <div className="text-center p-5">
        <p>No data available.</p>
        <button onClick={() => navigate("/")} className="btn btn-link">Go Home</button>
      </div>
    );
  }

  // Safe destructuring with nested defaults to prevent "cannot read property of undefined" crashes (ROOT FIX)
  const {
    full_name = "Registrant",
    enrollment_no = "N/A",
    email = "N/A",
    phone = "N/A",
    college = "N/A",
    department = "N/A",
    year = "N/A",
    event_details = [],
    total_amount = 0,
    payment_status = "PENDING",
    _id = "",
    approved_by = null,
    approved_at = null
  } = receiptData;

  return (
    <div className="receipt-page-wrapper bg-light min-vh-100">
      <div className="d-print-none">
        <Navbar />
      </div>

      <div className="container py-4 py-md-5">
        <div
          id="printable-card"
          className="card shadow-lg border-0 mx-auto overflow-hidden"
          style={{ maxWidth: "800px", borderRadius: "15px" }}
        >
          {/* Header Section */}
          <div className="card-header bg-dark text-white p-4 border-0 d-flex justify-content-between align-items-center" style={{ borderBottom: "5px solid #ffc107 !important" }}>
            <div>
              <h2 className="fw-black mb-0 text-uppercase tracking-tighter">
                Vaividhya <span className="text-warning">2K26</span>
              </h2>
              <small className="text-white-50 text-uppercase fw-bold m-0" style={{ letterSpacing: "2px", fontSize: "0.65rem" }}>Entry Pass & Payment Invoice</small>
            </div>
            <div className="text-end d-none d-sm-block">
              <span className="badge bg-warning text-dark font-monospace px-3 py-2">
                ID: #{String(_id).slice(-6).toUpperCase() || "NEW"}
              </span>
            </div>
          </div>

          <div className="card-body p-4 p-md-5 bg-white">
            {/* Main Info Row */}
            <div className="row g-4 align-items-start">
              <div className="col-md-8">
                <div className="mb-4 pb-2 border-bottom">
                  <h6 className="text-muted text-uppercase fw-bold small mb-3">Student Information</h6>
                  <div className="row g-3">
                    <div className="col-6">
                      <small className="text-muted d-block uppercase fs-xs fw-bold">Name</small>
                      <span className="fw-bold fs-5 text-dark">{full_name}</span>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block uppercase fs-xs fw-bold">Enrollment</small>
                      <span className="fw-bold fs-5 text-dark text-uppercase">{enrollment_no}</span>
                    </div>
                    <div className="col-12 mt-3">
                      <small className="text-muted d-block uppercase fs-xs fw-bold">College & Department</small>
                      <span className="text-secondary">{college}</span>
                      <div className="small text-muted">{department} • {year} Year</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h6 className="text-muted text-uppercase fw-bold small mb-3">Selected Events ({event_details?.length || 0})</h6>
                  <div className="list-group list-group-flush border rounded overflow-hidden shadow-sm">
                    {event_details?.map((event, index) => {
                      const normalize = (s) => String(s || "").toLowerCase().trim();
                      const localLogo = eventsData.find(e =>
                        normalize(e.slug) === normalize(event.event_id) ||
                        normalize(e.name) === normalize(event.event_name)
                      )?.poster;

                      return (
                        <div key={index} className="list-group-item d-flex align-items-center p-3">
                          <img
                            src={localLogo || EVENT_IMAGES[event.event_id] || EVENT_IMAGES["DEFAULT"]}
                            alt=""
                            className="rounded border"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            onError={(e) => { e.target.src = EVENT_IMAGES["DEFAULT"]; }}
                          />
                          <div className="ms-3 flex-grow-1">
                            <div className="fw-bold text-dark">{event.event_name}</div>
                            <small className="text-muted text-uppercase" style={{ fontSize: "0.6rem" }}>{event.category || "Event"}</small>
                          </div>
                          <div className="fw-bold text-dark">₹{event.price}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* QR & Status Section */}
              <div className="col-md-4">
                <div className="card border-0 bg-light p-4 text-center h-100" style={{ borderRadius: "12px" }}>
                  <div className="bg-white p-2 rounded shadow-sm mb-4 mx-auto" style={{ width: "fit-content" }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${_id}`}
                      alt="Verification QR"
                      className="img-fluid rounded"
                      style={{ width: "140px", mixBlendMode: "multiply" }}
                    />
                  </div>

                  <div className="status-badge mb-3">
                    {payment_status === "PAID" ? (
                      <div>
                        <span className="badge rounded-pill bg-success w-100 py-3 fs-6 shadow-sm mb-2">PAID</span>
                        {approved_by && (
                          <div className="text-center mt-3 pt-3 border-top border-secondary-subtle">
                            <small className="text-muted d-block fw-bold uppercase" style={{ fontSize: "0.55rem" }}>Verified By</small>
                            <div className="fw-bold text-dark small">{approved_by}</div>
                            <div className="text-muted" style={{ fontSize: "0.6rem" }}>
                              {approved_at ? new Date(approved_at).toLocaleString() : ""}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="badge rounded-pill bg-danger w-100 py-3 fs-6 shadow-sm">PENDING</span>
                    )}
                  </div>
                  <small className="text-muted text-uppercase fw-bold" style={{ fontSize: "0.5rem", letterSpacing: "1px" }}>
                    Status checked at {new Date().toLocaleTimeString()}
                  </small>
                </div>
              </div>
            </div>

            {/* Total Footer */}
            <div className="mt-5 pt-4 border-top text-center">
              <div className="text-muted text-uppercase small fw-black mb-1">Total Fee Paid/Payable</div>
              <div className="display-4 fw-black text-dark font-monospace">₹{total_amount}</div>

              <div className="alert alert-warning border-0 mt-4 text-start font-medium" style={{ fontSize: "0.85rem", borderRadius: "10px" }}>
                <i className="bi bi-info-circle-fill me-2"></i>
                Please present this screen or a printed copy at the event entrance for verification.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 text-center d-print-none d-flex justify-content-center gap-3">
          <button onClick={() => navigate("/")} className="btn btn-outline-dark px-5 py-2 rounded-pill fw-bold">
            Home
          </button>
          <button onClick={handlePrint} className="btn btn-dark px-5 py-2 rounded-pill fw-bold shadow">
            Download PDF / Print
          </button>
        </div>
      </div>

      <div className="d-print-none mt-5">
        <Footer />
      </div>

      <style>
        {`
          .fw-black { font-weight: 900 !important; }
          .tracking-tighter { letter-spacing: -0.05em; }
          .fs-xs { fontSize: 0.65rem; }
          
          @media print {
            body { background: white !important; }
            .d-print-none { display: none !important; }
            #printable-card { 
              box-shadow: none !important; 
              border: 1px solid #eee !important;
              width: 100% !important;
              margin: 0 !important;
              position: absolute;
              top: 0;
              left: 0;
            }
            .card-header { background-color: #212529 !important; color: white !important; -webkit-print-color-adjust: exact; }
          }
        `}
      </style>
    </div>
  );
}

export default Receipt;
