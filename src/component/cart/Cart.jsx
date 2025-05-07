import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addItem, getUserIdCart, removeItem } from "../../service/cartService";
import CartItem from "./CartItem";
import Header from "../Header";
import Footer from "../Footer";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return payload.sub;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

export default function Cart() {
  const [cart, setCart] = useState({ item: [], totalPrice: 0 });
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const isAllSelected =
    cart.item.length > 0 && selectedItems.length === cart.item.length;

  const selectedTotal = cart.item
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.price * item.quantity, 0);

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getUserIdCart(userId);
        console.log("Cart data from API:", data); // Debug log
        setCart({
          item: data.cartProduct,
          totalPrice: data.total_price,
        });
      } catch (error) {
        setError(error.message);
      }
    };
    fetchCart();
  }, [userId]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      const data = await addItem({
        userId: userId,
        cartProduct: [{ productId, quantity: newQuantity }],
      });
      setCart({
        item: data.cartProduct,
        totalPrice: data.total_price,
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const data = await removeItem({
        userId: userId,
        cartProduct: [{ productId, quantity: 0 }],
      });
      setCart({
        item: data.cartProduct,
        totalPrice: data.total_price,
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleToggleSelect = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.item.map((item) => item.id));
    }
  };

  const handleBuySelected = () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để mua!");
      return;
    }

    // Tạo danh sách orderItems từ selectedItems
    const orderItems = cart.item
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        productName: item.productName, // Sử dụng productName thay vì name
        price: item.price, // Thêm price để hiển thị trong OrderForm
      }));

    // Debug log để kiểm tra orderItems
    console.log("OrderItems sent from Cart:", orderItems);

    // Chuyển hướng sang OrderForm với danh sách orderItems
    navigate("/order", {
      state: { orderItems },
    });
  };

  const handleSearchResults = (results) => {
    console.log("Kết quả tìm kiếm:", results);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onSearchResults={handleSearchResults} />
        <div className="flex-1 bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!cart || cart.item.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onSearchResults={handleSearchResults} />
        <div className="flex-1 bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <img
              src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/5fafbb923393b712b96488590b8f781f.png"
              alt="Empty cart"
              className="w-40 h-40 mx-auto mb-4"
            />
            <p className="text-gray-500 mb-4">Giỏ hàng của bạn còn trống</p>
            <button
              className="!bg-red-500 text-white px-8 py-2 rounded-sm hover:bg-red-600"
              onClick={() => navigate("/product")}
            >
              Mua ngay
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearchResults={handleSearchResults} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 w-full flex-1 flex flex-col">
          {/* Scrollable content */}
          <div className="flex-1 overflow-auto pb-24">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-medium mb-6">Giỏ Hàng Của Bạn</h1>

              {/* Product list */}
              <div className="space-y-2">
                {cart.item.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    isSelected={selectedItems.includes(item.id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sticky summary bar */}
          <div className="sticky bottom-0 z-10 bg-white border-t-4 border-orange-500 shadow-lg">
            <div className="max-w-6xl mx-auto px-4 w-full">
              <div className="p-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center mb-2 md:mb-0">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="w-5 h-5 mr-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-gray-600">
                      Chọn tất cả ({cart.item.length})
                    </span>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-gray-600">
                        Tổng thanh toán ({selectedItems.length} sản phẩm):
                      </div>
                      <div className="text-2xl font-bold text-red-500">
                        {selectedTotal.toLocaleString()}₫
                      </div>
                    </div>
                    <button
                      onClick={handleBuySelected}
                      disabled={selectedItems.length === 0}
                      className={`h-12 px-8 rounded-sm text-sm font-medium transition-colors ${
                        selectedItems.length === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "!bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      Mua Hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}