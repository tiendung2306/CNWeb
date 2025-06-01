import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Review.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_REVIEWS = `${BASE_URL}/api/reviews`;

const Review = ({ menuItemId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_REVIEWS}/menuitem/${menuItemId}`, {
        headers: { "x-token": token },
      });
      setReviews(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [menuItemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!menuItemId || !user?.id || rating <= 0 || !comment.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newReview = {
      id: editingId || Date.now(),
      menuItemId,
      userId: user.id,
      rating,
      comment,
    };

    try {
      if (editingId) {
        await axios.put(`${API_REVIEWS}/${editingId}`, newReview, {
          headers: { "x-token": token },
        });
        alert("Cập nhật đánh giá thành công!");
      } else {
        await axios.post(`${API_REVIEWS}`, newReview, {
          headers: { "x-token": token },
        });
        alert("Thêm đánh giá thành công!");
      }

      fetchReviews();
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
      await axios.delete(`${API_REVIEWS}/${id}`, {
        headers: { "x-token": token },
      });
      setReviews((prev) => prev.filter((review) => review.id !== id));
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
              <p>
                <strong>⭐ {review.rating} sao</strong>
              </p>
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
