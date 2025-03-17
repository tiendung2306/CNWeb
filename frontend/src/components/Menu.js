import React, { useState } from "react";
import { Link } from "react-router-dom";
import foodData from "../data/mockData.js";
import "./Menu.css"; // Import file CSS

function Menu() {
  const highRatedFoods = foodData.filter((food) => food.rating >= 4.5);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  // Danh mục món ăn
  const categories = ["Tất cả", "Đồ uống", "Cơm", "Phở", "Đồ ăn nhanh"];

  // Lọc món ăn theo danh mục đã chọn
  const filteredFoods =
    selectedCategory === "Tất cả"
      ? foodData
      : foodData.filter((food) => food.category === selectedCategory);
  return (
    <div className="menu-container">
      <h2 className="menu-title">Thực Đơn</h2>
 {/* Hiển thị món ăn được đánh giá cao */}
 {highRatedFoods.length > 0 && (
        <div className="menu-high-line">
          <h3 className="menu-high-title">Món Ăn Được Yêu Thích</h3>
          <div className="menu-high-list">
            {highRatedFoods.map((food) => (
              <div className="menu-high-item" key={food.id}>
                <img src={food.image} alt={food.name} className="menu-high-image" />
                <p className="menu-high-name">{food.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
       {/* Menu Selection */}
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
{/* Hiển thị danh sách các món ăn */}
<div className="menu-list">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <div className="menu-item" key={food.id}>
              <div className="menu-content">
                <img src={food.image} alt={food.name} className="menu-image" />
                <div className="menu-info">
                  <h3 className="menu-name">{food.name}</h3>
                  <p className="menu-description">{food.description}</p>
                  <button className="menu-add-to-cart">THÊM VÀO GIỎ</button>
                  <Link to={`/food/${food.id}`} className="menu-link">
                    Xem chi tiết
                  </Link>
                </div>
                <div className="menu-price">{food.price}₫</div>
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
