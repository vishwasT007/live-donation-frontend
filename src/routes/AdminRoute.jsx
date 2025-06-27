import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Not logged in? Send to login
    return <Navigate to="/" />;
  }

  if (user.role !== "admin") {
    // Logged in, but not admin? Block access
    return (
      <div className="p-6 text-center text-red-600 font-bold text-xl">
        🚫 Access Denied: Admins Only
      </div>
    );
  }

  // ✅ Authorized
  return children;
};

export default AdminRoute;
