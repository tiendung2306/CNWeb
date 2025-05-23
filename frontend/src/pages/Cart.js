import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Cart.css";

const BASE_URL =
  "http://ec2-3-0-101-188.ap-southeast-1.compute.amazonaws.com:3000";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, addToCart } =
    useContext(CartContext);
  const navigate = useNavigate();
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Hàm lấy ngẫu nhiên n phần tử từ mảng
  const getRandomItems = (data, count) => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Fetch danh sách món ăn và chọn ngẫu nhiên vài món gợi ý
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${BASE_URL}/pub/menuitems/random`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const randomSuggestions = getRandomItems(data.data, 5); // lấy 3 món ngẫu nhiên
          setSuggestedProducts(randomSuggestions);
        }
      } catch (err) {
        console.error("Lỗi khi fetch gợi ý:", err);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="cart-container">
      <div className="cart-page">
        <h2>Giỏ hàng</h2>
        {cart.length === 0 ? (
          <p>Giỏ hàng trống</p>
        ) : (
          <div className="cart-content">
            {/* Danh sách sản phẩm trong giỏ */}
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={`${BASE_URL}${item.image}`}
                    alt={item.name}
                    className="cart-image"
                  />
                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    <p>{item.price.toLocaleString()}₫</p>
                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)}>Xóa</button>
                  </div>
                </div>
              ))}
              <h3>Tổng tiền: {totalAmount.toLocaleString()}₫</h3>
              <button
                className="checkout-button"
                onClick={() => navigate("/checkout")}
              >
                Thanh toán
              </button>
            </div>

            {/* Gợi ý sản phẩm */}
            <div className="suggested-products">
              <h3>Sản phẩm có thể bạn thích</h3>
              {suggestedProducts.map((product) => (
                <div key={product.id} className="suggested-item">
                  <img
                    src={`${BASE_URL}${product.image}`}
                    alt={product.name}
                    className="suggested-image"
                  />
                  <p>{product.name}</p>
                  <p>{parseFloat(product.price).toLocaleString()}₫</p>
                  <button onClick={() => addToCart(product)}>
                    Thêm vào giỏ
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
