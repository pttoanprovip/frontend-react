import { useNavigate } from "react-router-dom";
import {
  UsersIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { logout } from "../service/authService";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      logoutUser();
      toast.success("Đăng xuất thành công");
      navigate("/login");
    } catch (error) {
      toast.error("Lỗi đăng xuất thất bại");
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-xl flex flex-col items-center px-8 py-12">
      <h1
        className="text-xl font-light text-white mb-10 tracking-tight drop-shadow-md cursor-pointer"
        onClick={() => navigate("/admin")}
      >
        Dashboard
      </h1>
      <div className="w-full max-w-md space-y-6">
        <button
          className="w-full flex items-center gap-3 bg-white text-blue-800 font-semibold px-6 py-4 rounded-lg shadow-md hover:bg-blue-50 hover:scale-105 transition-transform duration-200"
          onClick={() => navigate("/admin/user")}
        >
          <UsersIcon className="h-6 w-6 text-blue-600" />
          Quản lý người dùng
        </button>
        <button
          className="w-full flex items-center gap-3 bg-white text-blue-800 font-semibold px-6 py-4 rounded-lg shadow-md hover:bg-blue-50 hover:scale-105 transition-transform duration-200"
          onClick={() => navigate("/admin/product")}
        >
          <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
          Quản lý sản phẩm
        </button>
        <button
          className="w-full flex items-center gap-3 bg-white text-blue-800 font-semibold px-6 py-4 rounded-lg shadow-md hover:bg-blue-50 hover:scale-105 transition-transform duration-200"
          onClick={() => navigate("/admin/order")}
        >
          <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
          Quản lý đơn hàng
        </button>
        <button
          className="w-full flex items-center gap-3 bg-white text-blue-800 font-semibold px-6 py-4 rounded-lg shadow-md hover:bg-blue-50 hover:scale-105 transition-transform duration-200"
          onClick={() => navigate("/admin/discount")}
        >
          <TicketIcon className="h-6 w-6 text-blue-600" />
          Quản lý mã giảm giá
        </button>
        <button
          className="w-full flex items-center gap-3 bg-white text-blue-800 font-semibold px-6 py-4 rounded-lg shadow-md hover:bg-blue-50 hover:scale-105 transition-transform duration-200"
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
