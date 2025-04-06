import { createContext, useState, useContext, useEffect } from "react";

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
      const data = await response.json();
      console.log("Fetched user data: ", data); // Debugging
      if (data.success) {
        setUser(data.data); // Đảm bảo set lại user
        setIsLoggedIn(true); // Đảm bảo thay đổi trạng thái login
        localStorage.setItem("user", JSON.stringify(data.data));
      } else {
        logout();
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu user:", error);
      logout(); // Nếu có lỗi, logout
    }
  };

  // Kiểm tra token khi mở trang
  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setIsLoggedIn(false); // Nếu không có token, logout
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
