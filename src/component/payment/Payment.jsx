import PropTypes from "prop-types";
import { useState } from "react";

export default function Payment({ onPaymentChange }) {
  const [selectedPayment, setSelectedPayment] = useState("");

  const handlePaymentChange = (method) => {
    setSelectedPayment(method);
    onPaymentChange(method); 
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Phương Thức Thanh Toán</h2>
      <div className="space-y-4">
        <label
          className={`flex items-center p-4 border rounded-lg cursor-pointer ${
            selectedPayment === "COD" ? "border-red-500 bg-red-50" : "border-gray-200"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={selectedPayment === "COD"}
            onChange={() => handlePaymentChange("COD")}
            className="mr-2"
          />
          <span className="text-gray-700">Thanh toán khi nhận hàng (COD)</span>
        </label>
        <label
          className={`flex items-center p-4 border rounded-lg cursor-pointer ${
            selectedPayment === "ONLINE" ? "border-red-500 bg-red-50" : "border-gray-200"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="ONLINE"
            checked={selectedPayment === "ONLINE"}
            onChange={() => handlePaymentChange("ONLINE")}
            className="mr-2"
          />
          <span className="text-gray-700">Thanh toán trực tuyến</span>
        </label>
      </div>
    </div>
  );
}

Payment.propTypes ={
  onPaymentChange: PropTypes.func.isRequired,
}