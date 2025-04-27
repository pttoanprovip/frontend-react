import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  addReview, // Thêm import
  deleteReview,
  getByProductId,
  updateReview,
} from "../service/reviewService";

export default function Review({ productId, userId }) {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rate, setRate] = useState(1);
  const [reviewError, setReviewError] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getByProductId(productId);
        setReviews(response);
      } catch (error) {
        setReviewError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userId) {
      setReviewError("Vui lòng đăng nhập để đánh giá sản phẩm");
      return;
    }
    if (!reviewText.trim()) {
      setReviewError("Vui lòng nhập nội dung đánh giá");
      return;
    }
    if (rate < 1 || rate > 5) {
      setReviewError("Đánh giá phải từ 1 đến 5 sao");
      return;
    }
    const reviewRequest = {
      userId,
      productId: parseInt(productId),
      reviewText,
      rate,
    };
    try {
      if (editingReviewId) {
        await updateReview(editingReviewId, reviewRequest);
        setReviews((prev) =>
          prev.map((review) =>
            review.id === editingReviewId
              ? { ...review, ...reviewRequest }
              : review
          )
        );
        setEditingReviewId(null);
      } else {
        const newReview = await addReview(reviewRequest); 
        setReviews((prev) => [...prev, newReview]);
      }
      setReviewText("");
      setRate(1);
      setReviewError("");
    } catch (error) {
      setReviewError(error.message);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!userId) {
      setReviewError("Vui lòng đăng nhập để đánh giá sản phẩm");
      return;
    }
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (error) {
      setReviewError(error.message);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setReviewText(review.reviewText);
    setRate(review.rate);
  };

  const handleStarClick = (star) => {
    setRate(star);
  };

  if (loading) {
    return <div>Đang tải đánh giá...</div>;
  }

  return (
    <div className="mt-8 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Đánh giá sản phẩm
      </h2>

      {/* form them cap nhat review */}
      {userId ? (
        <form onSubmit={handleSubmitReview} className="mb-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Đánh giá sao
              </label>
              <div className="flex items-center justify-center gap-1 rounded-4xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className={`text-2xl ${
                      star <= rate ? "text-yellow-500" : "text-gray-300"
                    } focus:outline-none `}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Nhận xét
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
                rows={4}
                placeholder="Viết nhận xét của bạn..."
              />
            </div>
            {reviewError && (
              <div className="text-red-500 text-sm">{reviewError}</div>
            )}
            <button
              type="submit"
              className="!bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              {editingReviewId ? "Cập nhật đánh giá" : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-gray-600 text-sm mb-4">
          Vui lòng đăng nhập để gửi đánh giá.
        </p>
      )}

      {/* danh sach review */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b pd-4 flex justify-between items-start"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">
                    {review.name || "Người dùng"}
                  </span>
                  <span className="text-yellow-500">
                    {"★".repeat(review.rate)}
                    {"☆".repeat(5 - review.rate)}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{review.reviewText}</p>

                <p className="text-gray-400 text-xs mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              {userId === review.userId && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditReview(review)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">
          Chưa có đánh giá nào cho sản phẩm này.
        </p>
      )}
    </div>
  );
}

Review.propTypes = {
  productId: PropTypes.string.isRequired,
  userId: PropTypes.string,
};