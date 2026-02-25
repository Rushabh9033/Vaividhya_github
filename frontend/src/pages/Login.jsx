import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API } from "../config/api";
import { showToast } from "../components/Toast";

function Login() {
  const navigate = useNavigate();
  const [enrollmentNo, setEnrollmentNo] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!enrollmentNo.trim()) {
      showToast("Please enter an enrollment number", "danger");
      return;
    }

    setLoading(true);
    try {
      // Normalize and encode
      const encodedEnrollment = encodeURIComponent(enrollmentNo.trim().toLowerCase());
      const response = await fetch(`${API.REGISTRATIONS}/enrollment/${encodedEnrollment}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Registration not found with this enrollment number. Please register first.");
        }
        throw new Error("Failed to login. Please check your enrollment number and try again.");
      }

      const data = await response.json();

      // Store user ID in local storage just like during registration
      if (data._id) {
        localStorage.setItem("currentUserId", data._id);
        showToast("Login Successful!", "success");
        navigate("/receipt");

        // Ensure standard refresh of navbar and related components
        window.dispatchEvent(new Event("storage"));
      } else {
        throw new Error("Invalid response from server.");
      }

    } catch (err) {
      console.error(err);
      showToast(err.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-4 p-md-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark mb-0">Student Login</h2>
                    <p className="text-muted small">Enter your enrollment number to view registered events & receipt</p>
                  </div>

                  <form onSubmit={handleLogin}>
                    <div className="mb-4">
                      <label className="form-label fw-bold text-secondary">Enrollment Number</label>
                      <input
                        type="text"
                        className="form-control form-control-lg bg-light border-0"
                        placeholder="e.g. 230020107001"
                        value={enrollmentNo}
                        onChange={(e) => setEnrollmentNo(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Verifying...
                        </>
                      ) : (
                        "View My Registration"
                      )}
                    </button>
                  </form>

                  <div className="text-center mt-4">
                    <p className="text-muted small mb-0">Don't have an account?</p>
                    <button onClick={() => navigate("/register")} className="btn btn-link text-decoration-none fw-bold">Register Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Login;
