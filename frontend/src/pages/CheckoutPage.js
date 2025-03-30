// import React, { useContext } from "react";
// import { CartContext } from "../context/CartContext";
// import "./Checkout.css";

// const suggestedProducts = [
//     { id: 101, name: "Bánh Mì Thịt", price: 25000, image: "/images/banhmi.jpg" },
//     { id: 102, name: "Nước Ép Cam", price: 30000, image: "/images/nuocep.jpg" },
//     { id: 103, name: "Trà Sữa Trân Châu", price: 40000, image: "/images/trasua.jpg" },
//   ];

// const CheckoutPage = () => {
//   const { cart, addToCart } = useContext(CartContext);

//   // Tính tổng tiền giỏ hàng
//   const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

//   // Gợi ý phương thức thanh toán
//   const paymentSuggestion = totalAmount > 100000 ? "Thanh toán qua ngân hàng để nhận ưu đãi" : "Thanh toán khi nhận hàng (COD)";

//   // Kiểm tra điều kiện mã giảm giá
//   const discountCode = totalAmount > 50000 ? "GIAM10K" : null;

//   return (
//     <div className="checkout-container">
//       <h2>Trang thanh toán</h2>
//       {cart.length === 0 ? (
//         <p>Không có sản phẩm nào trong giỏ hàng.</p>
//       ) : (
//         <div className="checkout-content">
//           {/* Thông tin đơn hàng */}
//           <div className="checkout-details">
//             <h3>Thông tin đơn hàng</h3>
//             {cart.map((item) => (
//               <div key={item.id} className="checkout-item">
//                 <img src={item.image} alt={item.name} className="checkout-image" />
//                 <div>
//                   <h4>{item.name}</h4>
//                   <p>{item.price.toLocaleString()}₫ x {item.quantity}</p>
//                 </div>
//               </div>
//             ))}
//             <h3>Tổng tiền: {totalAmount.toLocaleString()}₫</h3>
//             <p className="payment-suggestion">🛒 {paymentSuggestion}</p>

//             {discountCode && (
//               <p className="discount-code">🎉 Bạn được giảm 50K! Mã giảm giá: <strong>{discountCode}</strong></p>
//             )}
//           </div>

//           {/* Form nhập thông tin giao hàng */}
//           <div className="checkout-form">
//             <h3>Thông tin giao hàng</h3>
//             <input type="text" placeholder="Họ và tên" />
//             <input type="text" placeholder="Số điện thoại" />
//             <input type="text" placeholder="Địa chỉ giao hàng" />
//             <select>
//               <option>Giao hàng tiêu chuẩn</option>
//               <option>Giao hàng ngay - Miễn phí nếu trên 1 triệu</option>
//             </select>
//             <button className="order-button">Đặt hàng ngay</button>
//           </div>
//         </div>
//       )}

//       {/* Gợi ý sản phẩm kèm theo */}
//       {cart.length > 0 && (
//         <div className="suggested-products">
//           <h3>Sản phẩm bạn có thể quan tâm</h3>
//           <div className="suggested-items">
//             {suggestedProducts.map((product) => (
//               <div key={product.id} className="suggested-item">
//                 <img src={product.image} alt={product.name} className="suggested-image" />
//                 <p>{product.name}</p>
//                 <p className="price">{product.price.toLocaleString()}₫</p>
//                 <button onClick={() => addToCart(product)}>Thêm vào giỏ</button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CheckoutPage;
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Để lấy dữ liệu truyền qua URL
import { CartContext } from "../context/CartContext";
import "./Checkout.css";

const suggestedProducts = [
  { id: 101, name: "Bánh Mì Thịt", price: 25000, image: "/images/banhmi.jpg" },
  { id: 102, name: "Nước Ép Cam", price: 30000, image: "/images/nuocep.jpg" },
  { id: 103, name: "Trà Sữa Trân Châu", price: 40000, image: "/images/trasua.jpg" },
];

const CheckoutPage = () => {
  const { cart, addToCart } = useContext(CartContext);
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Nếu có sản phẩm thanh toán riêng, lưu vào state
  useEffect(() => {
    if (location.state?.product) {
      setSelectedProduct(location.state.product);
    }
  }, [location.state]);

  // Tính tổng tiền
  const totalAmount = selectedProduct
    ? selectedProduct.price * selectedProduct.quantity
    : cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const paymentSuggestion =
    totalAmount > 100000 ? "Thanh toán qua ngân hàng để nhận ưu đãi" : "Thanh toán khi nhận hàng (COD)";

  const discountCode = totalAmount > 50000 ? "GIAM10K" : null;

  return (
    <div className="checkout-container">
      <h2>Trang thanh toán</h2>
      {selectedProduct || cart.length > 0 ? (
        <div className="checkout-content">
          {/* Thông tin đơn hàng */}
          <div className="checkout-details">
            <h3>Thông tin đơn hàng</h3>
            {selectedProduct ? (
              <div className="checkout-item">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="checkout-image" />
                <div>
                  <h4>{selectedProduct.name}</h4>
                  <p>{selectedProduct.price.toLocaleString()}₫ x {selectedProduct.quantity}</p>
                </div>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="checkout-item">
                  <img src={item.image} alt={item.name} className="checkout-image" />
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.price.toLocaleString()}₫ x {item.quantity}</p>
                  </div>
                </div>
              ))
            )}
            <h3>Tổng tiền: {totalAmount.toLocaleString()}₫</h3>
            <p className="payment-suggestion">🛒 {paymentSuggestion}</p>

            {discountCode && (
              <p className="discount-code">🎉 Bạn được giảm 50K! Mã giảm giá: <strong>{discountCode}</strong></p>
            )}
          </div>

          {/* Form nhập thông tin giao hàng */}
          <div className="checkout-form">
            <h3>Thông tin giao hàng</h3>
            <input type="text" placeholder="Họ và tên" />
            <input type="text" placeholder="Số điện thoại" />
            <input type="text" placeholder="Địa chỉ giao hàng" />
            <select>
              <option>Giao hàng tiêu chuẩn</option>
              <option>Giao hàng ngay - Miễn phí nếu trên 1 triệu</option>
            </select>
            <button className="order-button">Đặt hàng ngay</button>
          </div>
        </div>
      ) : (
        <p>Không có sản phẩm nào trong giỏ hàng.</p>
      )}

      {/* Gợi ý sản phẩm kèm theo */}
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
