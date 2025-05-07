import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./page/Login";
import Register from "./page/Register";
import Product from "./page/Product";
import ProductDetail from "./component/product/ProductDetail";
import Cart from "./component/Cart/Cart";
import OrderForm from "./component/order/OrderForm";
import OrderSuccess from "./component/order/OrderSuccess";
import PaymentCancel from "./component/payment/PaymentCancel";
import PaymentSuccess from "./component/payment/PaymentSuccess";
import Admin from "./page/admin/Admin";
import Home from "./page/Home";
import ProtectedRoute from "./component/ProtectRoute";
import ProductAdmin from "./page/admin/ProductAdmin";
import UserAdmin from "./page/admin/UserAdmin";
import OrderAdmin from "./page/admin/OrderAdmin";
import DiscountAdmin from "./page/admin/DiscountAdmin";
import MyInfo from "./page/MyInfo";
import OrderHistory from "./page/OrderHistory";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          {/* Route yêu cầu đăng nhập */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<OrderForm />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/my-info" element={<MyInfo />} />
            <Route path="/order-history" element={<OrderHistory />} />
          </Route>

          {/* Route yêu cầu vai trò Admin */}
          <Route element={<ProtectedRoute requiredRole="Admin" />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/product" element={<ProductAdmin />} />
            <Route path="/admin/user" element={<UserAdmin />} />
            <Route path="/admin/order" element={<OrderAdmin />} />
            <Route path="/admin/discount" element={<DiscountAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
