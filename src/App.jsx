import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Reservations from "./pages/manager/Reservations";
import Orders from "./pages/manager/Orders";
import Inventory from "./pages/manager/InventoryPage";
import Staff from "./pages/manager/Staff";
import Login from "./pages/shared/Login";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import StaffManagement from "./pages/manager/StaffManagement";
import MenuItems from "./pages/manager/MenuItems";
import CreateStaff from "./pages/manager/CreateStaff";
import InventoryReport from "./pages/manager/InventoryReport";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerLayout from "./components/ManagerLayout";
import Navbar from "./components/Navbar";

// ✅ Shared staff pages
import MySchedule from "./pages/shared/MySchedule";
import RequestShiftChange from "./pages/shared/RequestShiftChange";

// ✅ Waitstaff-only pages
import WaitstaffLayout from "./pages/waitstaff/WaitstaffLayout";
import CreateOrder from "./pages/waitstaff/CreateOrder";
import MyOrders from "./pages/waitstaff/MyOrders";

function AppWrapper() {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith("/login");

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* General staff-shared routes (accessible by multiple roles) */}
        <Route path="/shared/my-schedule" element={<ProtectedRoute><MySchedule /></ProtectedRoute>} />
        <Route path="/shared/request-shift-change" element={<ProtectedRoute><RequestShiftChange /></ProtectedRoute>} />

        {/* Manager-only routes */}
        <Route path="/" element={<ProtectedRoute role="manager"><ManagerLayout /></ProtectedRoute>}>
          <Route path="manager" element={<ManagerDashboard />} />
          <Route path="staff-management" element={<StaffManagement />} />
          <Route path="create-staff" element={<CreateStaff />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="menu" element={<MenuItems />} />
          <Route path="manager/inventory-report" element={<InventoryReport />} />
        </Route>

        {/* Waitstaff-only routes */}
        <Route path="/waitstaff" element={<ProtectedRoute role="waitstaff"><WaitstaffLayout /></ProtectedRoute>}>
          <Route path="orders" element={<CreateOrder />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="schedule" element={<MySchedule />} />
          <Route path="request-shift-change" element={<RequestShiftChange />} />
        </Route>

        {/* You can add kitchen routes here in the future */}
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
