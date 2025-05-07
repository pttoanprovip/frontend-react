import { useState } from "react";
import { applyDiscount } from "../service/discountService";
import PropTypes from "prop-types";

export default function Discount({ onDiscountApplied, totalPrice }) {
  const [discountCode, setDiscountCode] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(null);

  const handleApplyDiscount = async () => {
    if (!discountCode) {
      setError("Vui lòng nhập mã giảm giá");
      setSuccessMessage("");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const result = await applyDiscount(discountCode, totalPrice);
      setDiscountedPrice(result);
      setSuccessMessage(`Mã giảm giá đã được áp dụng! Giá mới: ${result.toLocaleString()}₫`);
      onDiscountApplied(discountCode, result);
    } catch (err) {
      setError(err.message || "Lỗi khi áp dụng mã giảm giá");
      setDiscountedPrice(null);
      onDiscountApplied(null, null); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Mã Giảm Giá</h2>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
          placeholder="Nhập mã giảm giá"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
        />
        <button
          onClick={handleApplyDiscount}
          disabled={loading || !discountCode}
          className={`px-8 py-3 !bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Đang áp dụng..." : "Áp dụng"}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
    </div>
  );
}

Discount.propTypes = {
    
  onDiscountApplied: PropTypes.func.isRequired,
  totalPrice: PropTypes.number.isRequired,
};