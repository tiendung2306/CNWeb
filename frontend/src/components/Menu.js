import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Menu.css";
import { CartContext } from "../context/CartContext";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;


function Menu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/pub/menuitems`);
        const result = response.data;

        if (result.success && Array.isArray(result.data)) {
          const foodsWithFallback = result.data.map((food) => ({
            ...food,
            category: food.category || "Khác",
            price: parseInt(food.price),
            rating: parseFloat(food.rating) || 0,
          }));
          setFoods(foodsWithFallback);
        } else {
          setError("Không có dữ liệu món ăn.");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError("Không thể tải danh sách món ăn.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const categories = ["Tất cả", ...Array.from(new Set(foods.map((f) => f.category)))];
  const filteredFoods = selectedCategory === "Tất cả"
    ? foods
    : foods.filter((food) => food.category === selectedCategory);
  const highRatedFoods = foods.filter((food) => food.rating >= 4.5);

  if (loading) return <p>Đang tải thực đơn...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="menu-container">
      <h2 className="menu-title">Thực Đơn</h2>

      {/* Món ăn được yêu thích */}
      {highRatedFoods.length > 0 && (
        <div className="menu-high-line">
          <h3 className="menu-high-title">Món Ăn Được Yêu Thích</h3>
          <div className="menu-high-list">
            {highRatedFoods.map((food) => (
              <div className="menu-high-item" key={food.id}>
                <img
                  src={food.imageUrl || food.image}
                  alt={food.name}
                  className="menu-high-image"
                />
                <p className="menu-high-name">{food.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lọc danh mục */}
      <div className="menu-selection">
        {categories.map((category) => (
          <button
            key={category}
            className={`menu-selection-button ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Danh sách món ăn */}
      <div className="menu-list">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <div className="menu-item" key={food.id}>
              <div className="menu-content">
                <img
                  src={food.imageUrl || food.image}
                  alt={food.name}
                  className="menu-image"
                />
                <div className="menu-info">
                  <h3 className="menu-name">{food.name}</h3>
                  <p className="menu-description">{food.description}</p>
                  <button
                    className="menu-add-to-cart"
                    onClick={() => addToCart(food)}
                  >
                    THÊM VÀO GIỎ
                  </button>
                  <Link to={`/food/${food.id}`} className="menu-link">
                    Xem chi tiết
                  </Link>
                </div>
                <div className="menu-price">
                  {food.price.toLocaleString()}₫
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="menu-no-item">Không có món ăn nào trong danh mục này.</p>
        )}
      </div>
    </div>
  );
}

export default Menu;
