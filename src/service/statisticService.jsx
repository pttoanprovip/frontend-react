import axios from "axios";

const API_URL = "http://localhost:8080/statistics";

const getToken = () => {
  return localStorage.getItem("token");
};

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

export const getStatisticByDay = async (statisticRequest) => {
  try {
    const response = await axiosInstance.post("/by-date", statisticRequest);
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
    throw new Error(msg);
  }
};

export const getStatisticById = async (id) => {
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

export const generateStatistics = async () => {
  try {
    const response = await axiosInstance.post("/generate");
    return response.data;
  } catch (error) {
    const msg =
      error.response?.status === 401
        ? "Vui lòng đăng nhập lại"
        : error.response?.data?.message || "Lỗi khi thêm sản phẩm";
    throw new Error(msg);
  }
};
