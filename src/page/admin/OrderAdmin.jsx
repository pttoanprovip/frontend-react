import { useEffect, useState } from "react";
import { getAllOrder } from "../../service/orderService";
import { toast } from "react-toastify";
import Dashboard from "../../component/Dashboard";

export default function OrderAdmin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrder();
      setOrders(response);
    } catch (error) {
      toast.error("Lỗi khi tải đơn hàng" || error.meassage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen min-w-screen bg-white shadow rounded-lg">
      <div className="w-1/4">
        <Dashboard />
      </div>
      <div className="w-3/4 p-8">
        <h2 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h2>
        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">Mã đơn</th>
                <th className="p-4 text-left">Khách hàng</th>
                <th className="p-4 text-left">Tổng tiền</th>
                <th className="p-4 text-left">Trạng thái</th>
                <th className="p-4 text-left">Ngày đặt</th>
                <th className="p-4 text-left">Mã đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-2">{order.id}</td>
                  <td className="p-2">
                    {order.userFullName || order.user?.name}
                  </td>
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
