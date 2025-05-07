import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getByOrderUserId } from "../service/orderService";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "../service/userService";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const userInfo = await getMyInfo();
      if (!userInfo || !userInfo.id) {
        throw new Error("Không tìm thấy thông tin người dùng");
      }

      const response = await getByOrderUserId(userInfo.id);
      setOrders(response);
      toast.success("Thành công lấy giỏ hàng");
    } catch (error) {
      toast.error("Lấy giỏ hàng thất bại" || error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-white shadow-lg transform 
         md:translate-x-0 md:static md:w-1/4 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">Tài khoản của tôi</h3>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => navigateTo("/my-info")}
            className="w-full text-left px-4 py-2 rounded-lg bg-indigo-100 text-indigo-600 font-semibold"
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => navigateTo("/order-history")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            Lịch sử đơn hàng
          </button>
          <button
            onClick={() => navigateTo("/")}
            className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-100 text-red-600"
          >
            Quay về
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <h2 className="text-3xl font-bold text-gray-800">Lịch sử đơn hàng</h2>

        {loading ? (
          <div className="text-center">Đang tải ...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-4xl text-black">
            Không có đơn hàng nào
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">Tổng tiền</th>
                <th className="p-4 text-left">Trạng thái</th>
                <th className="p-4 text-left">Ngày đặt</th>
                <th className="p-4 text-left">Mã đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-2">{order.total_price}</td>
                  <td className="p-2">{order.orderStatus}</td>
                  <td className="p-2">{order.createAt}</td>
                  <td className="p-2">{order.ghtkOrderCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
