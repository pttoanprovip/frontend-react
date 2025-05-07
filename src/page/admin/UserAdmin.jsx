import { useEffect, useState } from "react";
import { add, deleteUser, getAll, update } from "../../service/userService";
import { toast } from "react-toastify";
import Dashboard from "../../component/Dashboard";

export default function UserAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    email: "",
    phone: "",
    role: "User",
  });

  const getRoleId = (role) => {
    if (role === "Admin") return 1;
    return 2;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAll();
      setUsers(response);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // thêm người dùng
  const handleAddUser = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        roleId: getRoleId(formData.role),
      };
      const response = await add(payload);
      setUsers([...users, response]);
      toast.success("Thêm người dùng thành công");
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error("Lỗi khi thêm người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Xóa người dùng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      return;
    }
    setLoading(true);
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
      toast.success("Xóa người dùng thành công");
    } catch (error) {
      toast.error("Lỗi khi xóa người dùng" || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật người dùng
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = {
        ...formData,
        roleId: getRoleId(formData.role),
      };
      const response = await update(currentUser.id, payload);
      setUsers(
        users.map((user) => (user.id === currentUser.id ? response : user))
      );
      toast.success("Cập nhật người dùng thành công");
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error("Lỗi khi cập nhật người dùng" || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      password: "",
      email: "",
      phone: "",
      role: "User",
    });
    setIsEditing(false);
    setCurrentUser(null);
  };

  const openEditModal = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setFormData({
      name: user.name,
      password: user.password,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-screen min-w-screen bg-white shadow rounded-lg">
      <div className="w-1/4">
        <Dashboard />
      </div>
      <div className="w-3/4 p-8">
        <h2 className="text-2xl font-bold mb-4">Quản lý người dùng</h2>

        <button
          onClick={() => {
            setShowModal(true);
            setIsEditing(false);
          }}
          className="mb-4 !bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Thêm người dùng
        </button>

        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left">Tên</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Số điện thoại</th>
                  <th className="p-4 text-left">Vai trò</th>
                  <th className="p-4 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.phone}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-blue-500 hover:underline"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
                {isEditing ? "Sửa người dùng" : "Thêm người dùng"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Tên</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Mật khẩu</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Vai trò</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
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
                  onClick={isEditing ? handleUpdate : handleAddUser}
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
