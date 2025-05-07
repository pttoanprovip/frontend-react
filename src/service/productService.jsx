import axios from "axios";

const API_URL = "http://localhost:8080/products";

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

export const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get();
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tất cả sản phẩm: ", error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm với ID ${id}: `, error);
    throw error;
  }
};

export const addProduct = async (product) => {
  try {
    const response = await axiosInstance.post("", product);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm: ", error);
    throw error;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await axiosInstance.put(`/${id}`, product);
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật sản phẩm với ID ${id}: `, error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await axiosInstance.delete(`/${id}`);
    return { success: true };
  } catch (error) {
    console.error(`Lỗi khi xóa sản phẩm với ID ${id}: `, error);
    throw error;
  }
};

export const getProductByCriteria = async ({
  name,
  category,
  price,
  brand,
  cpu,
  ram,
  storage,
  screenSize,
  minPrice,
  maxPrice,
}) => {
  try {
    const params = {};
    if (name) params.name = name;
    if (category) params.category = category;
    if (price) params.price = price;
    if (brand) params.brand = brand;
    if (cpu) params.cpu = cpu;
    if (ram) params.ram = ram;
    if (storage) params.storage = storage;
    if (screenSize) params.screenSize = screenSize;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    const response = await axiosInstance.get("/search", { params });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sản phẩm: ", error);
    throw error;
  }
};

export const compareProducts = async (productIds) => {
  try {
    const response = await axiosInstance.post("/compare", {
      params: { ids: productIds },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi so sánh sản phẩm: ", error);
    throw error;
  }
};
