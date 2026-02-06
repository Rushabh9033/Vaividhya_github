import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Receipt from "./pages/Receipt";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import RegisterEvents from "./pages/RegisterEvents";
import SearchReceipt from "./pages/SearchReceipt";
import Paid from "./pages/Paid";
import Admin from "./pages/Admin"; // Added Admin

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/events" element={<RegisterEvents />} />
          <Route path="/register/receipt" element={<Receipt />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId" element={<EventDetails />} />
          <Route path="/search-receipt" element={<SearchReceipt />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/paid" element={<Paid />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
