import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// ✅ Shared staff pages
import MySchedule from "./pages/shared/MySchedule";
import RequestShiftChange from "./pages/shared/RequestShiftChange";
import Login from "./pages/shared/Login";

// Manager staff only pages
import Reservations from "./pages/manager/Reservations";
import Orders from "./pages/manager/Orders";
import Inventory from "./pages/manager/InventoryPage";
import Staff from "./pages/manager/Staff";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import StaffManagement from "./pages/manager/StaffManagement";
import MenuItems from "./pages/manager/MenuItems";
import CreateStaff from "./pages/manager/CreateStaff";
import InventoryReport from "./pages/manager/InventoryReport";
import ManagerLayout from "./components/ManagerLayout";

// ✅ Waitstaff-only pages
import WaitstaffLayout from "./pages/waitstaff/WaitstaffLayout";
import CreateOrder from "./pages/waitstaff/CreateOrder";
import MyOrders from "./pages/waitstaff/MyOrders";
import WaitstaffReservations from "./pages/waitstaff/WaitstaffReservations";

// Kitchen staff only pages
import KitchenLayout from './pages/kitchen/KitchenLayout';
import KitchenDashboard from './pages/kitchen/KitchenDashboard';
import KitchenHistory from './pages/kitchen/KitchenHistory';

// Inventory staff only pages
import InventoryLayout from "./pages/inventory/InventoryLayout";
import InventoryDashboard from "./pages/inventory/InventoryDashboard";


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
          <Route path="reservations" element={<WaitstaffReservations />} />
        </Route>

        {/* Kitchen staff only routes */}
        <Route path="/kitchen" element={<ProtectedRoute role="kitchen"><KitchenLayout /></ProtectedRoute>}>
        <Route index element={<KitchenDashboard />} />
        <Route path="history" element={<KitchenHistory />} />
        </Route>

        {/* Inventory staff only routes */}
        <Route path="/inventory" element={<ProtectedRoute role="inventory"><InventoryLayout /></ProtectedRoute>}>
        <Route index element={<InventoryDashboard />} />
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
