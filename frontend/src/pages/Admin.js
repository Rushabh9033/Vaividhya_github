import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API } from "../config/api";
import showToast from "../components/Toast";

function Admin() {
  // --- AUTH STATE ---
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem("is_adminnn") === "true";
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // --- DATA STATES ---
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchRegId, setSearchRegId] = useState("");
  const [regData, setRegData] = useState(null);
  const [activeTab, setActiveTab] = useState("stats"); // "stats" or "search"

  // --- 1. HANDLE LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!usernameInput || !passwordInput) {
      setAuthError("Please select a team and enter password");
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
        sessionStorage.setItem("is_adminnn", "true");
        sessionStorage.setItem("admin_username", data.username);
        setIsAdmin(true);
      } else {
        setAuthError(data.detail || "Invalid credentials");
      }
    } catch (err) {
      setAuthError("Login failed. Check connection.");
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
      showToast("Failed to load statistics", "error");
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
    if (!searchRegId) return;

    setLoading(true);
    try {
      const response = await fetch(`${API.REGISTRATIONS}/${searchRegId}`);
      const data = await response.json();
      if (response.ok) {
        setRegData(data);
      } else {
        showToast("Registration not found", "error");
        setRegData(null);
      }
    } catch (err) {
      showToast("Error searching registration", "error");
    } finally {
      setLoading(false);
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
              <select
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="admin-input"
              >
                <option value="">Select Team</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={`TEAM${i + 1}`}>Team {i + 1}</option>
                ))}
              </select>
              <input
                type="password"
                placeholder="Access Key"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="admin-input"
              />
              <button type="submit" className="admin-btn">Initiate Access</button>
              {authError && <p className="error-text">{authError}</p>}
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
        <div className="admin-sidebar">
          <h3>Control Panel</h3>
          <button
            className={`sidebar-link ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            📊 Event Stats
          </button>
          <button
            className={`sidebar-link ${activeTab === "search" ? "active" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            🔍 Verify Registration
          </button>
          <div className="mt-auto p-4">
            <button
              className="admin-logout-btn"
              onClick={() => {
                sessionStorage.removeItem("is_adminnn");
                setIsAdmin(false);
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="admin-content">
          {activeTab === "stats" ? (
            <div className="stats-view">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Live Event Statistics</h2>
                <button onClick={fetchStats} className="refresh-btn">Refresh</button>
              </div>

              {loading ? <p>Syncing with Data Core...</p> : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Event ID (Slug)</th>
                        <th>Event Name</th>
                        <th className="text-center">Registrations</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((s, idx) => (
                        <tr key={idx} className={s.count === 0 ? "zero-row" : ""}>
                          <td><code>{s.event_id || s._id}</code></td>
                          <td>{s.event_name || s.name}</td>
                          <td className="text-center count-cell">
                            <span className={`count-badge ${s.count > 0 ? "active" : "empty"}`}>
                              {s.count}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="search-view">
              <h2>Registration Verification</h2>
              <form onSubmit={handleSearch} className="d-flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter User ID or MongoDB ID"
                  value={searchRegId}
                  onChange={(e) => setSearchRegId(e.target.value)}
                  className="admin-input flex-grow-1"
                />
                <button type="submit" className="admin-btn w-auto px-4">Search</button>
              </form>

              {regData && (
                <div className="reg-result-card">
                  <h3>{regData.full_name}</h3>
                  <div className="reg-grid">
                    <p><strong>Status:</strong> <span className={regData.payment_status}>{regData.payment_status}</span></p>
                    <p><strong>College:</strong> {regData.college}</p>
                    <p><strong>Events:</strong> {regData.event_details?.map(e => e.event_name).join(", ")}</p>
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
