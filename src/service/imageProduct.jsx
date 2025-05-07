import axios from "axios";

const API_URL = "http://localhost:8080/images";

const getToken = () => {
  return localStorage.getItem("token");
};

const axiosInstance = axios.create({
  baseURL: API_URL,
});

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

export const addProductImage = async (file, productId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId);

    const response = await axiosInstance.post("", formData);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi thêm hình ảnh";
    throw new Error(msg);
  }
};

export const updateProductImage = async (id, productImageRequest, file) => {
  try {
    const formData = new FormData();
    // Nếu productImageRequest là object, thêm từng trường vào formData
    if (productImageRequest && typeof productImageRequest === "object") {
      Object.entries(productImageRequest).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }
    if (file) {
      formData.append("file", file);
    }

    const response = await axiosInstance.put(`/${id}`, formData);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi cập nhật hình ảnh";
    throw new Error(msg);
  }
};

export const deleteProductImage = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi xóa hình ảnh";
    throw new Error(msg);
  }
};
