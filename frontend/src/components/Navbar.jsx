import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  // 1. Check if user is "logged in" (has an ID stored)
  useEffect(() => {
    const storedId = localStorage.getItem("currentUserId");
    setUserId(storedId);
  }, []);

  // 2. Logout Handler
  function handleLogout() {
    // Clear the ID from storage
    localStorage.removeItem("currentUserId");
    setUserId(null);
    // Redirect to home
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container">

        {/* LOGO */}
        <NavLink className="navbar-brand fw-bold" to="/">
          VAIVIDHYA <span className="text-warning">2K26</span>
        </NavLink>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV LINKS */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/events">
                Events
              </NavLink>
            </li>

            {/* <li className="nav-item">
              <NavLink className="nav-link" to="/search-receipt">
                Find Receipt
              </NavLink>
            </li> */}

            {/* --- CONDITIONAL RENDERING START --- */}
            {userId ? (
              // OPTION A: If User IS Logged In
              <>
                <li className="nav-item mb-2">
                  <NavLink 
                    className="nav-link" 
                    to={`/receipt`} // Or wherever your profile page is
                  >
                    My Registration
                  </NavLink>
                </li>
                
                <li className="nav-item">
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm px-3"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // OPTION B: If User is NOT Logged In
              <li className="nav-item">
                <NavLink
                  className="btn btn-warning text-dark fw-semibold px-4"
                  to="/register"
                >
                  Register
                </NavLink>
              </li>
            )}
            {/* --- CONDITIONAL RENDERING END --- */}

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
