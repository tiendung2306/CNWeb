import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Home from "./components/Home.js"; 
import Home from "./page/home/Home.jsx";// Trang chủ
import FoodDetail from "./components/FoodDetail.js"; // Trang chi tiết món ăn
import Menu from "./components/Menu.js"; // Trang thực đơn
import Footer from "./components/Footer.js"; // Footer từ nhánh develop
import Header from "./components/Headers.js"; // Thanh điều hướng
import Review from "./components/Review.js"; // Trang đánh giá
import { AuthProvider } from "./context/AuthContext.js";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart.js"; // Trang giỏ hàng
import ListUserOrder from './page/listUserOrder/ListUserOrder.jsx'
import CheckoutPage from "./pages/CheckoutPage.js";
import Profile from "./pages/Profile.js";
import OrderFail from "./status/OrderFail.js";
import OrderSuccess from "./status/OrderSuccess.js"; // Trang trạng thái đơn hàng thành công
function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/food/:id" element={<FoodDetail />} />
            <Route path="/review/:id" element={<Review />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<ListUserOrder />} />
            <Route path="/order-success" element={<OrderSuccess />} /> {/* Trang trạng thái đơn hàng thành công */}
            <Route path="/order-fail" element={<OrderFail />} /> {/* Trang trạng thái đơn hàng thất bại */}
          </Routes>
          <Footer />
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
