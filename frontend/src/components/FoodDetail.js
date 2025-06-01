import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaCertificate,
  FaHeadset,
  FaRegStar,
  FaShieldAlt,
  FaStar,
  FaStarHalfAlt,
  FaTruck,
  FaUndo,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Review from "../components/Review";
import { CartContext } from "../context/CartContext";
import "./FoodDetail.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const userId = 1;

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const token = localStorage.getItem("token");
  console.log("BASE_URL:", BASE_URL);
  console.log("id:", id);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/pub/menuitems/${id}`, {
          headers: { "x-token": token },
        });

        const item = res.data.data;
        console.log("Món ăn đã lấy:", item);

        setFood({
          ...item,
          price: parseInt(item.price) || 0,
          rating: parseFloat(item.rating) || 0,
        });

        setAverageRating(parseFloat(item.rating) || 0);
      } catch (err) {
        console.error("Lỗi khi lấy món ăn:", err);
        setError("Không thể tải món ăn.");
      } finally {
        setLoading(false);
      }
    };

    fetchFood();
  }, [id]);

  const handleBuyNow = () => {
    navigate("/checkout", { state: { product: { ...food, quantity: 1 } } });
  };

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

  if (loading) return <div className="food-detail">Đang tải món ăn...</div>;
  if (error) return <div className="food-detail">{error}</div>;
  if (!food) return <div className="food-detail">Món ăn không tồn tại.</div>;

  return (
    <div className="food-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        &#8592; Quay lại Menu
      </button>

      <div className="food-container">
        <div className="food-image">
          <img src={food.imageUrl || food.image} alt={food.name} />
        </div>

        <div className="food-info">
          <h2>{food.name}</h2>
          <p className="status">
            Tình trạng: <span className="in-stock">{food.status == 'available' ? "Còn hàng" : "Hết hàng"}</span>
          </p>
          <p className="description">{food.description}</p>
          <p className="price">Giá: {food.price.toLocaleString()}đ</p>
          <div className="rating">
            {renderStars(averageRating)}
            <span className="rating-score">({averageRating.toFixed(1)})</span>
          </div>

          <div className="buttons">
            <button
              className="add-to-cart"
              onClick={() => addToCart(food)}
              disabled={food.status !== 'available'}
              style={{
                opacity: food.status !== 'available' ? 0.6 : 1,
                cursor: food.status !== 'available' ? 'not-allowed' : 'pointer'
              }}
            >
              THÊM VÀO GIỎ
            </button>
            <button
              className="buy-now"
              onClick={handleBuyNow}
              disabled={food.status !== 'available'}
              style={{
                opacity: food.status !== 'available' ? 0.6 : 1,
                cursor: food.status !== 'available' ? 'not-allowed' : 'pointer'
              }}
            >
              Mua ngay
            </button>
          </div>

          <div className="discount">
            <button className="discount-btn">
              CLICK VÀO ĐÂY ĐỂ NHẬN ƯU ĐÃI
            </button>
          </div>
        </div>
      </div>

      <div className="share">
        <span>Chia sẻ: </span>
        <i className="fa-brands fa-facebook"></i>
        <i className="fa-brands fa-facebook-messenger"></i>
        <i className="fa-brands fa-twitter"></i>
        <i className="fa-brands fa-pinterest"></i>
        <i className="fa-solid fa-link"></i>
      </div>

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
     <Review menuItemId={food.id} />


      {/* <Review foodId={food.id} userId={userId} /> */}
    </div>
  );
};

export default FoodDetail;
