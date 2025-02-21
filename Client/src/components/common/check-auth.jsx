import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // ✅ If already authenticated and visiting "/auth/register" → Redirect to login
  if (isAuthenticated && location.pathname === "/auth/register") {
    return <Navigate to="/auth/login" replace />;
  }

  // ✅ If already authenticated and visiting "/auth/login" → Redirect to correct dashboard
  else if (isAuthenticated && location.pathname === "/auth/login") {
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/shop/home" replace />
    );
  }
  else {
    <Navigate to="/auth/login" />;
  }

  // ✅ Redirect unauthenticated users away from protected pages
  if (
    !isAuthenticated &&
    !["/auth/login", "/auth/register"].includes(location.pathname)
  ) {
    return <Navigate to="/auth/login" replace />;
  }

  // ✅ Prevent regular users from accessing admin pages
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.startsWith("/admin")
  ) {
    return <Navigate to="/unauth-page" replace />;
  }

  // ✅ Prevent admins from accessing shopping pages
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.startsWith("/shop")
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
