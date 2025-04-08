import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Hàm fetch user từ API nếu có token
  const fetchUser = async (authToken = token) => {
    if (!authToken) return;
    try {
      const response = await fetch("http://localhost:3000/api/me", {
        method: "GET",
        headers: { "x-token": authToken }, // Sửa lỗi truyền token
      });
      if (response.ok) {
        const data = (await response.json()).data;
        console.log("Dữ liệu user:", data.user);
        setUser(data.user);
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        logout();
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu user:", error);
    }
  };

  // Kiểm tra token khi mở trang
  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [token]); // Đảm bảo gọi lại khi token thay đổi

  const login = (userInfo, authToken) => {
    setIsLoggedIn(true);
    setUser(userInfo);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userInfo));
    localStorage.setItem("token", authToken);
    fetchUser(authToken); // Gọi fetch ngay khi đăng nhập
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
