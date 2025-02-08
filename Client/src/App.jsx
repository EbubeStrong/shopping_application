import { Routes, Route } from "react-router-dom"; // ✅ Remove BrowserRouter import
import "./App.css";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./Pages/auth/login";
import AuthRegister from "./Pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./Pages/admin/dashbord";
import AdminProducts from "./Pages/admin/products";
import AdminOrders from "./Pages/admin/orders";
import AdminFeatures from "./Pages/admin/features";
import ShoppingLayout from "./Pages/shopping/layout";
import ShoppingHome from "./components/shopping-view/home";
import NotFound from "./Pages/not-found";
import ShoppingListing from "./components/shopping-view/listing";
import ShoppingCheckout from "./components/shopping-view/checkout";
import ShoppingAccount from "./components/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnAuthPage from "./Pages/unauthPage";

export default function App() {
  const isAuthenticated = false
  const user = null

  // const isAuthenticated = true;
  // const user = {
  //   name : 'Samuel',
  //   role : 'user'
  // }


  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
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



        <Route path="/shop" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="listings" element={<ShoppingListing />} />
          <Route path="home" element={<ShoppingHome />} />
        </Route>

        <Route path="/unauth-page" element={<UnAuthPage/>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
