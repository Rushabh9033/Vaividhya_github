import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API } from "../config/api";

function Register() {
  const navigate = useNavigate();

  // 1. IMPROVEMENT: Auto-Redirect if already registered
  // This prevents users from getting stuck on the form if they refreshed the page
  useEffect(() => {
    const savedId = localStorage.getItem("currentUserId");
    if (savedId) {
      navigate("/register/events");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enrollment: "",
    college: "",
    department: "",
    year: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error immediately when user starts fixing it
    if (status.error) setStatus((prev) => ({ ...prev, error: null }));
  }

  // Helper: Basic client-side validation
  function validateForm() {
    // Regex for exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      return "Phone number must be exactly 10 digits.";
    }
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Client-Side Validation
    const validationError = validateForm();
    if (validationError) {
      setStatus({ loading: false, error: validationError });
      return;
    }

    setStatus({ loading: true, error: null });

    // Payload Mapping
    const payload = {
      enrollment_no: formData.enrollment,
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      department: formData.department,
      year: formData.year,
    };

    try {
      const response = await fetch(`${API.REGISTRATIONS}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Save ID and redirect
        localStorage.setItem("currentUserId", data.id);
        navigate("/register/events");
      } else {
        // Intelligent Error Handling
        let errorMessage = "Registration failed.";

        if (response.status === 422) {
          // Pydantic Validation Error
          const field = data.detail?.[0]?.loc?.[1] || "field";
          errorMessage = `Invalid format for ${field}.`;
        } else if (response.status === 400 && data.detail) {
          // Logic Errors (e.g. "Already registered")
          errorMessage = data.detail;
        }

        setStatus({ loading: false, error: errorMessage });
      }
    } catch (error) {
      console.error("Network Error:", error);
      setStatus({
        loading: false,
        error: "Server connection failed. Please check your internet."
      });
    }
  }

  return (
    <>
      <Navbar />
      <div className="register-wrapper">
        <div className="register-bg"></div>
        <div className="register-card">
          <h1 className="event-name">
            VAIVIDHYA <span>2K26</span>
          </h1>
          <h2 className="register-title">
            Student <span>Registration</span>
          </h2>
          <p className="register-subtitle">
            National Level Technical & Non-Technical Fest
          </p>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Improved Error UI Component */}
            {status.error && (
              <div
                role="alert"
                style={{
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  textAlign: "center",
                  border: "1px solid #ef9a9a",
                  fontSize: "0.9rem",
                  fontWeight: "500"
                }}
              >
                ⚠️ {status.error}
              </div>
            )}

            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number (10 digits)"
              value={formData.phone}
              onChange={handleChange}
              required
              maxLength={10}
            />
            <input
              name="enrollment"
              placeholder="Enrollment Number"
              value={formData.enrollment}
              onChange={handleChange}
              required
            />
            <input
              name="college"
              placeholder="College Name"
              value={formData.college}
              onChange={handleChange}
              required
            />
            <input
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
            />
            <input
              name="year"
              placeholder="Year (e.g. 2nd Year)"
              value={formData.year}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="register-btn"
              disabled={status.loading}
              style={{
                opacity: status.loading ? 0.7 : 1,
                cursor: status.loading ? "not-allowed" : "pointer"
              }}
            >
              {status.loading ? "Processing..." : "Proceed to Event Selection →"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;