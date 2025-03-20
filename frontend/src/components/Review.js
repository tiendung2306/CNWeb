import React, { useState, useEffect } from "react";
import "./Review.css";

const Review = ({ foodId, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null); // ID review đang chỉnh sửa

  // Load đánh giá từ localStorage
  useEffect(() => {
    const storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const foodReviews = storedReviews.filter((review) => review.foodId === foodId);
    setReviews(foodReviews);
  }, [foodId]);

  // Thêm hoặc cập nhật đánh giá
  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = { id: editingId || Date.now(), foodId, userId, rating, comment };
    let updatedReviews = [...reviews];

    if (editingId) {
      // Cập nhật review đã có
      updatedReviews = reviews.map((rev) =>
        rev.id === editingId ? { ...rev, rating, comment } : rev
      );
    } else {
      // Thêm review mới
      updatedReviews.push(newReview);
    }

    setReviews(updatedReviews);
    localStorage.setItem("reviews", JSON.stringify([...JSON.parse(localStorage.getItem("reviews") || "[]").filter(r => r.foodId !== foodId), ...updatedReviews]));
    setEditingId(null); // Thoát chế độ chỉnh sửa
    setRating(0);
    setComment("");
  };

  // Xóa review
  const handleDelete = (id) => {
    const updatedReviews = reviews.filter((review) => review.id !== id);
    setReviews(updatedReviews);
    localStorage.setItem("reviews", JSON.stringify([...JSON.parse(localStorage.getItem("reviews") || "[]").filter(r => r.foodId !== foodId), ...updatedReviews]));
  };

  // Chỉnh sửa review
  const handleEdit = (review) => {
    setEditingId(review.id);
    setRating(review.rating);
    setComment(review.comment);
  };

  return (
    <div className="review-section">
      <h3>Đánh Giá</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Chọn số sao:
          <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} required />
        </label>
        <textarea placeholder="Viết đánh giá..." value={comment} onChange={(e) => setComment(e.target.value)} required />
        <button type="submit">{editingId ? "Cập Nhật" : "Gửi Đánh Giá"}</button>
      </form>

      <div className="review-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <p><strong>⭐ {review.rating} sao</strong></p>
              <p>{review.comment}</p>
              {review.userId === userId && (
                <div>
                  <button onClick={() => handleEdit(review)}>Chỉnh sửa</button>
                  <button onClick={() => handleDelete(review.id)}>Xóa</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Chưa có đánh giá nào.</p>
        )}
      </div>
    </div>
  );
};

export default Review;
