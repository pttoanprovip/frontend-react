import { useEffect, useState } from "react";
import { getMyInfo, update } from "../service/userService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  createAddress,
  deleteAddress,
  updateAddress,
} from "../service/userAddressService";

export default function MyInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
    phone: "",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    address: "",
    ward: "",
    district: "",
    city: "",
    country: "",
    phone: "",
    defaultAddress: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMyInfo();
      setUser(response);
      setFormData({
        name: response.name || "",
        email: response.email || "",
        phone: response.phone || "",
      });
    } catch (error) {
      setError(error.message || "Lỗi khi lấy thông tin người dùng");
      toast.error(error.message || "Lỗi khi lấy thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setShowEdit(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await update(user.id, formData);
      toast.success("Cập nhật thành công!");
      setShowEdit(false);
      fetchInfo();
    } catch (error) {
      toast.error(error.message || "Lỗi khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    try {
      if (isEditingAddress && currentAddress) {
        await updateAddress(currentAddress.id, addressForm);
        toast.success("Cập nhật địa chỉ thành công!");
      } else {
        await createAddress(addressForm);
        toast.success("Thêm địa chỉ thành công!");
      }
      setShowAddressModal(false);
      fetchInfo();
    } catch (error) {
      toast.error(error.message || "Lỗi khi lưu địa chỉ");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;
    try {
      await deleteAddress(id);
      toast.success("Xóa địa chỉ thành công!");
      fetchInfo();
    } catch (error) {
      toast.error(error.message || "Lỗi khi xóa địa chỉ");
    }
  };

  const handleRetry = () => {
    fetchInfo();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const openAddAddressModal = () => {
    setIsEditingAddress(false);
    setAddressForm({
      address: "",
      ward: "",
      district: "",
      city: "",
      country: "",
      phone: "",
      defaultAddress: false,
    });
    setShowAddressModal(true);
  };

  const openEditAddressModal = (addr) => {
    setIsEditingAddress(true);
    setCurrentAddress(addr);
    setAddressForm({ ...addr });
    setShowAddressModal(true);
  };

  return (
    <div className="min-h-screen min-w-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-1/4 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">Tài khoản của tôi</h3>
          <button className="md:hidden mt-2" onClick={toggleSidebar}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
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
        {/* Mobile Menu Button */}
        <button className="md:hidden mb-4" onClick={toggleSidebar}>
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Thông tin cá nhân
            </h2>
            {user && (
              <button
                onClick={handleEditProfile}
                className="!bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {/* Modal chỉnh sửa */}
          {showEdit && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <form
                onSubmit={handleUpdateProfile}
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
              >
                <h3 className="text-xl font-bold mb-4">Cập nhật thông tin</h3>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Họ tên</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Mật khẩu</label>
                  <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEdit(false)}
                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition duration-200 border-2"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg !bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Nội dung chính */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="!bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
              >
                Thử lại
              </button>
            </div>
          ) : user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-700 w-32">
                    Họ tên:
                  </span>
                  <span className="text-gray-900">
                    {user.name || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-700 w-32">
                    Email:
                  </span>
                  <span className="text-gray-900">
                    {user.email || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-700 w-32">
                    Số điện thoại:
                  </span>
                  <span className="text-gray-900">
                    {user.phone || "Chưa cập nhật"}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-700 w-32">
                    Ngày tạo:
                  </span>
                  <span className="text-gray-900">
                    {user.createAt
                      ? new Date(user.createAt).toLocaleString("vi-VN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Chưa cập nhật"}
                  </span>
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-700 block mb-2">
                  Địa chỉ:
                </span>
                {user.address && user.address.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {user.address.map((addr, idx) => (
                      <div
                        key={idx}
                        className="py-3 px-4 bg-gray-100 rounded-lg border border-gray-200"
                      >
                        <div>
                          <b>Địa chỉ:</b> {addr.address}
                        </div>
                        <div>
                          <b>Phường:</b> {addr.ward}
                        </div>
                        <div>
                          <b>Quận/Huyện:</b> {addr.district}
                        </div>
                        <div>
                          <b>Thành phố:</b> {addr.city}
                        </div>
                        <div>
                          <b>Quốc gia:</b> {addr.country}
                        </div>
                        <div>
                          <b>Số điện thoại:</b> {addr.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <b>Mặc định:</b>
                          <input
                            type="checkbox"
                            checked={addr.defaultAddress}
                            readOnly
                            className="accent-indigo-600"
                          />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            className="px-3 py-1 rounded !bg-indigo-500 text-white text-sm"
                            onClick={() => openEditAddressModal(addr)}
                          >
                            Sửa
                          </button>
                          <button
                            className="px-3 py-1 rounded !bg-red-500 text-white text-sm"
                            onClick={() => handleDeleteAddress(addr.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Không có địa chỉ</p>
                )}
                <button
                  onClick={openAddAddressModal}
                  className="mt-4 text-indigo-600 hover:underline border-2"
                >
                  Thêm địa chỉ
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500">
              Không tìm thấy thông tin người dùng
            </div>
          )}
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmitAddress}
            className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">
              {isEditingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
            </h3>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={addressForm.address}
                onChange={handleAddressInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Phường</label>
              <input
                type="text"
                name="ward"
                value={addressForm.ward}
                onChange={handleAddressInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Quận/Huyện</label>
              <input
                type="text"
                name="district"
                value={addressForm.district}
                onChange={handleAddressInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Thành phố</label>
              <input
                type="text"
                name="city"
                value={addressForm.city}
                onChange={handleAddressInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Quốc gia</label>
              <input
                type="text"
                name="country"
                value={addressForm.country}
                onChange={handleAddressInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-3">
              <label className="block mb-1 font-semibold">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={addressForm.phone}
                onChange={handleAddressInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                name="defaultAddress"
                checked={addressForm.defaultAddress}
                onChange={handleAddressInputChange}
                className="accent-indigo-600"
              />
              <label className="font-semibold">Đặt làm mặc định</label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {isEditingAddress ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Overlay cho sidebar trên mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
