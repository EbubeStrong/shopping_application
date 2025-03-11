import { Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/auth-slice";
import { useEffect } from "react";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    //  console.log("Checking local storage for auth...");
    const storedAuth = localStorage.getItem("auth");

    if (!storedAuth) {
      console.log(
        "No auth data found in localStorage. Dispatching setUser(null)"
      );
      dispatch(setUser(null));
    } else {
      try {
        const parsedUser = JSON.parse(storedAuth);
        console.log("Found auth data:", parsedUser);

        if (!parsedUser.userName) {
          console.error("userName is missing from localStorage!");
        }

        dispatch(setUser(parsedUser));
      } catch (error) {
        console.error("Error parsing auth data:", error);
        dispatch(setUser(null));
      }
    }
  }, [dispatch]);

  // if (
  //   !isAuthenticated &&
  //   !(
  //     location.pathname.includes("/login") ||
  //     location.pathname.includes("/register")
  //   )
  // ) {
  //   return <Navigate to="/auth/login" />;
  // }

  // if (
  //   isAuthenticated &&
  //   (location.pathname.includes("/login") ||
  //     location.pathname.includes("/register"))
  // ) {
  //   if (user?.role === "admin") {
  //     return <Navigate to="/admin/dashboard" />;
  //   } else {
  //     return <Navigate to="/shop/home" />;
  //   }
  // }

  // if (
  //   isAuthenticated &&
  //   user?.role !== "admin" &&
  //   location.pathname.includes("/admin")
  // ) {
  //   return <Navigate to="/unauth-page" />;
  // }

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

  // // ✅ Prevent admins from accessing shopping pages
  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("/shop")
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
