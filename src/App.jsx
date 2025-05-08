import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Reservations from "./pages/Reservations";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Staff from "./pages/Staff";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import StaffManagement from "./pages/StaffManagement";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const showNavbar = !window.location.pathname.startsWith("/login");

  return (
    <Router>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
        <Route path="/manager" element={<ProtectedRoute role="manager"><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/staff-management" element={<ProtectedRoute role="manager"><StaffManagement /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
