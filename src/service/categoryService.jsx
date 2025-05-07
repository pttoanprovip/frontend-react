import axios from "axios";

const API_URL = "http://localhost:8080/categories";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token vào header của mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Lỗi interceptor yêu cầu: ", error);
    return Promise.reject(error);
  }
);

// Lấy tất cả danh mục
export const getAll = async () => {
  try {
    const response = await axiosInstance.get("");
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi lấy danh sách danh mục";
    throw new Error(msg);
  }
};

// Lấy danh mục theo ID
export const getById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi lấy danh mục theo ID";
    throw new Error(msg);
  }
};

// Tìm kiếm danh mục theo tên
export const getByName = async (name) => {
  try {
    const response = await axiosInstance.get(`/search?name=${encodeURIComponent(name)}`);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi tìm kiếm danh mục theo tên";
    throw new Error(msg);
  }
};

// Thêm mới danh mục
export const create = async (categoryRequest) => {
  try {
    const response = await axiosInstance.post("", categoryRequest);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi tạo danh mục";
    throw new Error(msg);
  }
};

// Cập nhật danh mục
export const update = async (id, categoryRequest) => {
  try {
    const response = await axiosInstance.put(`/${id}`, categoryRequest);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi cập nhật danh mục";
    throw new Error(msg);
  }
};

// Xóa danh mục
export const deleteCategories = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data || true; // Backend trả về 204 No Content, nên trả true để xác nhận xóa thành công
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi xóa danh mục";
    throw new Error(msg);
  }
};