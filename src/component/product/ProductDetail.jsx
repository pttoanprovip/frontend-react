import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../service/productService";
import { addItem } from "../../service/cartService";
import { useCart } from "../../context/CartContext";
import Slider from "react-slick";
import Modal from "react-modal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Review from "../Review";

Modal.setAppElement("#root");

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

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { fetchCart } = useCart();

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        console.log("Product data from API:", data);
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

    return () => {
      setCartMessage("");
      setCartError("");
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!userId) {
      setCartError("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }
    const cartRequest = {
      userId: userId,
      cartProduct: [{ productId: product.id, quantity: 1 }],
    };
    try {
      await addItem(cartRequest);
      setCartMessage(`Đã thêm ${product.name} vào giỏ hàng!`);
      setCartError("");
      setTimeout(() => setCartMessage(""), 3000);
      fetchCart(); // Cập nhật giỏ hàng
    } catch (error) {
      setCartError(error.message);
      setCartMessage("");
    }
  };

  const handleBuyNow = () => {
    if (!userId) {
      setCartError("Vui lòng đăng nhập để mua hàng");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmBuy = () => {
    setIsModalOpen(false);
    const orderItems = [
      {
        productId: product.id,
        quantity,
        productName: product.name,
        price: product.discountPrice || product.price,
      },
    ];
    console.log("OrderItems sent from ProductDetail:", orderItems);
    navigate("/order", {
      state: { orderItems },
    });
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  if (loading) return <div className="text-center py-6">Đang tải...</div>;
  if (error)
    return <div className="text-center text-red-600 py-6">Lỗi: {error}</div>;
  if (!product)
    return <div className="text-center py-6">Sản phẩm không tồn tại</div>;

  return (
    <div className="min-h-screen min-w-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-sm rounded-lg p-4 md:flex md:gap-6">
          {/* Image Section */}
          <div className="md:w-1/2">
            {product.productImages?.length > 0 ? (
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={3000}
                arrows={true}
              >
                {product.productImages.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image.imageUrl}
                      alt={`Ảnh sản phẩm ${index + 1}`}
                      className="w-full h-64 object-contain rounded-lg transition-transform duration-200 hover:scale-105"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Không có ảnh</span>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="md:w-1/2 mt-4 md:mt-0 space-y-4">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
              {product.name}
            </h1>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-red-600 text-xl font-bold">
                  {product.discountPrice
                    ? `${product.discountPrice.toLocaleString()}₫`
                    : `${product.price.toLocaleString()}₫`}
                </span>
                {product.discountPrice && (
                  <span className="text-gray-400 line-through text-sm">
                    {product.price.toLocaleString()}₫
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.detail || "Không có mô tả"}
            </p>
            <div className="bg-gray-50 p-3 rounded-md">
              <h3 className="font-medium text-gray-800 mb-2">
                Thông số kỹ thuật
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-gray-600">
                <li>
                  <span className="font-medium">Thương hiệu:</span>{" "}
                  {product.brand || "-"}
                </li>
                <li>
                  <span className="font-medium">CPU:</span> {product.cpu || "-"}
                </li>
                <li>
                  <span className="font-medium">RAM:</span> {product.ram || "-"}
                </li>
                <li>
                  <span className="font-medium">Bộ nhớ:</span>{" "}
                  {product.storage || "-"}
                </li>
                <li>
                  <span className="font-medium">Màn hình:</span>{" "}
                  {product.screenSize || "-"}
                </li>
                <li>
                  <span className="font-medium">Trọng lượng:</span>{" "}
                  {product.weight ? `${product.weight}g` : "-"}
                </li>
              </ul>
            </div>
            {cartMessage && (
              <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
                {cartMessage}
              </div>
            )}
            {cartError && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {cartError}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                className="!bg-red-600 text-white py-2 px-5 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                onClick={handleBuyNow}
              >
                Mua ngay
              </button>
              <button
                className="border border-gray-300 text-gray-700 py-2 px-5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>

        {/* Review */}
        <Review productId={id} userId={userId} />

        {/* Modal để nhập số lượng */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "400px",
              padding: "0",
              borderRadius: "12px",
              border: "none",
              background: "transparent",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Chọn số lượng
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Sản phẩm: <span className="font-semibold">{product.name}</span>
              </label>
              <div className="flex items-center justify-center space-x-4 bg-gray-50 p-3 rounded-lg">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 !text-gray-700 rounded-full text-4xl hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-2xl font-semibold text-gray-800 w-12 text-center transition-all duration-200">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={increaseQuantity}
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 !text-gray-700 rounded-full hover:bg-gray-300 transition-colors text-4xl"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 !bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                onClick={handleConfirmBuy}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}