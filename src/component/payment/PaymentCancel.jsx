import { useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

export default function PaymentCancel() {
  const navigate = useNavigate();

  const handleSearchResults = (results) => {
    console.log("Search results:", results);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSearchResults={handleSearchResults} />
      <div className="flex-1 bg-gray-100 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Thanh Toán Bị Hủy
            </h1>
            <p className="text-gray-700 mb-6">
              Thanh toán của bạn đã bị hủy. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => navigate("/product")}
              >
                Quay lại mua sắm
              </button>
              <button
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => navigate("/order")} // Giả sử người dùng quay lại trang đặt hàng
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}