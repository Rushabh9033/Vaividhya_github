import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { EVENT_IMAGES } from "../Events";
import eventsData from "../data/eventsData"; // Fix images
import { API } from "../config/api";

function Receipt() {
  const navigate = useNavigate();
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (!userId) {
      navigate("/");
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
        setError("Could not load receipt. Please try again.");
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
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 text-danger fw-bold">
        {error}
      </div>
    );
  }

  if (!receiptData) return null;

  const {
    full_name, enrollment_no, email, phone, college, department, year,
    event_details, payment_status, _id,
    approved_by, approved_at
  } = receiptData;

  // --- FRONTEND TOTAL CALCULATION ---
  // Calculate total because backend might return 0 after rollback
  const calculatedTotal = (event_details || []).reduce((sum, event) => {
    // Strictly use Database Prices
    const price = event.price !== undefined && event.price !== null ? event.price : (event.fee || 0);
    return sum + price;
  }, 0);

  const eventCount = (event_details || []).length;
  const discount = eventCount >= 3 ? 30 : 0;
  const finalAmount = Math.max(0, calculatedTotal - discount);

  return (
    <>
      <div className="d-print-none">
        <Navbar />
      </div>

      <div className="bg-light min-vh-100 py-5">
        <div className="container">

          {/* --- MAIN CARD (TARGET FOR PRINTING) --- */}
          {/* Added ID 'printable-card' to target this specifically */}
          <div id="printable-card" className="card shadow-lg border-0 mx-auto" style={{ maxWidth: "850px" }}>

            {/* 1. HEADER */}
            <div className="card-header bg-dark text-white p-4 d-flex justify-content-between align-items-center print-header">
              <div>
                <h2 className="fw-bold mb-0 text-uppercase">
                  Vaividhya <span className="text-warning">2K26</span>
                </h2>
                <small className="text-white-50 letter-spacing-2">OFFICIAL ENTRY PASS</small>
              </div>
              <div className="text-end d-none d-sm-block print-show">
                <small className="text-white-50 d-block">RECEIPT ID</small>
                <span className="font-monospace fw-bold fs-5 text-white">#{String(_id).slice(-6).toUpperCase()}</span>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">

              {/* 2. INFO & QR ROW */}
              <div className="row mb-4">

                {/* Student Details */}
                <div className="col-md-8">
                  <h5 className="border-bottom pb-2 mb-3 text-secondary">Student Details</h5>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label className="text-muted small fw-bold text-uppercase">Name</label>
                      <p className="fw-bold fs-5 mb-0 text-capitalize">{full_name}</p>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small fw-bold text-uppercase">Enrollment No</label>
                      <p className="fw-bold fs-5 mb-0">{enrollment_no}</p>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small fw-bold text-uppercase">College</label>
                      <p className="mb-0 text-capitalize">{college}</p>
                    </div>
                    <div className="col-sm-6">
                      <label className="text-muted small fw-bold text-uppercase">Dept / Year</label>
                      <p className="mb-0 text-capitalize">{department} ({year})</p>
                    </div>
                    <div className="col-12 mt-3">
                      <label className="text-muted small fw-bold text-uppercase">Contact</label>
                      <p className="mb-0">{email} | {phone}</p>
                    </div>
                  </div>
                </div>

                {/* QR Code & Status */}
                <div className="col-md-4 text-center border-start-md mt-4 mt-md-0 d-flex flex-column justify-content-center align-items-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${window.location.origin}/paid?userId=${_id}`}
                    alt="Entry QR"
                    className="img-thumbnail p-2 mb-3"
                    style={{ width: "120px" }}
                  />

                  {payment_status === "PAID" ? (
                    <div className="d-flex flex-column align-items-center">
                      <span className="badge rounded-pill bg-success px-4 py-2 fs-6 print-badge mb-2">PAID</span>
                      {approved_by && (
                        <div className="text-muted small border-top pt-2 mt-1 w-100">
                          <div><i className="bi bi-shield-check me-1"></i>Approved By:</div>
                          <strong className="d-block">{approved_by}</strong>
                          {approved_at && <div className="text-nowrap">{new Date(approved_at).toLocaleString()}</div>}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="badge rounded-pill bg-danger px-4 py-2 fs-6 print-badge mb-2">PENDING</span>
                  )}
                  <small className="text-muted d-block mt-2">Scan at Entry</small>
                </div>
              </div>
            </div>

            {/* 3. EVENT LIST */}
            <div className="mt-5">
              <h5 className="border-bottom pb-2 mb-3 text-secondary d-flex align-items-center gap-2">
                <i className="bi bi-ticket-perforated-fill"></i> Registered Events
              </h5>

              <div className="row g-3">
                {event_details && event_details.map((event) => {
                  // Robust Image Lookup (Matches RegisterEvents logic)
                  const normalize = (str) => String(str || "").toLowerCase().trim();

                  const localMatch = eventsData.find(e =>
                    normalize(e.id) === normalize(event.event_id) ||
                    normalize(e.slug) === normalize(event.event_id) ||
                    normalize(e.name) === normalize(event.event_name)
                  );

                  // Also try fuzzy lookup in EVENT_IMAGES
                  const fuzzyKey = Object.keys(EVENT_IMAGES).find(key => normalize(key) === normalize(event.event_id));
                  const fuzzyImage = fuzzyKey ? EVENT_IMAGES[fuzzyKey] : null;

                  const imageUrl = localMatch?.poster || EVENT_IMAGES[event.event_id] || fuzzyImage || EVENT_IMAGES["DEFAULT"];

                  // Strictly use Database Prices
                  const displayPrice = event.price !== undefined && event.price !== null ? event.price : (event.fee || 0);

                  return (
                    // Display each event compactly side-by-side in columns
                    <div key={event.event_id} className="col-12 col-md-6 break-avoid">
                      <div className="d-flex align-items-center p-2 border rounded shadow-sm h-100 bg-white">
                        <div className="flex-shrink-0">
                          <img
                            src={imageUrl}
                            alt={event.event_name}
                            className="rounded"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            onError={(e) => (e.target.src = EVENT_IMAGES["DEFAULT"])}
                          />
                        </div>

                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-0 fw-bold text-dark text-truncate" style={{ maxWidth: '140px' }} title={event.event_name}>
                            {event.event_name}
                          </h6>
                          {displayPrice === 0 && (
                            <span className="badge bg-warning text-dark mt-1" style={{ fontSize: "0.6rem" }}>FREE</span>
                          )}
                        </div>

                        <div className="text-end ms-2 pl-2 border-start">
                          <span className="fs-6 fw-bold font-monospace d-block ms-2">₹{displayPrice}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. TOTAL */}
            <div className="row mt-4 break-avoid text-center">
              <div className="col-12">
                <p className="text-muted text-uppercase fw-bold small mb-1">Total Amount Payable</p>
                <h1 className="text-primary fw-bold display-6 print-text-primary mb-0">₹{finalAmount}</h1>
              </div>
            </div>

            {/* 5. INSTRUCTIONS */}
            <div className="alert alert-info mt-4 mb-0 break-avoid" role="alert">
              <h6 className="alert-heading fw-bold"><i className="bi bi-info-circle me-2"></i>Instructions</h6>
              <ul className="mb-0 small ps-3">
                <li>Present this QR code or a printed copy at the registration desk.</li>
                <li>College ID Card is mandatory for entry into the campus.</li>
                <li>Payment must be verified at the desk to change status to PAID.</li>
              </ul>
            </div>

          </div>

          {/* 6. FOOTER BUTTONS (Hidden in Print via d-print-none) */}
          <div className="card-footer bg-light p-4 text-center d-print-none d-flex justify-content-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="btn btn-outline-secondary px-4 rounded-pill"
            >
              Return Home
            </button>

            <button
              onClick={handlePrint}
              className="btn btn-primary px-4 rounded-pill"
            >
              <i className="bi bi-printer-fill me-2"></i> Print / Save PDF
            </button>
          </div>

        </div>

        <div className="text-center text-muted mt-4 d-print-none">
          <small>© 2026 Vaividhya Tech Fest. All Rights Reserved.</small>
        </div>

      </div>

      <div className="d-print-none">
        <Footer />
      </div>

      {/* --- CRITICAL FIX: ABSOLUTE PRINT POSITIONING --- */}
      <style>
        {`
          @media print {
            /* 1. Hide EVERYTHING in the body first */
            body * {
              visibility: hidden;
            }

            /* 2. Then make ONLY the card and its children visible */
            #printable-card, #printable-card * {
              visibility: visible;
            }

            /* 3. Position the card absolutely at the top-left of the paper */
            #printable-card {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: 1px solid #ddd !important;
            }

            /* 4. Restore backgrounds and colors */
            @page { margin: 0.2cm; size: A4 portrait; }
            body { 
              background-color: white !important; 
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important; 
            }

            /* Zoom out slightly so 5 events definitely fit on a single A4 page */
            #printable-card {
                transform: scale(0.9);
                transform-origin: top left;
                width: 111% !important; /* compensate for scale */
            }

            /* Compress row spacing slightly for print */
            .list-group-item, .p-3 {
               padding: 0.5rem !important;
               margin-bottom: 0.2rem !important;
            }
            .mt-5 {
               margin-top: 1rem !important;
            }
            .mb-4 {
               margin-bottom: 1rem !important;
            }

            /* 5. Safety for Dark Headers: If bg doesn't print, ensure text is dark */
            .print-header {
               background-color: #212529 !important;
               color: white !important;
               padding: 1rem !important;
            }
            
            /* Fallback: if browser ignores background-color, make text black so it's readable */
            @media print and (color-adjust: economy) {
                .print-header { color: black !important; border-bottom: 2px solid black !important; }
            }

            .print-show { display: block !important; }
            .btn, .d-print-none { display: none !important; }
            .badge { border: 1px solid #000; color: black !important; }
          }
        `}
      </style>
    </>
  );
}

export default Receipt;
