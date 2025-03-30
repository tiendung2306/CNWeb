import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Hàm fetch user từ API nếu có token
  const fetchUser = async (authToken) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        logout();
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu user:", error);
    }
  };

  // Kiểm tra localStorage khi mở trang
  useEffect(() => {
    if (token) {
      fetchUser(token);
    }
  }, [token]);

  const login = (userInfo, authToken) => {
    setIsLoggedIn(true);
    setUser(userInfo);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userInfo));
    localStorage.setItem("token", authToken);
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
