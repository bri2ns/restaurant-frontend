import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    // ✅ Support single role or array of roles
    if (role) {
      const allowed = Array.isArray(role)
        ? role.includes(userRole)
        : userRole === role;

      if (!allowed) return <Navigate to="/unauthorized" />;
    }

    return children;
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem("token");
    return <Navigate to="/login" />;
  }
}
