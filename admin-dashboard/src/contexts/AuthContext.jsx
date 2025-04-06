import React, { createContext, useContext, useState } from "react";

// Dữ liệu giả cho tài khoản người dùng
const fakeUser = {
  email: "admin@example.com",
  password: "admin123", // Mật khẩu giả
};

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (email === fakeUser.email && password === fakeUser.password) {
      setUser({ email }); // Nếu đúng, lưu thông tin người dùng vào state
    } else {
      throw new Error("Email hoặc mật khẩu không đúng");
    }
  };

  const logout = () => {
    setUser(null); // Đăng xuất, xóa thông tin người dùng
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
