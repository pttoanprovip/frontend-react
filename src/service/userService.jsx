import axios from "axios";

const API_URL = "http://localhost:8080/users";

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

export const add = async (userRequest) => {
  try {
    const response = await axiosInstance.post("", userRequest);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
    throw new Error(msg);
  }
};

export const getById = async (id) => {
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
};

export const update = async (id, userRequest) => {
  try {
    const response = await axiosInstance.put(`/${id}`, userRequest);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
    throw new Error(msg);
  }
};

export const deleteUser = async (id) => {
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

export const getMyInfo = async () => {
  try {
    const response = await axiosInstance.get("/myInfo");
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
    throw new Error(msg);
  }
};
