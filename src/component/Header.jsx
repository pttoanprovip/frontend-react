import { useState } from "react";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import { getProductByCriteria } from "../service/productService";
import { useCart } from "../context/CartContext";
import PropTypes from "prop-types";
import { logout } from "../service/authService";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Header({ onSearchResults = () => {} }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartItemCount } = useCart();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  console.log("get Item cart: ", cartItemCount);
  

  const handleSearch = async (searchTerm) => {
    try {
      const results = await getProductByCriteria({ name: searchTerm });
      if (typeof onSearchResults === "function") {
        onSearchResults(results);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      if (typeof onSearchResults === "function") {
        onSearchResults([]);
      }
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await logout(token);
      logoutUser();
      navigate("/login");
    } catch (error) {
      toast.error("Lỗi không thể đăng xuất được: " + error.message);
    }
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleYourProfile = () => {
    navigate("/my-info");
  };

  return (
    <header className="flex justify-between items-center bg-white px-6 py-3 shadow-sm w-screen h-22">
      {/* Logo */}
      <div className="text-2xl font-bold text-indigo-600">
        <h2 onClick={() => navigate("/")} className="cursor-pointer ">
          T5104
        </h2>
      </div>

      {/* Search Bar */}
      <div className="flex-1 mx-6 max-w-md">
        <Search onSearch={handleSearch} />
      </div>

      {!user || !user.token ? (
        <div className="flex items-center h-full">
          <button
            className="!bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-6">
          {/* Biểu tượng giỏ hàng */}
          <div className="relative">
            <button onClick={handleCartClick} className="relative">
              <ShoppingCart className="w-8 h-8 text-gray-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

          {/* Dropdown người dùng */}
          <div className="relative">
            <button
              className="flex items-center space-x-2"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src="https://imgs.search.brave.com/c-ZkmWHi90ABMwIgXuOM9t7PIR6CWntGKT6GhpwE32A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAwLzY1Lzc3LzI3/LzM2MF9GXzY1Nzcy/NzE5X0ExVVY1a0xp/NW5DRVdJMEJOTExp/RmFCUEVrVWJ2NUZ2/LmpwZw"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg z-50 overflow-hidden transition-all duration-300 transform origin-top-right scale-95 animate-slide-in">
                <div className="py-1">
                  <button
                    onClick={handleYourProfile}
                    className="flex items-center w-full px-6 py-3 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 ease-in-out py-1"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                    Thông tin cá nhân
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-6 py-3 text-gray-800 hover:bg-red-100 hover:text-red-600 transition-all duration-200 ease-in-out py-1"
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

Header.propTypes = {
  onSearchResults: PropTypes.func,
};
