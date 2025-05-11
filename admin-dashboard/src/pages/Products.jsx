import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Products.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Đường dẫn đến API của bạn
const API_PUBLIC = `${BASE_URL}/pub/menuitems`;
const API_ADMIN = `${BASE_URL}/api/admin/menuitems`;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_PUBLIC);
      if (res.data.success) setProducts(res.data.data);
    } catch (err) {
      console.error("Lỗi tải danh sách món ăn:", err);
    }
  };

  const handleAddProduct = async () => {
    try {
      const res = await axios.post(
        API_ADMIN,
        {
          name: newName,
          description: newDescription,
          price: newPrice,
          imageUrl: newImage,
          category: newCategory,
        },
        {
          headers: {
            "x-token": token,
          },
        }
      );
      if (res.data.success) {
        setProducts([...products, res.data.data]);
        setNewName("");
        setNewPrice("");
        setNewDescription("");
        setNewImage("");
        setNewCategory("");
      }
    } catch (err) {
      alert("Không thể thêm sản phẩm");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này?")) return;
    try {
      await axios.delete(`${API_ADMIN}/${id}`, {
        headers: {
          "x-token": token,
        },
      });
      setProducts(products.filter((product) => product.id !== id));
    } catch (err) {
      alert("Lỗi khi xoá sản phẩm");
    }
  };

  const startEdit = (product) => {
    setEditId(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.categories?.[0]?.name || "",
    });
  };

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`${API_ADMIN}/${id}`, editForm, {
        headers: {
          "x-token": token,
        },
      });
      if (res.data.success) {
        const updated = products.map((p) => (p.id === id ? res.data.data : p));
        setProducts(updated);
        setEditId(null);
      }
    } catch (err) {
      alert("Lỗi khi cập nhật sản phẩm");
    }
  };

  return (
    <div className="products-container">
      <h2 className="products-title">Quản lý Sản phẩm</h2>

      <div className="add-product-form">
        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Giá"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Mô tả"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Link hình ảnh"
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
        />
        <input
          type="text"
          value={editForm.category}
          onChange={(e) => handleEditChange("category", e.target.value)}
        />
        <button className="btn-add-product" onClick={handleAddProduct}>
          Thêm sản phẩm
        </button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Danh mục</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <img src={product.imageUrl} alt={product.name} width="60" />
              </td>

              {editId === product.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) =>
                        handleEditChange("description", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editForm.price}
                      onChange={(e) =>
                        handleEditChange("price", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editForm.categorys}
                      onChange={(e) =>
                        handleEditChange("category", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn-save"
                      onClick={() => handleUpdate(product.id)}
                    >
                      Lưu
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => setEditId(null)}
                    >
                      Hủy
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}₫</td>
                  <td>
                    {product.categories && product.categories.length > 0
                      ? product.categories.map((c) => c.name).join(", ")
                      : "Chưa xác định"}
                  </td>

                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => startEdit(product)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product.id)}
                    >
                      Xoá
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
