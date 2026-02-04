// Centralized API Configuration
// Dynamically determines backend URL based on current hostname
// This allows the app to work on localhost, local network IPs (for mobile testing), and production

const getApiUrl = () => {
    const hostname = window.location.hostname;

    // Check if we are in development (localhost or local network IP)
    // The backend is expected to be on the same host but port 8000
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.") || hostname.startsWith("10.")) {
        return `http://${hostname}:8000`;
    }

    // Production fallback (if deployed)
    return "https://your-production-backend-url.com"; // Replace with actual production URL
};

const API_BASE_URL = process.env.REACT_APP_API_URL || getApiUrl();

export const API = {
    BASE: API_BASE_URL,
    EVENTS: `${API_BASE_URL}/api/events`,
    REGISTRATIONS: `${API_BASE_URL}/api/registrations`,
    ADMIN: `${API_BASE_URL}/api/admin`,
};

export default API;
