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

export default function App() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <h1>Header Component</h1>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
      </Routes>
    </div>
  );
}
