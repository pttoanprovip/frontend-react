import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { placeOrder } from "../../service/orderService";
import {
  getUserAddressByUserId,
  createAddress,
} from "../../service/userAddressService";
import Header from "../Header";

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

export default function OrderForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);
  const [newAddress, setNewAddress] = useState({
    address: "",
    ward: "",
    district: "",
    city: "",
    country: "",
    phone: "",
    defaultAddress: false,
  });

  const { orderItems = [] } = location.state || {};

  // Debug log để kiểm tra orderItems
  useEffect(() => {
    console.log("OrderItems received in OrderForm:", orderItems);
    if (orderItems.length === 0) {
      setError("Không có sản phẩm nào được chọn. Vui lòng quay lại giỏ hàng.");
      navigate("/cart");
    }
  }, [orderItems, navigate]);

  const userId = getUserIdFromToken();

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      const data = await getUserAddressByUserId(userId);
      setAddresses(data);
      const defaultAddress = data.find((addr) => addr.defaultAddress);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else if (data.length > 0) {
        setSelectedAddress(data[0].id);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const addressRequest = { ...newAddress, userId };
      const newAddr = await createAddress(addressRequest);
      setAddresses([...addresses, newAddr]);
      setSelectedAddress(newAddr.id);
      setShowNewAddressForm(false);
      setNewAddress({
        address: "",
        ward: "",
        district: "",
        city: "",
        country: "",
        phone: "",
        defaultAddress: false,
      });
      setSuccess("Thêm địa chỉ thành công!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!userId) {
      setError("Bạn cần đăng nhập để đặt hàng.");
      setLoading(false);
      return;
    }

    if (!selectedAddress) {
      setError("Vui lòng chọn hoặc thêm địa chỉ giao hàng.");
      setLoading(false);
      return;
    }

    if (orderItems.length === 0) {
      setError("Không có sản phẩm nào được chọn để đặt hàng.");
      setLoading(false);
      return;
    }

    try {
      const orderRequest = {
        userId,
        addressId: selectedAddress,
        orderProducts: orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
      const response = await placeOrder(orderRequest);
      setOrderResponse(response);
      setSuccess("Đặt hàng thành công!");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results) => {
    console.log("Kết quả tìm kiếm:", results);
  };

  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2">Đang xử lý...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearchResults={handleSearchResults} />

      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 flex-1 flex flex-col">
          <div className="flex-1 overflow-auto pb-24">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-2xl font-medium mb-6 text-center">Tóm tắt yêu cầu</h1>

              <div className="space-y-6">
                {/* Thông báo lỗi hoặc thành công */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {success}
                  </div>
                )}

                {/* Phần chọn địa chỉ */}
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4">Địa chỉ giao hàng</h2>
                  {addresses.length > 0 ? (
                    <select
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                    >
                      {addresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {`${addr.address}, ${addr.ward}, ${addr.district}, ${addr.city}, ${addr.country} - ${addr.phone}${
                            addr.defaultAddress ? " (Mặc định)" : ""
                          }`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-500">Chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</p>
                  )}
                  <button
                    className="mt-2 text-blue-600 hover:underline"
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  >
                    {showNewAddressForm ? "Ẩn form thêm địa chỉ" : "Thêm địa chỉ mới"}
                  </button>

                  {/* Form thêm địa chỉ mới */}
                  {showNewAddressForm && (
                    <form onSubmit={handleAddAddress} className="mt-4 p-4 bg-gray-50 rounded">
                      <h3 className="text-md font-semibold mb-4">Thêm địa chỉ mới</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <input
                          type="text"
                          placeholder="Địa chỉ (số nhà, tên đường)"
                          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newAddress.address}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, address: e.target.value })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="Phường/Xã"
                          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newAddress.ward}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, ward: e.target.value })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="Quận/Huyện"
                          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newAddress.district}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, district: e.target.value })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="Thành phố"
                          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="Quốc gia"
                          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newAddress.country}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, country: e.target.value })
                          }
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Số điện thoại"
                          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={newAddress.phone}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, phone: e.target.value })
                          }
                          required
                        />
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={newAddress.defaultAddress}
                            onChange={(e) =>
                              setNewAddress({ ...newAddress, defaultAddress: e.target.checked })
                            }
                          />
                          Đặt làm địa chỉ mặc định
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                        disabled={loading}
                      >
                        Thêm địa chỉ
                      </button>
                    </form>
                  )}
                </div>

                {/* Phần OrderItem */}
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-4">Thông tin sản phẩm</h2>
                  {orderResponse ? (
                    <div>
                      <p className="font-medium">Mã đơn hàng: {orderResponse.id}</p>
                      <p>Tên khách hàng: {orderResponse.userFullName}</p>
                      <p>Tổng tiền: {orderResponse.total_price.toLocaleString()} VNĐ</p>
                      <p>Trạng thái: {orderResponse.orderStatus}</p>
                      <p>Ngày tạo: {new Date(orderResponse.createAt).toLocaleString()}</p>
                      <p>Mã vận chuyển GHTK: {orderResponse.ghtkOrderCode}</p>
                      <h3 className="text-md font-semibold mt-4 mb-2">Sản phẩm</h3>
                      {orderResponse.orderItem.map((item) => (
                        <div key={item.id} className="flex justify-between items-center mb-2">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p>Số lượng: {item.quantity}</p>
                          </div>
                          <p>{item.price.toLocaleString()} VNĐ</p>
                        </div>
                      ))}
                    </div>
                  ) : orderItems.length > 0 ? (
                    <div>
                      {orderItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center mb-2">
                          <div>
                            <p className="font-medium">
                              {item.productName || "Sản phẩm không xác định"}
                            </p>
                            <p>Số lượng: {item.quantity}</p>
                          </div>
                          {item.price && (
                            <p>{item.price.toLocaleString()} VNĐ</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Không có sản phẩm nào được chọn. Vui lòng quay lại giỏ hàng hoặc trang sản phẩm.
                    </p>
                  )}
                </div>

                {/* Nút đặt hàng */}
                {!orderResponse && (
                  <form onSubmit={handleSubmit}>
                    <button
                      type="submit"
                      className="w-full !bg-red-600 text-white p-3 rounded hover:bg-red-700 disabled:bg-gray-300"
                      disabled={loading || !selectedAddress || orderItems.length === 0}
                    >
                      Đặt hàng
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}