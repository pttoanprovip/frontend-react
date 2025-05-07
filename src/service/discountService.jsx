import axios from "axios";

const API_URL = "http://localhost:8080/discounts";

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

export const createDiscount = async (discountRequest) => {
  try {
    const response = await axiosInstance.post("", discountRequest);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
    throw new Error(msg);
  }
};

export const updateDiscount = async (id, discountRequest) => {
  try {
    const response = await axiosInstance.put(`/${id}`, discountRequest);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
    throw new Error(msg);
  }
};

export const deleteDiscount = async (id) => {
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
};

export const getAllDiscounts = async () => {
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
};

export const getDiscountById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
    throw new Error(msg);
  }
};

export const applyDiscount = async (discountCode, totalPrice) => {
  try {
    const response = await axiosInstance.post(
      "/apply_discount",
      { code: discountCode },
      {
        params: { totalPrice },
      }
    );
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi áp dụng mã giảm giá";
    throw new Error(msg);
  }
};
