import { useState } from "react";
import { login, loginWithGoogle } from "../../service/authService";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [form, setForm] = useState({
    name: "",
    password: "",
  });
  const [error, setError] = useState();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, password } = form;
    try {
      const response = await login(name, password);
      localStorage.setItem("token", response.token);
      console.log(response.token);
      
      navigate("/home");
    } catch (error) {
      setError(
        error.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập."
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      setError(error.message || "Đăng nhập Google thất bại.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-400 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Tên Đăng Nhập
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Mật Khẩu
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600! text-white py-2 px-4 rounded-md hover:bg-indigo-700 mb-4"
        >
          Đăng Nhập
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        className="w-full bg-red-600 text-black py-2 px-4 rounded-md hover:bg-red-700 flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            fill="currentColor"
          />
        </svg>
        Đăng nhập bằng Google
      </button>
      <p className="mt-4 text-center">
        chưa có tài khoản?{" "}
        <a href="/register" className="text-indigo-600 hover:underline">
          Đăng ký
        </a>
      </p>
    </div>
  );
}
