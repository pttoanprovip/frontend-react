import { useEffect, useState } from "react";
import {
  createDiscount,
  deleteDiscount,
  getAllDiscounts,
  updateDiscount,
} from "../../service/discountService";
import { toast } from "react-toastify";
import Dashboard from "../../component/Dashboard";

export default function DiscountAdmin() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    maxDiscountAmount: "",
    startDate: "",
    endDate: "",
    active: true,
  });

  useEffect(() => {
    fetchDiscont();
  }, []);

  const fetchDiscont = async () => {
    setLoading(true);
    try {
      const response = await getAllDiscounts();
      setDiscounts(response);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách mã giảm giá" || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    try {
      await createDiscount(formData);
      toast.success("Thêm mã giảm giá thành công");
      setShowModal(false);
      resetForm();
      fetchDiscont();
    } catch (error) {
      toast.error("Lỗi khi thêm mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDiscount = async () => {
    setLoading(true);
    try {
      await updateDiscount(currentDiscount.id, formData);
      toast.success("Cập nhật mã giảm giá thành công");
      setShowModal(false);
      resetForm();
      fetchDiscont();
    } catch (error) {
      toast.error("Lỗi khi cập nhật mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscount = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mã này không?")) return;
    setLoading(true);
    try {
      await deleteDiscount(id);
      toast.success("Xóa mã giảm giá thành công");
      fetchDiscont();
    } catch (error) {
      toast.error("Lỗi khi xóa mã giảm giá");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discountPercentage: "",
      maxDiscountAmount: "",
      startDate: "",
      endDate: "",
      active: true,
    });
    setIsEditing(false);
    setCurrentDiscount(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "discountPercentage" || name === "maxDiscountAmount"
          ? Number(value)
          : value,
    }));
  };

  const openEditModal = (discount) => {
    setIsEditing(true);
    setCurrentDiscount(discount);
    setFormData({
      code: discount.code,
      discountPercentage: discount.discountPercentage,
      maxDiscountAmount: discount.maxDiscountAmount,
      startDate: discount.startDate?.slice(0, 16) || "",
      endDate: discount.endDate?.slice(0, 16) || "",
      active: discount.active === true,
    });
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen min-w-screen bg-white shadow rounded-lg">
      <div className="w-1/4">
        <Dashboard />
      </div>
      <div className="w-3/4 p-8">
        <h2 className="text-2xl font-bold mb-4">Quản lý mã giảm giá</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
            resetForm();
          }}
          className="mb-4 !bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Thêm mã giảm giá
        </button>

        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left">Mã</th>
                  <th className="p-4 text-left">Phần trăm</th>
                  <th className="p-4 text-left">Tối đa</th>
                  <th className="p-4 text-left">Bắt đầu</th>
                  <th className="p-4 text-left">Kết thúc</th>
                  <th className="p-4 text-left">Kích hoạt</th>
                  <th className="p-4 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((discount) => (
                  <tr key={discount.id} className="border-t">
                    <td className="p-2">{discount.code}</td>
                    <td className="p-2">{discount.discountPercentage}%</td>
                    <td className="p-2">{discount.maxDiscountAmount}</td>
                    <td className="p-2">
                      {discount.startDate?.replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="p-2">
                      {discount.endDate?.replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="p-2">{discount.active ? "Có" : "Không"}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => openEditModal(discount)}
                        className="text-blue-500 hover:underline"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteDiscount(discount.id)}
                        className="text-red-500 hover:underline"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {isEditing ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Mã</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Phần trăm (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tối đa</label>
                  <input
                    type="number"
                    name="maxDiscountAmount"
                    value={formData.maxDiscountAmount}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Ngày kết thúc
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.active}
                    onChange={handleInputChange}
                  />
                  <label className="text-sm">Kích hoạt</label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 !bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={isEditing ? handleUpdateDiscount : handleAdd}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : isEditing ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
