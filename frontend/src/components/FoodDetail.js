import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import foodData from "../data/mockData"; // Import dữ liệu giả
import "./FoodDetail.css";
import { FaCertificate, FaTruck, FaShieldAlt, FaBoxOpen, FaHeadset, FaUndo,FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Review from "../components/Review";
const FoodDetail = () => {
  const { id } = useParams(); // Lấy ID món ăn từ URL
  const food = foodData.find((item) => item.id === Number(id)); // Tìm món ăn theo ID
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(0);
  const userId = 1
 // Lấy điểm trung bình từ đánh giá
 useEffect(() => {
  const storedReviews = JSON.parse(localStorage.getItem("reviews")) || [];
  const foodReviews = storedReviews.filter((review) => review.foodId === Number(id));

  if (foodReviews.length > 0) {
    const avg = foodReviews.reduce((sum, r) => sum + Number(r.rating), 0) / foodReviews.length;
    setAverageRating(avg);
  } else {
    setAverageRating(0);
  }
}, [id]);

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<FaStar key={i} className="star full-star" />);
    } else if (i - 0.5 <= rating) {
      stars.push(<FaStarHalfAlt key={i} className="star half-star" />);
    } else {
      stars.push(<FaRegStar key={i} className="star empty-star" />);
    }
  }
  return stars;
};

if (!food) {
  return <div className="food-detail">Món ăn không tồn tại.</div>;
}
  return (
    <div className="food-detail">
            {/* Nút quay lại */}
            <button className="back-button" onClick={() => navigate(-1)}>
        &#8592; Quay lại Menu
      </button>
      <div className="food-container">
        {/* Hình ảnh sản phẩm */}
        <div className="food-image">
          <img src={food.image} alt={food.name} />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="food-info">
          <h2>{food.name}</h2>
          <p className="status">
            Tình trạng: <span className="in-stock">Còn hàng</span>
          </p>
          <p className="description">{food.description}</p>
          <p className="price">Giá: {food.price.toLocaleString()}đ</p>
          <div className="rating">
            {renderStars(averageRating)}
            <span className="rating-score">({averageRating.toFixed(1)})</span>
          </div>
          {/* Số lượng */}
          <div className="quantity">
            <span>Số lượng:</span>
            <button>-</button>
            <input type="text" value="1" readOnly />
            <button>+</button>
          </div>

          {/* Nút mua */}
          <div className="buttons">
            <button className="add-to-cart">THÊM VÀO GIỎ</button>
            <button className="buy-now">MUA NGAY</button>
          </div>

          {/* Mã giảm giá */}
          <div className="discount">
            <button className="discount-btn">CLICK VÀO ĐÂY ĐỂ NHẬN ƯU ĐÃI</button>
          </div>
        </div>
      </div>

      {/* Chia sẻ */}
      <div className="share">
        <span>Chia sẻ: </span>
        <i className="fa-brands fa-facebook"></i>
        <i className="fa-brands fa-facebook-messenger"></i>
        <i className="fa-brands fa-twitter"></i>
        <i className="fa-brands fa-pinterest"></i>
        <i className="fa-solid fa-link"></i>
      </div>

      {/* Lợi ích khi mua hàng */}
      <div className="product-benefits">
        <div className="benefit-item">
          <FaCertificate /> <span>Cam kết 100% chính hãng</span>
        </div>
        <div className="benefit-item">
          <FaTruck /> <span>Miễn phí giao hàng</span>
        </div>
        <div className="benefit-item">
          <FaShieldAlt /> <span>Hoàn tiền 111% nếu hàng giả</span>
        </div>
        <div className="benefit-item">
          <FaBoxOpen /> <span>Mở hộp kiểm tra nhận hàng</span>
        </div>
        <div className="benefit-item">
          <FaHeadset /> <span>Hỗ trợ 24/7</span>
        </div>
        <div className="benefit-item">
          <FaUndo /> <span>Đổi trả trong 7 ngày</span>
        </div>
      </div>
      <Review foodId={food.id} userId={userId} />
    </div>
  );
};

export default FoodDetail;
