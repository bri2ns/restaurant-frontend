import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Reservations from "./pages/Reservations";
import Orders from "./pages/Orders";
import Inventory from "./pages/InventoryPage";
import Staff from "./pages/Staff";
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import StaffManagement from "./pages/StaffManagement";
import MenuItems from "./pages/MenuItems";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerLayout from "./components/ManagerLayout";
import Navbar from "./components/Navbar";
import CreateStaff from "./pages/CreateStaff";
import InventoryReport from "./pages/InventoryReport";

function App() {
  const showNavbar = !window.location.pathname.startsWith("/login");

  return (
    <Router>
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
          <Route path="/manager/inventory-report" element={<InventoryReport />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;