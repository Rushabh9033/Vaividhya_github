// Centralized API Configuration
// Dynamically determines backend URL based on current hostname
// This allows the app to work on localhost, local network IPs (for mobile testing), and production

const getApiUrl = () => {
    // Force Production URL for all deployed/packaged builds
    // Only use localhost if explicitly told to via environment variable
    if (process.env.NODE_ENV === "development") {
        const hostname = window.location.hostname;
        if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.") || hostname.startsWith("10.")) {
            return `http://${hostname}:8000`;
        }
    }

    return "https://vaividhya2k26-backend.onrender.com";
};

const API_BASE_URL = process.env.REACT_APP_API_URL || getApiUrl();

export const API = {
    BASE: API_BASE_URL,
    EVENTS: `${API_BASE_URL}/api/events`,
    REGISTRATIONS: `${API_BASE_URL}/api/registrations`,
    ADMIN: `${API_BASE_URL}/api/admin`,
};

export default API;
