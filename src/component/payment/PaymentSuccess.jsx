import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { executePayment } from "../../service/paymentPaypalService";
import Header from "../Header";
import Footer from "../Footer";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const paymentId = searchParams.get("paymentId");
    const payerId = searchParams.get("PayerID");

    if (!paymentId || !payerId) {
      setError("Thông tin thanh toán không hợp lệ.");
      setLoading(false);
      return;
    }

    // Lấy processedPayments từ localStorage và đảm bảo là mảng
    let processedPayments = [];
    try {
      const storedPayments = localStorage.getItem("processedPayments");
      console.log("Stored payments:", storedPayments); // Debug
      if (storedPayments) {
        const parsed = JSON.parse(storedPayments);
        // Kiểm tra parsed có phải là mảng không
        if (Array.isArray(parsed)) {
          processedPayments = parsed;
        } else {
          console.warn("processedPayments is not an array:", parsed);
          processedPayments = [];
        }
      }
    } catch (err) {
      console.error("Error parsing processedPayments:", err);
      processedPayments = [];
    }

    // Kiểm tra xem paymentId đã được xử lý chưa
    if (processedPayments.includes(paymentId)) {
      console.log(`Payment ${paymentId} already processed. Redirecting to order-success.`);
      // Lấy thông tin đơn hàng từ localStorage
      const orderInfo = JSON.parse(localStorage.getItem("pendingOrder") || "{}");
      if (orderInfo && orderInfo.orderId) {
        navigate("/order-success", {
          state: {
            orderId: orderInfo.orderId || "N/A",
            totalPrice: orderInfo.totalPrice || null,
            paymentMethod: "ONLINE",
            transactionId: paymentId,
          },
        });
      } else {
        setError("Không tìm thấy thông tin đơn hàng. Vui lòng thử lại.");
      }
      setLoading(false);
      return;
    }

    const completePayment = async () => {
      try {
        const result = await executePayment(paymentId, payerId);
        console.log("Execute payment response:", result);

        // Lưu paymentId vào danh sách đã xử lý
        processedPayments.push(paymentId);
        localStorage.setItem("processedPayments", JSON.stringify(processedPayments));

        // Lấy thông tin đơn hàng từ localStorage
        const orderInfo = JSON.parse(localStorage.getItem("pendingOrder") || "{}");
        if (!orderInfo || !orderInfo.orderId) {
          throw new Error("Không tìm thấy thông tin đơn hàng.");
        }

        navigate("/order-success", {
          state: {
            orderId: orderInfo.orderId || "N/A",
            totalPrice: orderInfo.totalPrice || null,
            paymentMethod: "ONLINE",
            transactionId: result.transactionId || paymentId,
          },
        });
      } catch (err) {
        console.error("Execute payment error:", err);
        if (err.message.includes("Payment has already been completed")) {
          console.log(`Payment ${paymentId} already completed. Redirecting to order-success.`);
          // Lưu paymentId vào danh sách đã xử lý
          processedPayments.push(paymentId);
          localStorage.setItem("processedPayments", JSON.stringify(processedPayments));

          // Lấy thông tin đơn hàng từ localStorage
          const orderInfo = JSON.parse(localStorage.getItem("pendingOrder") || "{}");
          if (orderInfo && orderInfo.orderId) {
            navigate("/order-success", {
              state: {
                orderId: orderInfo.orderId || "N/A",
                totalPrice: orderInfo.totalPrice || null,
                paymentMethod: "ONLINE",
                transactionId: paymentId,
              },
            });
          } else {
            setError("Không tìm thấy thông tin đơn hàng. Vui lòng thử lại.");
          }
        } else {
          setError(err.message || "Lỗi khi hoàn tất thanh toán PayPal");
        }
      } finally {
        setLoading(false);
      }
    };
    completePayment();
  }, [searchParams, navigate]);

  const handleSearchResults = (results) => {
    console.log("Search results:", results);
  };

  if (loading) {
    return (
      <div className="min-h-screen min-w-screen flex flex-col">
        <Header onSearchResults={handleSearchResults} />
        <div className="flex-1 bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Đang xử lý thanh toán...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen min-w-screen flex flex-col">
        <Header onSearchResults={handleSearchResults} />
        <div className="flex-1 bg-gray-100 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-red-500">Lỗi: {error}</p>
            <button
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => navigate("/product")}
            >
              Quay lại mua sắm
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return null;
}