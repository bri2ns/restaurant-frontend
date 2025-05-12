// src/api/index.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace(/\/+$/, "") + "/",
  withCredentials: true,
});

// Attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401/403 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("🔐 AXIOS ERROR", error.response?.status, error.response?.data);
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// -------------------- API HELPERS --------------------

// Shared / Auth
export const login = (formData) =>
  api.post("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

// Customer
export const registerCustomer = (data) => api.post("/customers/register", data);
export const createReservation = (data) => api.post("/reservations", data);
export const fetchAvailability = (payload) => api.post("/reservations/availability", payload);
export const getMyReservations = () => api.get("/reservations/my");

// Waitstaff / Orders
export const getActiveOrders = () => api.get("/orders/active");
export const updateOrderStatus = (orderId, newStatus) =>
  api.patch(`/orders/${orderId}/status`, { new_status: newStatus });

// Inventory
export const reorderInventoryItem = (itemId, quantity) =>
  api.patch(`/inventory/${itemId}/reorder`, { quantity_on_hand: quantity });

export const fetchInventoryReport = (start, end) =>
  api.get("/inventory/usage-report", {
    params: { start_date: start, end_date: end },
  });

export default api;
