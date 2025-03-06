import { Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/auth-slice";
import { useEffect } from "react";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      try {
        const parsedUser = JSON.parse(storedAuth);
        dispatch(setUser(parsedUser)); 
      } catch (error) {
        console.error("Invalid auth data:", error);
        dispatch(setUser(null));
      }
    }
  }, [dispatch]);

  // ✅ If authenticated and visiting "/auth/register" → Redirect to login
  if (isAuthenticated && location.pathname === "/auth/register") {
    return <Navigate to="/auth/login" replace />;
  }

  // ✅ If authenticated and visiting "/auth/login" → Redirect to correct dashboard
  if (isAuthenticated && location.pathname === "/auth/login") {
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/shop/home" replace />
    );
  }

  // ✅ Redirect unauthenticated users from protected pages
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
