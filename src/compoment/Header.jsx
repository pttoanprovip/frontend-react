import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Search from "./Search";
import { getProductByCriteria } from "../service/productService";
import PropTypes from "prop-types";

export default function Header({ onSearchResults }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = async (searchTerm) => {
    try {
      const results = await getProductByCriteria({ name: searchTerm });
      if (typeof onSearchResults === "function") {
        onSearchResults(results); // Truyền kết quả lên component cha
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      if (typeof onSearchResults === "function") {
        onSearchResults([]); // Trả rỗng nếu lỗi
      }
    }
  };

  return (
    <header className="flex justify-between items-center bg-white px-6 py-3 shadow-sm w-screen h-22">
      {/* Logo */}
      <div className="text-2xl font-bold text-indigo-600">CELLPHONE T</div>

      {/* Search Bar */}
      <div className="flex-1 mx-6 max-w-md">
        <Search onSearch={handleSearch} />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
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
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  onSearchResults: PropTypes.func,
};

Header.defaultProps = {
  onSearchResults: () => {}, // Hàm mặc định để tránh lỗi
};