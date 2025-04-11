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
        headers: { "x-token": authToken },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.data.user || data.data; // Đảm bảo tương thích 2 định dạng
        console.log("Fetched user data: ", userData);
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        logout();
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu user:", error);
      logout();
    }
  };

  // Kiểm tra token khi mở trang
  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  const login = (userInfo, authToken) => {
    setIsLoggedIn(true);
    setUser(userInfo);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userInfo));
    localStorage.setItem("token", authToken);
    fetchUser(authToken);
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
