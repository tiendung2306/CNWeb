import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FoodDetail from "./components/FoodDetail.js"; // TRang chi tiết món ăn
// import Home from "./components/Home.js"; // Trang chủ
import Menu from "./components/Menu.js"; // Trang thực đơn
import Header from "./components/Headers.js"; // Thanh điều hướng
import Review from "./components/Review.js"; // Trang đánh giá
import Cart from "./pages/Cart.js"; // Trang giỏ hàng
import { CartProvider } from "./context/CartContext";
import CheckoutPage from "./pages/CheckoutPage.js";
import Footer from "./components/Footer.js";
import { AuthProvider } from "./context/AuthContext.js";
import Profile from "./pages/Profile.js";
function App() {
  return (
    <CartProvider>
    <AuthProvider>
    <Router>
      <Header />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/food/:id" element={<FoodDetail />} />
        <Route path="/review/:id" element={<Review />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </Router>
    </AuthProvider>
    </CartProvider>
  );
}

export default App;
