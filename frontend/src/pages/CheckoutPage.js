import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import "./Checkout.css";

const suggestedProducts = [
  { id: 101, name: "Bánh Mì Thịt", price: 25000, image: "/images/banhmi.jpg" },
  { id: 102, name: "Nước Ép Cam", price: 30000, image: "/images/nuocep.jpg" },
  { id: 103, name: "Trà Sữa Trân Châu", price: 40000, image: "/images/trasua.jpg" },
];

const CheckoutPage = () => {
  const { cart, addToCart, clearCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    deliveryMethod: "Giao hàng tiêu chuẩn",
    paymentMethod: "Cash",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (location.state?.product) {
      setSelectedProduct(location.state.product);
    }
  }, [location.state]);

  const productsToBuy = selectedProduct ? [selectedProduct] : cart;

  const totalAmount = productsToBuy.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOrder = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.user.userId;
  
      const deliveryAddress = `${formData.fullName}, ${formData.phone}, ${formData.address}`;
  
      const orderItems = productsToBuy.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));
  
      if (formData.paymentMethod === "Cash") {
        // ✅ COD: Tạo đơn hàng rồi thanh toán
        const orderRes = await axios.post(
          `${BASE_URL}/api/order`,
          {
            userId,
            deliveryAddress,
            deliveryMethod: formData.deliveryMethod,
            orderItems,
            totalAmount,
          },
          {
            headers: { "x-token": token },
          }
        );
  
        const orderId = orderRes.data?.data?.order?.id;
        if (!orderId) throw new Error("Không lấy được ID đơn hàng.");
  
        await axios.post(`${BASE_URL}/api/payment`, {
          orderId,
          amount: totalAmount,
          paymentMethod: "Cash",
          paymentStatus: "Pending",
        }, {
          headers: { "x-token": token },
        });
  
        // Gửi hóa đơn
        try {
          await axios.post(`${BASE_URL}/api/orders/${orderId}/invoice`, null, {
            headers: { "x-token": token },
          });
        } catch (err) {
          console.error("❌ Gửi hóa đơn thất bại:", err.response?.data || err.message);
        }
  
        clearCart();
        navigate("/order-success");
      } else if (formData.paymentMethod === "Momo") {
        // ✅ Momo: Gửi thông tin sang gateway, chưa tạo đơn hàng
        const vnpayRes = await axios.post(
          `${BASE_URL}/api/payment/vnpay`,
          {
            amount: totalAmount,
            bankCode: "",
            orderDescription: `Thanh toán đơn hàng`,
            orderType: "other",
            language: "vn",
            items: orderItems,
            deliveryAddress,
            deliveryMethod: formData.deliveryMethod,
          },
          {
            headers: { "x-token": token },
          }
        );
  
        const paymentUrl = vnpayRes.data;
        if (!paymentUrl.startsWith("http")) throw new Error("Không tạo được URL thanh toán.");
  
        // 👉 redirect sang trang thanh toán
        window.location.href = paymentUrl;
      }
  
    } catch (err) {
      console.error("Lỗi khi đặt hàng:", err.response?.data || err.message);
      setError("❌ Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
      navigate("/order-fail");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="checkout-container">
      <h2>Trang thanh toán</h2>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      {productsToBuy.length > 0 ? (
        <div className="checkout-content">
          {/* Chi tiết đơn hàng */}
          <div className="checkout-details">
            <h3>Thông tin đơn hàng</h3>
            {productsToBuy.map((item) => (
              <div key={item.id} className="checkout-item">
                <img src={item.image || item.imageUrl} alt={item.name} className="checkout-image" />
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.price.toLocaleString()}₫ x {item.quantity}</p>
                </div>
              </div>
            ))}
            <h3>Tổng tiền: {totalAmount.toLocaleString()}₫</h3>
          </div>

          {/* Form giao hàng */}
          <div className="checkout-form">
            <h3>Thông tin giao hàng</h3>
            <input type="text" name="fullName" placeholder="Họ và tên" value={formData.fullName} onChange={handleChange} />
            <input type="text" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} />
            <input type="text" name="address" placeholder="Địa chỉ giao hàng" value={formData.address} onChange={handleChange} />
            <select name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange}>
              <option>Giao hàng tiêu chuẩn</option>
              <option>Giao hàng ngay - Miễn phí nếu trên 1 triệu</option>
            </select>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
            <option value="Cash">Thanh toán khi nhận hàng (COD)</option>
            <option value="Momo">Thanh toán qua Momo</option>
            </select>
            <button className="order-button" onClick={handleOrder} disabled={loading}>
              {loading ? "Đang xử lý..." : "Đặt hàng ngay"}
            </button>
          </div>
        </div>
      ) : (
        <p>Không có sản phẩm nào trong giỏ hàng.</p>
      )}

      {/* Gợi ý sản phẩm */}
      {cart.length > 0 && (
        <div className="suggested-products">
          <h3>Sản phẩm bạn có thể quan tâm</h3>
          <div className="suggested-items">
            {suggestedProducts.map((product) => (
              <div key={product.id} className="suggested-item">
                <img src={product.image} alt={product.name} className="suggested-image" />
                <p>{product.name}</p>
                <p className="price">{product.price.toLocaleString()}₫</p>
                <button onClick={() => addToCart(product)}>Thêm vào giỏ</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
