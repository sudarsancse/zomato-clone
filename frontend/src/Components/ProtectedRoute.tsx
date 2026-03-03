import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UseAppData } from "../Context/AppContext";

const ProtectedRoute = () => {
  const { isAuth, user, loading } = UseAppData();
  const location = useLocation();

  if (loading) return null;

  // If not logged in and not already on login
  if (!isAuth) {
    return <Navigate to={"/login"} replace />;
  }

  // If logged in but no role
  if (!user?.role) {
    // Allow only select-role page
    if (location.pathname !== "/select-role") {
      return <Navigate to="/select-role" replace />;
    }
  }
  // 3️⃣ Logged in AND role selected
  if (user?.role) {
    // Block access to select-role forever
    if (location.pathname === "/select-role") {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
