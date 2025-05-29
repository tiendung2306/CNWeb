import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import useAuth để lấy user
import "./Review.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Review = ({ foodId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const { user } = useAuth(); // Lấy user từ AuthContext
  const token = localStorage.getItem("token");

  // Lấy danh sách review khi foodId thay đổi
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/reviews/menuitem/${foodId}`, {
        headers: { "x-token": token },
      });
      setReviews(response.data); // Lưu đánh giá vào state
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
    }
  };

  useEffect(() => {
    fetchReviews(); // Lấy danh sách review
  }, [foodId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodId || !user?.id || rating <= 0 || !comment.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newReview = { id: editingId || Date.now(), foodId, userId: user.id, rating, comment };
    
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/reviews/${editingId}`, newReview, {
          headers: { "x-token": token },
        });
        alert("Cập nhật đánh giá thành công!");
      } else {
        await axios.post(`${BASE_URL}/api/reviews`, newReview, {
          headers: { "x-token": token },
        });
        alert("Thêm đánh giá thành công!");
      }

      fetchReviews(); // Cập nhật lại danh sách review
      setRating(0);
      setComment("");
      setEditingId(null);
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      alert("Đã có lỗi xảy ra khi gửi đánh giá.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/reviews/${id}`, {
        headers: { "x-token": token },
      });
      setReviews((prev) => prev.filter((review) => review.id !== id)); // Cập nhật lại danh sách review
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
    }
  };

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
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          />
        </label>
        <textarea
          placeholder="Viết đánh giá..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit">{editingId ? "Cập Nhật" : "Gửi Đánh Giá"}</button>
      </form>

      <div className="review-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <p><strong>⭐ {review.rating} sao</strong></p>
              <p>{review.comment}</p>
              {review.userId === user?.id && (
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
