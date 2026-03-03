import { UseAppData } from "../Context/AppContext";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { isAuth, loading } = UseAppData();

  if (loading) return null;

  return isAuth ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
