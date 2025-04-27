import axios from "axios";

const API_URL = "http://localhost:8080/reviews";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
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

export const addReview = async (reviewRequest) => {
  try {
    const response = await axiosInstance.post("", reviewRequest);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
    throw new Error(msg);
  }
};

export const deleteReview = async (id) => {
    try {
        const response = await axiosInstance.delete(`/${id}`);
        return response.data;
    } catch (error) {
        const msg =
        error.response?.status === 401
            ? "Vui lòng đăng nhập lại"
            : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
        throw new Error(msg);
    }
}

export const updateReview = async (id, reviewRequest) => {
    try {
        const response = await axiosInstance.put(`/${id}`, reviewRequest);
        return response.data;
    } catch (error) {
        const msg =
        error.response?.status === 401
            ? "Vui lòng đăng nhập lại"
            : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
        throw new Error(msg);
    }
}

export const getAll = async () => {
    try {
        const response = await axiosInstance.get("");
        return response.data;
    } catch (error) {
        const msg =
        error.response?.status === 401
            ? "Vui lòng đăng nhập lại"
            : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
        throw new Error(msg);
    }
}

export const getByProductId = async (productId) => {
    try {
        const response = await axiosInstance.get(`/product/${productId}`);
        return response.data;
    } catch (error) {
        const msg =
        error.response?.status === 401
            ? "Vui lòng đăng nhập lại"
            : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
        throw new Error(msg);
    }
}
