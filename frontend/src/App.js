import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import Home from "./components/Home.js";
import FoodDetail from "./components/FoodDetail.js"; // Trang chi tiết món ăn
import Footer from "./components/Footer.js"; // Footer từ nhánh develop
import Header from "./components/Headers.js"; // Thanh điều hướng
import Menu from "./components/Menu.js"; // Trang thực đơn
import "./index.css";
import Home from "./page/home/Home.jsx"; // Trang chủ

import ChatBubble from "./components/ChatBubble.js";
import Review from "./components/Review.js"; // Trang đánh giá
import { AuthProvider } from "./context/AuthContext.js";
import { CartProvider } from "./context/CartContext";
import ListUserOrder from "./page/listUserOrder/ListUserOrder.jsx";
import Cart from "./pages/Cart.js"; // Trang giỏ hàng
import CheckoutPage from "./pages/CheckoutPage.js";
import Profile from "./pages/Profile.js";
import OrderStatus from "./status/OrderStatus.js";

import ContactPage from "./page/ContactPage.jsx";

import PrivateRoute from "./components/route/PrivateRoute.jsx";

function App() {
  return (
    <>
      <ChatBubble />
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

           
              <Route path="/contact" element={<ContactPage />} />

              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <CheckoutPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute>
                    <ListUserOrder />
                  </PrivateRoute>
                }
              />
              <Route
                path="/order-status"
                element={
                  <PrivateRoute>
                    <OrderStatus />
                  </PrivateRoute>
                }
              />{" "}
              {/* Trang trạng thái đơn hàng thành công */}

            </Routes>
            <Footer />
          </Router>
        </AuthProvider>
      </CartProvider>
    </>
  );
}

export default App;
