import { useLocation, useNavigate } from "react-router-dom";
import Header  from "../Header";
import Footer from "../Footer";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, totalPrice, paymentMethod, transactionId } = location.state || {};

  const handleSearchResults = (results) => {
    console.log("Kết quả tìm kiếm:", results);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearchResults={handleSearchResults} />
      <div className="flex-1 bg-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold text-green-600 mb-4">
              Đặt Hàng Thành Công!
            </h1>
            <p className="text-gray-700 mb-6">
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được ghi nhận.
            </p>
            <div className="text-left space-y-4 bg-gray-50 p-6 rounded-md mb-6">
              <p className="text-gray-800">
                <span className="font-semibold">Mã đơn hàng:</span> {orderId || "N/A"}
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Tổng tiền:</span>{" "}
                {totalPrice ? totalPrice.toLocaleString() : "N/A"}₫
              </p>
              <p className="text-gray-800">
                <span className="font-semibold">Phương thức thanh toán:</span>{" "}
                {paymentMethod === "COD"
                  ? "Thanh toán khi nhận hàng"
                  : paymentMethod === "ONLINE"
                  ? "PayPal"
                  : "N/A"}
              </p>
              {transactionId && (
                <p className="text-gray-800">
                  <span className="font-semibold">Mã giao dịch PayPal:</span> {transactionId}
                </p>
              )}
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => navigate("/")}
              >
                Về trang chủ
              </button>
              <button
                className="px-6 py-2 !bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => navigate("/product")}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}