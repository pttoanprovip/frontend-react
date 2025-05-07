// src/pages/ProductAdmin.js
import { useState, useEffect } from "react";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductByCriteria,
} from "../../service/productService";
import { addProductImage } from "../../service/imageProduct";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Dashboard from "../../component/Dashboard";

export default function ProductAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    detail: "",
    cpu: "",
    ram: "",
    storage: "",
    screenSize: "",
    brand: "",
    price: 0,
    weight: 0,
    category: { id: 0, name: "" },
  });
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    brand: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProducts();
      setProducts(response);
    } catch (error) {
      toast.error("Lỗi khi lấy danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm sản phẩm
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await getProductByCriteria(searchCriteria);
      setProducts(response);
    } catch (error) {
      toast.error("Lỗi khi tìm kiếm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Thêm sản phẩm
  const handleAddProduct = async () => {
    setLoading(true);
    try {
      const response = await addProduct(formData);
      setProducts([...products, response]);
      // Nếu có file hình ảnh, tải lên ngay
      if (imageFile) {
        await addProductImage(imageFile, response.id);
      }
      toast.success("Thêm sản phẩm thành công");
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.message || "Lỗi khi thêm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật sản phẩm
  const handleUpdateProduct = async () => {
    setLoading(true);
    try {
      const response = await updateProduct(currentProduct.id, formData);
      setProducts(
        products.map((p) => (p.id === currentProduct.id ? response : p))
      );
      // Nếu có file hình ảnh mới, cập nhật
      if (imageFile) {
        await addProductImage(imageFile, currentProduct.id);
      }
      toast.success("Cập nhật sản phẩm thành công");
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.message || "Lỗi khi cập nhật sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    setLoading(true);
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Xóa sản phẩm thành công");
    } catch (error) {
      toast.error(error.message || "Lỗi khi xóa sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      detail: "",
      cpu: "",
      ram: "",
      storage: "",
      screenSize: "",
      brand: "",
      price: 0,
      weight: 0,
      category: { id: 0, name: "" },
    });
    setImageFile(null);
    setIsEditing(false);
    setCurrentProduct(null);
  };

  // Xử lý thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("category.")) {
      setFormData((prev) => ({
        ...prev,
        category: { ...prev.category, [name.split(".")[1]]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "price" || name === "weight" ? Number(value) : value,
      }));
    }
  };

  // Mở form chỉnh sửa
  const openEditModal = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      detail: product.detail || "",
      cpu: product.cpu || "",
      ram: product.ram || "",
      storage: product.storage || "",
      screenSize: product.screenSize || "",
      brand: product.brand || "",
      price: product.price || 0,
      weight: product.weight || 0,
      category: product.category || { id: 0, name: "" },
    });
    setShowModal(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex min-h-screen min-w-screen bg-white shadow rounded-lg">
      <div className="w-1/4">
        <Dashboard />
      </div>
      <div className="w-3/4 p-8">
        <h2 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h2>

        {/* Tìm kiếm */}
        <div className="mb-4 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={searchCriteria.name}
            onChange={(e) =>
              setSearchCriteria({ ...searchCriteria, name: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Giá tối thiểu"
            value={searchCriteria.minPrice}
            onChange={(e) =>
              setSearchCriteria({ ...searchCriteria, minPrice: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Giá tối đa"
            value={searchCriteria.maxPrice}
            onChange={(e) =>
              setSearchCriteria({ ...searchCriteria, maxPrice: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Thương hiệu"
            value={searchCriteria.brand}
            onChange={(e) =>
              setSearchCriteria({ ...searchCriteria, brand: e.target.value })
            }
            className="p-2 border rounded"
          />
          <button
            onClick={handleSearch}
            className="!bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tìm kiếm
          </button>
          <button
            onClick={fetchProducts}
            className="!bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Tất cả
          </button>
        </div>

        {/* Nút thêm sản phẩm */}
        <button
          onClick={() => setShowModal(true)}
          className="mb-4 !bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Thêm sản phẩm
        </button>

        {/* Bảng sản phẩm */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Tên</th>
                <th className="p-4 text-left">Giá</th>
                <th className="p-4 text-left">Thương hiệu</th>
                <th className="p-4 text-left">Danh mục</th>
                <th className="p-4 text-left">Hình ảnh</th>
                <th className="p-4 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center">
                    Đang tải...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center">
                    Không có sản phẩm
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="p-4">{product.id}</td>
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">{product.price}</td>
                    <td className="p-4">{product.brand || "N/A"}</td>
                    <td className="p-4">{product.category?.name || "N/A"}</td>
                    <td className="p-4">
                      {product.productImages?.length > 0 ? (
                        <img
                          src={product.productImages[0].imageUrl}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        "Chưa có hình"
                      )}
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-blue-500 hover:underline"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:underline"
                      >
                        Xóa
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/products/${product.id}/images`)
                        }
                        className="text-green-500 hover:underline"
                      >
                        Quản lý hình ảnh
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal thêm/sửa sản phẩm */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md sm:max-w-lg">
              <h3 className="text-xl font-bold mb-4">
                {isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  isEditing ? handleUpdateProduct() : handleAddProduct();
                }}
              >
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Tên sản phẩm"
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <textarea
                  name="detail"
                  value={formData.detail}
                  onChange={handleFormChange}
                  placeholder="Mô tả"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  name="cpu"
                  value={formData.cpu}
                  onChange={handleFormChange}
                  placeholder="CPU"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  name="ram"
                  value={formData.ram}
                  onChange={handleFormChange}
                  placeholder="RAM"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  name="storage"
                  value={formData.storage}
                  onChange={handleFormChange}
                  placeholder="Bộ nhớ"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  name="screenSize"
                  value={formData.screenSize}
                  onChange={handleFormChange}
                  placeholder="Kích thước màn hình"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleFormChange}
                  placeholder="Thương hiệu"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  placeholder="Giá"
                  className="w-full p-2 mb-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleFormChange}
                  placeholder="Trọng lượng"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  name="category.name"
                  value={formData.category.name}
                  onChange={handleFormChange}
                  placeholder="Danh mục"
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full p-2 mb-2"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="!bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="!bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    {loading
                      ? "Đang xử lý..."
                      : isEditing
                      ? "Cập nhật"
                      : "Thêm"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
