import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  console.log("Current Path:", location.pathname);
  console.log("Authenticated:", isAuthenticated);
  console.log("User:", user);

  // Redirect unauthenticated users to login (except auth pages)
  if (
    !isAuthenticated &&
    !["/auth/login", "/auth/register"].includes(location.pathname)
  ) {
    return <Navigate to="/auth/login" />;
  }

  // Redirect authenticated users away from auth pages
  if (
    isAuthenticated &&
    ["/auth/login", "/auth/register"].includes(location.pathname)
  ) {
    if (user?.role === "admin") return <Navigate to="/admin/dashboard" />;
    return <Navigate to="/shop/home" />; // Default for non-admin users
  }

  // Prevent regular users from accessing admin pages
  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.startsWith("/admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  // Prevent admins from accessing shopping pages
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.startsWith("/shop")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;
