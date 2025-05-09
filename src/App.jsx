import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Reservations from "./pages/manager/Reservations";
import Orders from "./pages/manager/Orders";
import Inventory from "./pages/manager/InventoryPage";
import Staff from "./pages/manager/Staff";
import Login from "./pages/shared/Login";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import StaffManagement from "./pages/manager/StaffManagement";
import MenuItems from "./pages/manager/MenuItems";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerLayout from "./components/ManagerLayout";
import Navbar from "./components/Navbar";
import CreateStaff from "./pages/manager/CreateStaff";
import InventoryReport from "./pages/manager/InventoryReport";

function AppWrapper() {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith("/login");

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Routes without sidebar */}
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />

        {/* Manager section with persistent sidebar */}
        <Route path="/" element={<ProtectedRoute role="manager"><ManagerLayout /></ProtectedRoute>}>
          <Route path="manager" element={<ManagerDashboard />} />
          <Route path="staff-management" element={<StaffManagement />} />
          <Route path="create-staff" element={<CreateStaff />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="menu" element={<MenuItems />} />
          <Route path="manager/inventory-report" element={<InventoryReport />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
