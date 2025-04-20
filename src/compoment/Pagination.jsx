import PropTypes from "prop-types";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          currentPage === 1
            ? "!bg-gray-200 text-gray-400 cursor-not-allowed"
            : "!bg-[#D70018] text-white hover:bg-red-700 "
        }`}
      >
        Trang trước
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            currentPage === number
              ? "!bg-[#D70018] text-white"
              : "!bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          currentPage === totalPages
            ? "!bg-gray-200 text-gray-400 cursor-not-allowed"
            : "!bg-[#D70018] text-white hover:bg-red-700"
        }`}
      >
        Trang sau
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
