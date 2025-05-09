import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace(/\/+$/, "") + "/",
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getActiveOrders() {
  const res = await api.get("/orders/active");
  return res.data;
}

export async function updateOrderStatus(orderId, newStatus) {
  const res = await api.patch(`/orders/${orderId}/status`, {
    new_status: newStatus,
  });
  return res.data;
}

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


export default api;
