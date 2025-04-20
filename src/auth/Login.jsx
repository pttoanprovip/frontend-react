import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [login, setLogin] = useState({
    name: "",
    password: "",
  });

  const [error, setError] = useState(""); 

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {       
      const res = await axios.post("http://localhost:8080/auth/token", login);
      const { token } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        console.log("token da luu", token);
      } else {
        throw new Error("Token not found");
      }
    } catch (error) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản.", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-amber-300">LOGIN</h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={login.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded text-black"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={login.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded  text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}