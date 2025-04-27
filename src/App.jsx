import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import Product from "./page/Product";
import ProductDetail from "./component/product/ProductDetail";
import Cart from "./component/Cart/Cart";
import OrderForm from "./component/order/OrderForm";
import OrderSuccess from "./component/order/OrderSuccess";
import PaymentCancel from "./component/payment/PaymentCancel";
import PaymentSuccess from "./component/payment/PaymentSuccess";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
      </Routes>
    </BrowserRouter>
  );
}
