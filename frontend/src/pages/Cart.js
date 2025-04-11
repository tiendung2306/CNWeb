import React, { useContext } from "react";
import { useNavigate } from "react-router-dom"; // Chuyển hướng trang
import { CartContext } from "../context/CartContext";
import "./Cart.css";

// Danh sách sản phẩm gợi ý
const suggestedProducts = [
  { id: 101, name: "Bánh Mì Thịt", price: 25000, image: "/images/banhmi.jpg" },
  { id: 102, name: "Nước Ép Cam", price: 30000, image: "/images/nuocep.jpg" },
  { id: 103, name: "Trà Sữa Trân Châu", price: 40000, image: "/images/trasua.jpg" },
];

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, addToCart } = useContext(CartContext);
  const navigate = useNavigate(); // Hook để điều hướng trang

  // Tổng tiền
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <div className="cart-page">
        <h2>Giỏ hàng</h2>
        {cart.length === 0 ? (
          <p>Giỏ hàng trống</p>
        ) : (
          <div className="cart-content">
            {/* Giỏ hàng */}
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-image" />
                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    <p>{item.price.toLocaleString()}₫</p>
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)}>Xóa</button>
                  </div>
                </div>
              ))}
              <h3>Tổng tiền: {totalAmount.toLocaleString()}₫</h3>
              <button className="checkout-button" onClick={() => navigate("/checkout")}>
                Thanh toán
              </button>
            </div>

            {/* Gợi ý sản phẩm */}
            <div className="suggested-products">
              <h3>Sản phẩm có thể bạn thích</h3>
              {suggestedProducts.map((product) => (
                <div key={product.id} className="suggested-item">
                  <img src={product.image} alt={product.name} className="suggested-image" />
                  <p>{product.name}</p>
                  <p>{product.price.toLocaleString()}₫</p>
                  <button onClick={() => addToCart(product)}>Thêm vào giỏ</button>
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
