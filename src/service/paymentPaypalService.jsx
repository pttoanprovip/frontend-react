import axios from "axios";

const API_URL = "http://localhost:8080/payments/paypal";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    console.error("Axios request interceptor error:", error);
    return Promise.reject(error);
  }
);

const handleError = (error) => {
  const status = error.response?.status;
  const message = error.response?.data?.message || "Lỗi hệ thống";
  console.error("Payment error details:", {
    status,
    message,
    response: error.response?.data,
  });
  if (status === 401) throw new Error("Vui lòng đăng nhập lại");
  if (status === 400 && message.includes("Payment has already been completed")) {
    throw new Error("Thanh toán đã được hoàn tất trước đó");
  }
  throw new Error(message);
};

export const createPayment = async (paymentRequest) => {
  try {
    const response = await axiosInstance.post("/create", paymentRequest);
    console.log("Create payment response:", response.data);
    if (typeof response.data !== "string" || !response.data.startsWith("https://")) {
      console.error("Invalid create payment response:", response.data);
      throw new Error("Phản hồi từ API không phải URL hợp lệ");
    }
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const executePayment = async (paymentId, payerId) => {
  try {
    const response = await axiosInstance.get(`/execute`, {
      params: { paymentId, PayerID: payerId },
    });
    console.log("Execute payment response:", response.data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};