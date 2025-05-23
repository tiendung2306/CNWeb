"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"

const Profile = () => {
  const navigate = useNavigate()
  const { user, logout, isLoggedIn, fetchUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "" })
  const [successMessage, setSuccessMessage] = useState(""); // Add state for success message
  const [errorMessage, setErrorMessage] = useState(""); // Add state for error message
  const token = localStorage.getItem("token");

  // Xử lý chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    } else {
      setLoading(false)
    }
  }, [isLoggedIn, navigate])

  useEffect(() => {
    console.log("User data in Profile:", user)
    if (user) {
      setEditData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      })
    }
  }, [user])

  const handleLogout = () => {
    logout()
    setLoading(false)
    navigate("/")
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      await updateUser(editData)
      await fetchUser()
      setIsEditing(false)
      setSuccessMessage("Cập nhật tài khoản thành công!"); // Set success message
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Error updating user:", error)
      setErrorMessage("Cập nhật tài khoản thất bại! Vui lòng thử lại."); // Set error message
      setTimeout(() => setErrorMessage(""), 3000); // Clear message after 3 seconds
    }
  }

  const handlePasswordChange = async () => {
    try {
      await changePassword(passwordData)
      setShowPasswordModal(false)
      setSuccessMessage("Cập nhật mật khẩu thành công!"); // Set success message
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Error changing password:", error)
      setErrorMessage("Đổi mật khẩu thất bại! Vui lòng thử lại."); // Set error message
      setTimeout(() => setErrorMessage(""), 3000); // Clear message after 3 seconds
    }
  }

  const updateUser = async (data) => {
    await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/user/${user.id}`, 
      {
        username: data.username,
      },
      {
        headers: { "x-token": token },
      }
    );
    // if (data.staus == 500) {
    //   throw new Error("Server error")
    // }
    console.log("Updating user with data:", data)
  }

  const changePassword = async (data) => {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/changePassword`, 
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
      {
        headers: { "x-token": token },
      }
    );
    
    console.log("Changing password with data:", data)
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Không có dữ liệu người dùng.</p>
      </div>
    )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Hồ sơ cá nhân</h2>

      {successMessage && ( // Display success message
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[2000]">
          {successMessage}
        </div>
      )}

      {errorMessage && ( // Display error message
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-[2000]">
          {errorMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên:</label>
                  <input
                    type="text"
                    name="username"
                    value={editData.username}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    disabled // Make email field disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ:</label>
                  <input
                    type="text"
                    name="address"
                    value={editData.address}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-1 text-sm">Tên</p>
                <p className="font-medium">{user.username || "Chưa cập nhật"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-1 text-sm">Email</p>
                <p className="font-medium">{user.email || "Chưa cập nhật"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-1 text-sm">Số điện thoại</p>
                <p className="font-medium">{user.phone || "Chưa cập nhật"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-1 text-sm">Địa chỉ</p>
                <p className="font-medium">{user.address || "Chưa cập nhật"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-1 text-sm">Mật khẩu</p>
                <p className="font-medium">*******</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-3 justify-center">
          {isEditing ? (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={handleSave}
            >
              Lưu
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleEditToggle}
            >
              Chỉnh sửa
            </button>
          )}

          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            onClick={() => setShowPasswordModal(true)}
          >
            Đổi mật khẩu
          </button>

          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Đổi mật khẩu</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu cũ</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu cũ"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={() => setShowPasswordModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handlePasswordChange}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
