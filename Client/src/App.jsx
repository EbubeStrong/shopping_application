import { Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./Pages/auth/login";
import AuthRegister from "./Pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./Pages/admin/dashboard";
import AdminProducts from "./Pages/admin/products";
import AdminOrders from "./Pages/admin/orders";
import AdminFeatures from "./Pages/admin/features";
import ShoppingLayout from "./Pages/shopping/layout";
import ShoppingHome from "./Pages/shopping/home";
import NotFound from "./Pages/not-found";
import ShoppingListing from "./Pages/shopping/listing";
import ShoppingCheckout from "./Pages/shopping/checkout";
import ShoppingAccount from "./Pages/shopping/account";
import CheckAuth from "./components/common/check-auth";
import UnAuthPage from "./Pages/unauthPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "../store/auth-slice/index";
import { Skeleton } from "@/components/ui/skeleton";
import PaypalReturnPage from "./components/shopping-view/paypal-return";
import PaymentSuccessPage from "./Pages/shopping/payment-success";
import SearchProducts from "./Pages/shopping/search";

export default function App() {
  // const isAuthenticated = false
  // const user = null

  // const isAuthenticated = true;
  // const user = {
  //   name : 'Samuel',
  //   role : 'admin'
  // }

  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  // console.log(user, isAuthenticated, "userName", "isAuthenticated")

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading)
    return (
      // <Skeleton className="w-[100px] h-[20px] rounded-full" />;
      <div className="flex justify-center items-center h-screen">
        {/* <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div> */}

        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col">
      <Routes>
        {/* <Route path="/" element={ } /> */}
        <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            </CheckAuth>
          }
        />

        {/* <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <Outlet />
            </CheckAuth>
          }
        >
          <Route path="/" element={<AuthLayout />}>
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>
        </Route> */}

        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
        
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>

        <Route path="/unauth-page" element={<UnAuthPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
