import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(() => {
    // Kiểm tra localStorage để lấy user nếu có
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Lấy thông tin người dùng từ API
  const fetchUser = async (authToken = token) => {
    if (!authToken) return;
    try {
      const response = await axios.get(`${BASE_URL}/api/me`, {
        headers: {
          "x-token": authToken,
        },
      });

      const data = response.data;
      const userData = data.data?.user || data.data;

      console.log("Fetched user data: ", userData);
      setUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu user:", error);
      logout();
    }
  };

  // Lần đầu tiên khi app khởi chạy và khi token thay đổi
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
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, fetchUser }}> {/* Add fetchUser */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
