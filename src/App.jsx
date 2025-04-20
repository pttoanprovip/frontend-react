import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import Product from "./page/Product";
import ProductDetail from "./compoment/product/ProductDetail";
import Cart from "./compoment/Cart/Cart";
import OrderForm from "./compoment/order/OrderForm";


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
      </Routes>
    </BrowserRouter>
  );
}
