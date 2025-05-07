import { createContext, useContext, useState, useEffect } from "react";
import { getUserIdCart } from "../service/cartService";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext"; // Thêm dòng này

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartData, setCartData] = useState(null);

  const { user } = useAuth(); // Lấy user từ AuthContext

  // Lấy token từ user context
  const token = user?.token;

  const getUserIdFromToken = () => {
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      return payload.sub;
    } catch (error) {
      return null;
    }
  };

  const fetchCart = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setCartItemCount(0);
      setCartData(null);
      return;
    }
    try {
      const data = await getUserIdCart(userId);
      const totalItems = data.cartProduct
        ? data.cartProduct.reduce((sum, item) => sum + (item.quantity || 0), 0)
        : 0;
      setCartItemCount(totalItems);
      setCartData(data);
    } catch (error) {
      setCartItemCount(0);
      setCartData(null);
    }
  };

  // Lắng nghe sự thay đổi của user
  useEffect(() => {
    if (user && user.token) {
      fetchCart();
    } else {
      setCartItemCount(0);
      setCartData(null);
    }
  }, [user]); // token sẽ thay đổi khi user thay đổi

  return (
    <CartContext.Provider value={{ cartItemCount, cartData, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
