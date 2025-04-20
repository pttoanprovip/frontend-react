import axios from "axios";

const API_URL = "http://localhost:8080/users/addresses";

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

export const createAddress = async (addressRequest) =>{
    try {
        const response = await axiosInstance.post("", addressRequest);
        return response.data;
    } catch (error) {
        const msg =
        error.response?.status === 401
            ? "Vui lòng đăng nhập lại"
            : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
        throw new Error(msg);
    }
}

export const deleteAddress = async (id) => {
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

export const getUserAddressByUserId = async (userId) => {
    try {
        const response = await axiosInstance.get(`/user/${userId}`, userId);
        return response.data;
    } catch (error) {
        const msg =
        error.response?.status === 401
            ? "Vui lòng đăng nhập lại"
            : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
        throw new Error(msg);
    }
}

export const updateAddress = async (id, addressRequest) => {
    try {
        const response = await axiosInstance.put(`/${id}`, addressRequest);
        return response.data;
    } catch (error) {
        const msg =
        error.response?.status === 401
            ? "Vui lòng đăng nhập lại"
            : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
        throw new Error(msg);
    }
}

export const getUserAddressById = async (id) => {
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
}