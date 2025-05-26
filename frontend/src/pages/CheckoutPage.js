import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Checkout.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CheckoutPage = () => {
  const { cart, addToCart, clearCart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [suggestedProducts, setSuggestedProducts] = useState([]);

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
          const randomSuggestions = getRandomItems(data.data, 5);
          setSuggestedProducts(randomSuggestions);
        }
      } catch (err) {
        console.error("Lỗi khi fetch gợi ý:", err);
      }
    };
    fetchSuggestions();
  }, []);

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

      if (formData.paymentMethod === "Cash") {
        // ✅ COD: Tạo đơn hàng rồi thanh toán

        await axios.post(
          `${BASE_URL}/api/payment`,
          {
            orderId,
            amount: totalAmount,
            paymentMethod: "Cash",
            paymentStatus: "Completed",
          },
          {
            headers: { "x-token": token },
          }
        );

        // Gửi hóa đơn
        try {
          await axios.post(`${BASE_URL}/api/orders/${orderId}/invoice`, null, {
            headers: { "x-token": token },
          });
        } catch (err) {
          console.error(
            "❌ Gửi hóa đơn thất bại:",
            err.response?.data || err.message
          );
        }

        clearCart();
        navigate("/order-status?vnp_ResponseCode=00");
      } else if (formData.paymentMethod === "Momo") {
        // ✅ Momo: Gửi thông tin sang gateway, chưa tạo đơn hàng
        const vnpayRes = await axios.post(
          `${BASE_URL}/api/payment/createPaymentVNPAY`,
          {
            amount: totalAmount,
            orderType: "Other",
            orderDescription: `Thanh toan don hang ${orderId}`,
          },
          {
            headers: { "x-token": token },
          }
        );

        const paymentUrl = vnpayRes.data.vnpUrl;
        if (
          !paymentUrl ||
          typeof paymentUrl !== "string" ||
          !paymentUrl.startsWith("https")
        )
          throw new Error("Không tạo được URL thanh toán.");

        // 👉 redirect sang trang thanh toán
        window.location.href = paymentUrl;
      }
    } catch (err) {
      console.error("Lỗi khi đặt hàng:", err.response?.data || err.message);
      setError("❌ Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
      navigate("/order-status");
    } finally {
      setLoading(false);
    }
  };
  const getImageUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    if (url.startsWith("http")) return url;
    // Nếu url là số (kiểu "2", "11") hoặc không chứa dấu ".", thì bỏ qua
    if (!url.includes(".")) return null;
    return `${BASE_URL}/${url}`;
  };
  return (
    <div className="checkout-container">
      <h2>Trang thanh toán</h2>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {error && <div className="error-message">{error}</div>}

      {productsToBuy.length > 0 ? (
        <div className="checkout-content">
          {/* Chi tiết đơn hàng */}
          <div className="checkout-details">
            <h3>Thông tin đơn hàng</h3>
            {productsToBuy.map((item) => (
              <div key={item.id} className="checkout-item">
                <img
                  src={item.image || item.imageUrl}
                  alt={item.name}
                  className="checkout-image"
                />
                <div>
                  <h4>{item.name}</h4>
                  <p>
                    {item.price.toLocaleString()}₫ x {item.quantity}
                  </p>
                </div>
              </div>
            ))}
            <h3>Tổng tiền: {totalAmount.toLocaleString()}₫</h3>
          </div>

          {/* Form giao hàng */}
          <div className="checkout-form">
            <h3>Thông tin giao hàng</h3>
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ giao hàng"
              value={formData.address}
              onChange={handleChange}
            />
            <select
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onChange={handleChange}
            >
              <option>Giao hàng tiêu chuẩn</option>
              <option>Giao hàng ngay - Miễn phí nếu trên 1 triệu</option>
            </select>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="Cash">Thanh toán khi nhận hàng (COD)</option>
              <option value="Momo">Thanh toán qua Momo</option>
            </select>
            <button
              className="order-button"
              onClick={handleOrder}
              disabled={loading}
            >
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
          <h3>Sản phẩm có thể bạn thích</h3>
          {suggestedProducts.map((product) => (
            <div key={product.id} className="suggested-item">
              {getImageUrl(product.imageUrl) ? (
                <img
                  src={getImageUrl(product.imageUrl)}
                  alt={product.name}
                  className="suggested-image"
                />
              ) : (
                <div className="suggested-placeholder">Không có ảnh</div>
              )}

              <p>{product.name}</p>
              <p>{parseFloat(product.price).toLocaleString()}₫</p>
              <button
                onClick={() =>
                  addToCart({
                    ...product,
                    image: product.image || product.imageUrl || "", // Chuẩn hóa tên trường
                  })
                }
              >
                Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
