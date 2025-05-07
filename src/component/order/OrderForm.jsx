import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { placeOrder } from "../../service/orderService";
import {
  getUserAddressByUserId,
  createAddress,
} from "../../service/userAddressService";
import {
  createPayment,
  executePayment,
} from "../../service/paymentPaypalService";
import Header from "../Header";
import Footer from "../Footer";
import Modal from "react-modal";
import Payment from "../payment/Payment";
import Discount from "../Discount"; // Import component Discount

// Gắn modal vào phần tử ứng dụng
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
    console.error("Error parsing token:", error.message);
    return null;
  }
};

export default function OrderForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = getUserIdFromToken();
  const { orderItems } = location.state || {};
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    phone: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    country: "VietNam",
    isDefaultAddress: false,
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [discountCode, setDiscountCode] = useState(null); // Lưu mã giảm giá
  const [discountedPrice, setDiscountedPrice] = useState(null); // Lưu giá sau giảm giá

  // Tính tổng giá trị đơn hàng
  const totalPrice = orderItems
    ? orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;

  // Callback xử lý khi áp dụng mã giảm giá
  const handleDiscountApplied = (code, price) => {
    setDiscountCode(code);
    setDiscountedPrice(price);
  };

  useEffect(() => {
    const paymentId = searchParams.get("paymentId");
    const payerID = searchParams.get("PayerID");

    if (payerID && paymentId) {
      const completePayment = async () => {
        setLoading(true);
        try {
          const result = await executePayment(paymentId, payerID);
          console.log("Execute payment response:", result);
          // Lưu thông tin đơn hàng vào localStorage
          localStorage.setItem(
            "orderInfo",
            JSON.stringify({
              orderId: result.orderId || "N/A",
              totalPrice: discountedPrice || totalPrice, // Sử dụng giá sau giảm giá nếu có
              paymentMethod: "ONLINE",
              transactionId: result.transactionId || result.id,
            })
          );
          navigate("/order-success", {
            state: {
              orderId: result.orderId || "N/A",
              totalPrice: discountedPrice || totalPrice,
              paymentMethod: "ONLINE",
              transactionId: result.transactionId || result.id,
            },
          });
        } catch (err) {
          console.error("Execute payment error:", err);
          setError(err.message || "Lỗi khi hoàn tất thanh toán PayPal");
          setSuccessMessage("");
        } finally {
          setLoading(false);
        }
      };
      completePayment();
    }
  }, [searchParams, navigate, totalPrice, discountedPrice]);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    if (!orderItems || orderItems.length === 0) {
      setError("Không có sản phẩm nào được chọn để đặt hàng.");
      return;
    }

    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const data = await getUserAddressByUserId(userId);
        setAddresses(data);
        const defaultAddress = data.find((addr) => addr.isDefaultAddress);
        setSelectedAddressId(defaultAddress ? defaultAddress.id : null);
      } catch (err) {
        console.error("Fetch addresses error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [navigate, userId, orderItems]);

  const handleAddAddress = async () => {
    setLoading(true);
    try {
      const addressRequest = {
        ...newAddress,
        userId,
        defaultAddress: newAddress.isDefaultAddress,
      };
      const newAddr = await createAddress(addressRequest);
      setAddresses([...addresses, newAddr]);
      if (newAddr.isDefaultAddress) {
        setSelectedAddressId(newAddr.id);
      }
      setShowAddForm(false);
      setNewAddress({
        phone: "",
        address: "",
        ward: "",
        district: "",
        city: "",
        country: "VietNam",
        isDefaultAddress: false,
      });
      setError(null);
    } catch (err) {
      console.error("Add address error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Vui lòng chọn hoặc thêm địa chỉ giao hàng.");
      return;
    }
    if (!paymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    setLoading(true);
    try {
      // Tạo đơn hàng trước
      const orderRequest = {
        userId,
        addressId: selectedAddressId,
        discountCode, // Gửi mã giảm giá
        order_items: orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
      console.log("Order request:", orderRequest);

      const orderResponse = await placeOrder(orderRequest);
      const orderId = orderResponse.id;
      console.log("Order response:", orderResponse);

      if (paymentMethod === "COD") {
        navigate("/order-success", {
          state: {
            orderId,
            totalPrice: discountedPrice || totalPrice, // Sử dụng giá sau giảm giá nếu có
            paymentMethod,
          },
        });
      } else if (paymentMethod === "ONLINE") {
        // Lưu thông tin đơn hàng vào localStorage trước khi chuyển hướng
        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            orderId,
            totalPrice: discountedPrice || totalPrice,
            paymentMethod: "ONLINE",
          })
        );

        const paymentRequest = {
          orderId,
          paymentMethod: "PAYPAL",
        };
        console.log("Payment request:", paymentRequest);

        const paymentResponse = await createPayment(paymentRequest);
        console.log("Payment response:", paymentResponse);

        if (
          typeof paymentResponse === "string" &&
          paymentResponse.startsWith("https://")
        ) {
          window.location.href = paymentResponse; // Chuyển hướng đến PayPal
        } else {
          console.error("No redirectUrl in payment response:", paymentResponse);
          throw new Error(
            "Không thể tạo thanh toán PayPal: Không có redirectUrl"
          );
        }
      }
    } catch (err) {
      console.error("Place order error:", err);
      setError(err.message || "Lỗi khi tạo đơn hàng hoặc thanh toán");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results) => {
    console.log("Search results:", results);
  };

  if (error && !successMessage) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onSearchResults={handleSearchResults} />
        <div className="flex-1 bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-red-500">Lỗi: {error}</p>
            <button
              className="!bg-red-500 text-white px-8 py-2 rounded-sm hover:bg-red-600 mt-4"
              onClick={() => navigate("/product")}
            >
              Quay lại mua sắm
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
      <div className="flex-1 bg-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-medium mb-6">Xác Nhận Đơn Hàng</h1>

            {/* Danh sách sản phẩm */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Sản Phẩm</h2>
              {loading ? (
                <p className="text-gray-500">Đang tải...</p>
              ) : !orderItems || orderItems.length === 0 ? (
                <p className="text-gray-500">Không có sản phẩm nào.</p>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between items-center border-b py-2"
                    >
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-gray-600">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <p className="text-red-600 font-bold">
                        {(item.price * item.quantity).toLocaleString()}₫
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-lg mt-4">
                    <span>Tổng cộng (trước giảm giá):</span>
                    <span className="text-red-600">
                      {totalPrice.toLocaleString()}₫
                    </span>
                  </div>
                  {discountedPrice && (
                    <div className="flex justify-between font-bold text-lg mt-2">
                      <span>Tổng cộng (sau giảm giá):</span>
                      <span className="text-green-600">
                        {discountedPrice.toLocaleString()}₫
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Địa chỉ giao hàng */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Địa Chỉ Giao Hàng</h2>
              {loading ? (
                <p className="text-gray-500">Đang tải...</p>
              ) : addresses.length === 0 ? (
                <p className="text-gray-500">Chưa có địa chỉ nào.</p>
              ) : (
                <section className="space-y-2">
                  <select
                    value={selectedAddressId || ""}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:border-red-500 focus:bg-red-50"
                  >
                    <option value="" disabled>
                      Chọn địa chỉ
                    </option>
                    {[...addresses]
                      .sort(
                        (a, b) =>
                          (b.isDefaultAddress ? 1 : 0) -
                          (a.isDefaultAddress ? 1 : 0)
                      )
                      .map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.address}, {addr.ward}, {addr.district},{" "}
                          {addr.city}, {addr.country}
                          {addr.isDefaultAddress && " (Mặc định)"}
                        </option>
                      ))}
                  </select>
                </section>
              )}
              <button
                className="mt-4 !bg-red-500 text-white px-4 py-2 rounded-sm hover:bg-red-600"
                onClick={() => setShowAddForm(true)}
              >
                Thêm Địa Chỉ Mới
              </button>
            </div>

            {/* Mã giảm giá */}
            <Discount
              totalPrice={totalPrice}
              onDiscountApplied={handleDiscountApplied}
            />

            {/* Phương thức thanh toán */}
            <Payment onPaymentChange={setPaymentMethod} />

            {/* Thông báo thành công */}
            {successMessage && (
              <div className="p-4 bg-green-100 text-green-700 rounded-md mb-6">
                {successMessage}
              </div>
            )}

            {/* Nút đặt hàng */}
            <div className="flex justify-end">
              <button
                className={`!bg-red-500 text-white px-8 py-3 rounded-sm hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePlaceOrder}
                disabled={
                  loading ||
                  orderItems?.length === 0 ||
                  !selectedAddressId ||
                  !paymentMethod
                }
              >
                {loading ? "Đang xử lý..." : "Đặt Hàng"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm địa chỉ */}
      <Modal
        isOpen={showAddForm}
        onRequestClose={() => setShowAddForm(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "500px",
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
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Thêm Địa Chỉ Mới
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Số Điện Thoại
              </label>
              <input
                type="text"
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Địa Chỉ Chi Tiết
              </label>
              <input
                type="text"
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phường/Xã
              </label>
              <input
                type="text"
                value={newAddress.ward}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, ward: e.target.value })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Quận/Huyện
              </label>
              <input
                type="text"
                value={newAddress.district}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, district: e.target.value })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Thành Phố
              </label>
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Quốc Gia
              </label>
              <input
                type="text"
                value={newAddress.country}
                disabled
                className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newAddress.isDefaultAddress}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    isDefaultAddress: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <label className="text-sm text-gray-600">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              onClick={() => setShowAddForm(false)}
            >
              Hủy
            </button>
            <button
              className={`px-4 py-2 !bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleAddAddress}
              disabled={
                loading ||
                !newAddress.phone ||
                !newAddress.address ||
                !newAddress.ward ||
                !newAddress.district ||
                !newAddress.city
              }
            >
              {loading ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
        </div>
      </Modal>
      <Footer />
    </div>
  );
}