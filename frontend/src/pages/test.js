import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import userData from "../data/userDate"; // Import dữ liệu giả
import "./Profile.css";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user || userData[0]); // Lấy user giả nếu chưa đăng nhập
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditUser] = useState({ ...currentUser });
  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
    }
  }, [user]);
  
  return (
    
  );
};

export default Profile;