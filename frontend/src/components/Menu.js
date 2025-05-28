import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Menu.css";
import { CartContext } from "../context/CartContext";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Menu() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { addToCart } = useContext(CartContext);

  // Lấy danh sách categories từ API
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
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Lấy danh sách món ăn khi thay đổi danh mục

  // Lấy món ăn cho danh mục đã chọn
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/pub/categories`);
        const result = response.data;

        if (result.success && Array.isArray(result.data.categories)) {
          let filteredFoods = [];

          // Tìm món ăn theo danh mục đã chọn
          result.data.categories.forEach((category) => {
            if (
              category.name === selectedCategory ||
              selectedCategory === "Tất cả"
            ) {
              filteredFoods = [...filteredFoods, ...category.menuItems];
            }
          });

          setFoods(filteredFoods);
        } else {
          setError("Không có dữ liệu món ăn.");
        }
      } catch (err) {
        console.error("Lỗi khi gọi API món ăn:", err);
        setError("Không thể tải danh sách món ăn.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [selectedCategory]);

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFoods = foods.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(foods.length / itemsPerPage);

  if (loading) return <p>Đang tải thực đơn...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="menu-container">
      <h2 className="menu-title">Thực Đơn</h2>

      {/* Món ăn được yêu thích */}
      {foods.filter((food) => food.rating >= 4.5).length > 0 && (
        <div className="menu-high-line">
          <h3 className="menu-high-title">Món Ăn Được Yêu Thích</h3>
          <div className="menu-high-list">
            {foods
              .filter((food) => food.rating >= 4.5)
              .slice(0, 10) // Giới hạn hiển thị
              .map((food) => (
                <div className="menu-high-item" key={food.id}>
                  <img
                    src={food.imageUrl || food.image || "default-image.jpg"}
                    alt={food.name}
                    className="menu-high-image"
                  />
                  <p className="menu-high-name">{food.name}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Bộ lọc danh mục */}
      <div className="menu-selection">
        <button
          className={`menu-selection-button ${
            selectedCategory === "Tất cả" ? "active" : ""
          }`}
          onClick={() => {
            setSelectedCategory("Tất cả");
            setCurrentPage(1); // Đặt lại trang khi chọn "Tất cả"
          }}
        >
          Tất cả
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`menu-selection-button ${
              selectedCategory === category.name ? "active" : ""
            }`}
            onClick={() => {
              setSelectedCategory(category.name);
              setCurrentPage(1); // Đặt lại trang khi thay đổi danh mục
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Danh sách món ăn */}
      <div className="menu-list">
        {currentFoods.length > 0 ? (
          currentFoods.map((food) => (
            <div className="menu-item" key={food.id}>
              <div className="menu-content">
                <img
                  src={food.imageUrl || food.image || "default-image.jpg"}
                  alt={food.name}
                  className="menu-image"
                />
                <div className="menu-info">
                  <h3 className="menu-name">{food.name}</h3>
                  <p className="menu-description">
                    {food.description || "Không có mô tả"}
                  </p>
                  <button
                    className="menu-add-to-cart"
                    onClick={() =>
                      addToCart({
                        ...food,
                        image: food.image || food.imageUrl || "", // Chuẩn hóa tên trường
                      })
                    }
                  >
                    Thêm vào giỏ
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
          <p className="menu-no-item">
            Không có món ăn nào trong danh mục này.
          </p>
        )}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            Trang Trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Trang Sau
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;
