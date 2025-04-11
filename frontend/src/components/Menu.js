import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./Menu.css";
import { CartContext } from "../context/CartContext";

function Menu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const categories = ["Tất cả", "Đồ uống", "Cơm", "Phở", "Đồ ăn nhanh"];
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("http://ec2-3-0-101-188.ap-southeast-1.compute.amazonaws.com:3000/pub/menuitems");
        if (!response.ok) throw new Error("Không thể tải danh sách món ăn");

        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setFoods(result.data);
        } else {
          setError("Không có dữ liệu món ăn.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const filteredFoods =
    selectedCategory === "Tất cả"
      ? foods
      : foods.filter((food) => food.category === selectedCategory);

  const highRatedFoods = foods.filter((food) => parseFloat(food.rating) >= 4.5);

  if (loading) return <p>Đang tải thực đơn...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="menu-container">
      <h2 className="menu-title">Thực Đơn</h2>

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

      <div className="menu-selection">
        {categories.map((category) => (
          <button
            key={category}
            className={`menu-selection-button ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

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
                  {parseInt(food.price).toLocaleString()}₫
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="menu-no-item">
            Không có món ăn nào trong danh mục này.
          </p>
        )}
      </div>
    </div>
  );
}

export default Menu;
