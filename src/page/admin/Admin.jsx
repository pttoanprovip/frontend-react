import { useEffect, useState } from "react";
import Dashboard from "../../component/Dashboard";
import { useAuth } from "../../context/AuthContext";
import {
  generateStatistics,
  getStatisticByDay,
} from "../../service/statisticService";
import { toast } from "react-toastify";

export default function Admin() {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStatistic();
  }, []);

  const fetchStatistic = async () => {
    setLoading(true);
    try {
      const respone = await generateStatistics();
      setStatistics(respone);
    } catch (error) {
      toast.error("Không thể tạo thống kê hôm nay");
    } finally {
      setLoading(false);
    }
  };

  const handleStatistic = async () => {
    if (!startDate && !endDate) {
      toast.error("Vui lòng chọn ngày bắt đầu và kết thúc");
      return;
    }
    setLoading(true);
    try {
      const response = await getStatisticByDay({
        startDate: startDate + ":00",
        endDate: endDate + ":59",
      });
      setStatistics(response);
    } catch (error) {
      toast.error("Không thể lấy thống kê");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "Admin") {
    return <p>Bạn không có quyền truy cập trang này.</p>;
  }

  return (
    <div className="flex min-h-screen min-w-screen shadow rounded-lg bg-white">
      <div className="w-1/4">
        <Dashboard />
      </div>
      <div className="w-3/4 p-8">
        <h2 className="text-2xl font-bold mb-4">Thống kê doanh thu</h2>
        <div className="flex gap-4 mb-6 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Từ ngày</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Đến ngày</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handleStatistic}
            className="!bg-red-600 text-white px-4 py-2 rounded hover:bg-red-800"
            disabled={loading}
          >
            {loading ? "Đang tải ... " : "Xem thống kê"}
          </button>
        </div>
        {statistics && (
          <div className="bg-white rounded shadow p-6 mt-4 maw-w-lg">
            <h3 className="text-lg font-bold mb-4 text-red-400">
              Kết quả thống kê
            </h3>
            <div className="mb-2">
              Từ: <b>{statistics.startDate?.replace("T", " ").slice(0, 16)}</b>
            </div>
            <div className="mb-2">
              Đến: <b>{statistics.endDate?.replace("T", " ").slice(0, 16)}</b>
            </div>
            <div className="mb-2">
              Tổng đơn hàng: <b>{statistics.totalOrder}</b>
            </div>
            <div className="mb-2">
              Tổng doanh thu:{" "}
              <b>{statistics.totalRevenue?.toLocaleString()} đ</b>
            </div>
            <div className="mb-2">
              Tổng sản phẩm bán: <b>{statistics.totalProductSold}</b>
            </div>
            <div className="mb-2 text-gray-500 text-sm">
              Thời gian tạo thống kê:{" "}
              {statistics.createAt?.replace("T", " ").slice(0, 16)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
