import axios from "axios";

const API_URL_AUTH = "http://localhost:8080/auth";
const API_URL_USER = "http://localhost:8080/users";

export const login = async (name, password) => {
  const response = await axios.post(
    `${API_URL_AUTH}/token`,
    {
      name,
      password,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

export const logout = async (token) => {
  await axios.post(`${API_URL_AUTH}/logout`, { token });
};

export const register = async (name, password, phone, email) => {
  const response = await axios.post(`${API_URL_USER}`, {
    name,
    password,
    phone,
    email,
  }, {
    headers: {"Content-Type" : "application/json"},
  });
  return response.data;
};

export const loginWithGoogle = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

export const handleGoogleCallback = async () => {
  try {
    const response = await axios.get(`${API_URL_AUTH}/oauth2/success`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Đăng nhập Google thất bại: ", error.response?.data || error.message);
    throw error;
  }
};
