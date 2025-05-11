import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Menu.css";
import { CartContext } from "../context/CartContext";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Menu() {
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [selectedCategory, setSelectedCategory] = useState(null); // Danh mục được chọn
  const [foods, setFoods] = useState([]); // Danh sách món ăn
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi

  const { addToCart } = useContext(CartContext);

  // Fetch tất cả danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/pub/categories`);
        const result = response.data;

        if (result.success && Array.isArray(result.data.categories)) {
          setCategories(result.data.categories);
        } else {
          setError("Không có dữ liệu danh mục.");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API danh mục:", err);
        setError("Không thể tải danh sách danh mục.");
      } finally {
        setLoading(false); // Đảm bảo loading là false sau khi fetch xong
      }
    };

    fetchCategories();
  }, []);

  // Fetch món ăn theo danh mục đã chọn
  useEffect(() => {
    if (selectedCategory !== null) {
      const category = categories.find((cat) => cat.id === selectedCategory);

      if (category) {
        setFoods(category.menuItems); // Lấy món ăn từ danh mục đã chọn
      }
    } else {
      // Khi không chọn danh mục, lấy tất cả món ăn
      const allMenuItems = categories.flatMap((category) => category.menuItems);
      setFoods(allMenuItems);
    }
  }, [selectedCategory, categories]);

  if (loading) return <p>Đang tải thực đơn...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="menu-container">
      <h2 className="menu-title">Thực Đơn</h2>

      {/* Lọc danh mục */}
      <div className="menu-selection">
        <button
          className={`menu-selection-button ${selectedCategory === null ? "active" : ""}`}
          onClick={() => setSelectedCategory(null)}
        >
          Tất cả
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`menu-selection-button ${selectedCategory === category.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Danh sách món ăn */}
      <div className="menu-list">
        {foods.length > 0 ? (
          foods.map((food) => (
            <div className="menu-item" key={food.id}>
              <div className="menu-content">
                <img
                  src={food.imageUrl || food.image || "default-image.jpg"}
                  alt={food.name}
                  className="menu-image"
                />
                <div className="menu-info">
                  <h3 className="menu-name">{food.name}</h3>
                  <p className="menu-description">{food.description || "Không có mô tả"}</p>
                  <button className="menu-add-to-cart" onClick={() => addToCart(food)}>
                    THÊM VÀO GIỎ
                  </button>
                  <Link to={`/food/${food.id}`} className="menu-link">
                    Xem chi tiết
                  </Link>
                </div>
                <div className="menu-price">
                  {parseFloat(food.price).toLocaleString()}₫
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
