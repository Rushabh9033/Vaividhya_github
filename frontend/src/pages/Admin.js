import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API } from "../config/api";
import showToast from "../components/Toast";

function Admin() {
  // --- AUTH STATE ---
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("is_adminnn") === "true";
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // --- DATA STATES ---
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [regData, setRegData] = useState(null);
  const [activeTab, setActiveTab] = useState("stats"); // "stats" or "verify"
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // --- 1. HANDLE LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    if (!usernameInput || !passwordInput) {
      setAuthError("Select Team & Enter Access Key");
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
      } else {
        setAuthError("Invalid ID / Access Key");
      }
    } catch (err) {
      setAuthError("Connection Failed");
    }
  };

  // --- 2. FETCH STATS ---
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API.ADMIN}/event-stats`);
      const data = await response.json();
      if (response.ok) setStats(data);
    } catch (err) {
      showToast("Sync Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && activeTab === "stats") {
      fetchStats();
    }
  }, [isAdmin, activeTab]);

  // --- 3. SEARCH REGISTRATION ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await fetch(`${API.REGISTRATIONS}/${searchQuery}`);
      const data = await response.json();
      if (response.ok) {
        setRegData(data);
      } else {
        showToast("Not Found", "error");
        setRegData(null);
      }
    } catch (err) {
      showToast("Search Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- 4. UPDATE PAYMENT STATUS ---
  const togglePayment = async (status) => {
    if (!regData || !regData._id) return;
    setUpdatingStatus(true);
    const endpoint = status === "PAID" ? "mark-paid" : "mark-unpaid";

    try {
      const response = await fetch(`${API.REGISTRATIONS}/${regData._id}/${endpoint}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_name: localStorage.getItem("admin_username") || "Admin"
        })
      });

      if (response.ok) {
        setRegData(prev => ({ ...prev, payment_status: status }));
        showToast(`Status updated to ${status}`, "success");
      } else {
        showToast("Update failed", "error");
      }
    } catch (err) {
      showToast("Network Error", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // --- UI: LOGIN ---
  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="admin-login-overlay">
          <div className="admin-card neon-border">
            <h2>Admin Terminal</h2>
            <form onSubmit={handleLogin}>
              <select value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className="admin-input">
                <option value="">Select Team</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`TEAM${i + 1}`}>Team {i + 1}</option>
                ))}
              </select>
              <input type="password" placeholder="Access Key" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="admin-input" />
              <button type="submit" className="admin-btn">Login</button>
              {authError && <p className="error-text text-danger">{authError}</p>}
            </form>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-dashboard">
        {/* SIDEBAR */}
        <div className="admin-sidebar">
          <h3>Terminal</h3>
          <button className={`sidebar-link ${activeTab === "stats" ? "active" : ""}`} onClick={() => setActiveTab("stats")}>
            📈 Event Matrix
          </button>
          <button className={`sidebar-link ${activeTab === "verify" ? "active" : ""}`} onClick={() => setActiveTab("verify")}>
            ✅ Verify User
          </button>
          <div className="mt-auto p-4">
            <button className="admin-logout-btn" onClick={() => { localStorage.removeItem("is_adminnn"); localStorage.removeItem("admin_username"); setIsAdmin(false); }}>
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="admin-content">
          {activeTab === "stats" ? (
            <div className="stats-container">
              <div className="d-flex justify-content-between mb-4">
                <h2>Event Statistics (40 Total)</h2>
                <button onClick={fetchStats} className="refresh-btn">Sync Data</button>
              </div>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr><th>Slug</th><th>Name</th><th className="text-center">Entries</th></tr>
                  </thead>
                  <tbody>
                    {stats.map((s, idx) => (
                      <tr key={idx} className={s.count === 0 ? "opacity-50" : ""}>
                        <td><code>{s.event_id}</code></td>
                        <td>{s.event_name}</td>
                        <td className="text-center">
                          <span className={`count-badge ${s.count > 0 ? "active" : ""}`}>{s.count}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="verify-container">
              <h2>User Verification</h2>
              <form onSubmit={handleSearch} className="d-flex gap-2 mb-5">
                <input
                  type="text"
                  placeholder="Paste User ID here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-input mb-0"
                />
                <button type="submit" className="admin-btn w-auto px-4">Find</button>
              </form>

              {regData && (
                <div className="reg-detail-card neon-border p-4 bg-dark bg-opacity-25 rounded transition-all">
                  <div className="d-flex justify-content-between align-items-start border-bottom border-secondary pb-3 mb-3">
                    <div>
                      <h3 className="text-info mb-1">{regData.full_name}</h3>
                      <p className="mb-0 text-white-50">{regData.enrollment_no} | {regData.phone}</p>
                    </div>
                    <div className={`status-pill ${regData.payment_status}`}>
                      {regData.payment_status}
                    </div>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-md-6">
                      <p className="mb-1 text-white-50 small uppercase">College Context</p>
                      <p className="fw-bold">{regData.college} ({regData.department})</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1 text-white-50 small uppercase">Registered For</p>
                      <div className="d-flex flex-wrap gap-2 mt-1">
                        {regData.event_details?.map((e, i) => (
                          <span key={i} className="badge bg-secondary">{e.event_name}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ADMIN ACTION BUTTONS */}
                  <div className="pt-3 border-top border-secondary d-flex gap-3">
                    <button
                      className={`btn w-100 fw-bold ${regData.payment_status === "PAID" ? "btn-success" : "btn-outline-success"}`}
                      disabled={regData.payment_status === "PAID" || updatingStatus}
                      onClick={() => togglePayment("PAID")}
                    >
                      {updatingStatus ? "Updating..." : "Approve Payment"}
                    </button>
                    <button
                      className={`btn w-100 fw-bold ${regData.payment_status !== "PAID" ? "btn-danger" : "btn-outline-danger"}`}
                      disabled={regData.payment_status !== "PAID" || updatingStatus}
                      onClick={() => togglePayment("PENDING")}
                    >
                      Refute Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Admin;
