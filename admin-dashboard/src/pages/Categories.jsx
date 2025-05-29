import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Categories.css"; // Bạn có thể tạo file CSS mới cho trang này

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/pub/categories`);
      if (res.data.success) {
        setCategories(res.data.data.categories);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách danh mục:", err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/api/admin/categories`,
        {
          name: newCategoryName,
        },
        {
          headers: {
            "x-token": token,
          },
        }
      );
      if (res.data.success) {
        setCategories([...categories, res.data.data]);
        setNewCategoryName("");
      }
    } catch (err) {
      alert("Không thể thêm danh mục");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá danh mục này?")) return;

    try {
      const res = await axios.delete(`${BASE_URL}/api/admin/categories/${id}`, {
        headers: {
          "x-token": token,
        },
      });
      if (res.data.success) {
        setCategories(categories.filter((cat) => cat.id !== id));
      }
    } catch (err) {
      alert("Không thể xoá danh mục");
      console.error(err);
    }
  };

  const startEditCategory = (cat) => {
    setEditCategoryId(cat.id);
    setEditCategoryName(cat.name);
  };

  const handleUpdateCategory = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/api/admin/categories/${editCategoryId}`,
        { name: editCategoryName },
        {
          headers: {
            "x-token": token,
          },
        }
      );
      if (res.data.success) {
        setCategories(
          categories.map((cat) =>
            cat.id === editCategoryId ? res.data.data : cat
          )
        );
        setEditCategoryId(null);
        setEditCategoryName("");
      }
    } catch (err) {
      alert("Không thể cập nhật danh mục");
      console.error(err);
    }
  };

  return (
    <div className="categories-container">
      <h2 className="categories-title">Quản lý Danh mục</h2>

      <div className="add-category-form">
        <input
          type="text"
          placeholder="Tên danh mục"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button className="btn-add-category" onClick={handleAddCategory}>
          Thêm danh mục
        </button>
      </div>

      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.id}>
            {editCategoryId === cat.id ? (
              <>
                <div className="left-content">
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                </div>
                <div className="action-buttons">
                  <button className="btn-save" onClick={handleUpdateCategory}>
                    Lưu
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => setEditCategoryId(null)}
                  >
                    Hủy
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="left-content">
                  <strong>ID:</strong> {cat.id} &nbsp; <strong>Tên:</strong>{" "}
                  {cat.name}
                </div>
                <div className="action-buttons">
                  <button
                    className="btn-edit"
                    onClick={() => startEditCategory(cat)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn-delete-category"
                    onClick={() => handleDeleteCategory(cat.id)}
                  >
                    Xoá
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
