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
  const [Categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState(null);
const [editCategoryName, setEditCategoryName] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
    fetchCatagorys();
  }, []);
  const fetchCatagorys = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/pub/categories`);
      if (res.data.success) {
        setCategories(res.data.data.categories);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách danh mục:", err);
    }
  };
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
          categoryIds: [parseInt(newCategory)],
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
      setCategories([...Categories, res.data.data]);
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
      setCategories(Categories.filter((cat) => cat.id !== id));
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
        Categories.map((cat) =>
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
      categoryId: product.categories[0]?.id || "", // Sửa lại thành product.categories[0]?.name
    });
  };

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };

const handleUpdate = async (id) => {
  try {
    const payload = {
      name: editForm.name,
      description: editForm.description,
      price: editForm.price,
      imageUrl: editForm.imageUrl,
      categoryIds: [parseInt(editForm.categoryId)], // Gửi đúng ID
    };

    const res = await axios.put(`${API_ADMIN}/${id}`, payload, {
      headers: {
        "x-token": token,
      },
    });

    if (res.data.success) {
      const updated = products.map((p) =>
        p.id === id ? res.data.data : p
      );
      setProducts(updated);
      setEditId(null);
      await fetchProducts();
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
        <select
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        >
          <option value="">--Chọn danh mục--</option>
          {Array.isArray(Categories) &&
            Categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>

        <button className="btn-add-product" onClick={handleAddProduct}>
          Thêm sản phẩm
        </button>
      </div>
<ul className="category-list">
  <div class="add-category-form">
    <input type="text" placeholder="Tên danh mục" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
    <button className="btn-add-category" onClick={handleAddCategory}>Thêm danh mục</button>
  </div>
  {Categories.map((cat) => (
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
            <button className="btn-save" onClick={handleUpdateCategory}>Lưu</button>
            <button className="btn-cancel" onClick={() => setEditCategoryId(null)}>Hủy</button>
          </div>
        </>
      ) : (
        <>
          <div className="left-content">
            <strong>ID:</strong> {cat.id} &nbsp; <strong>Tên:</strong> {cat.name}
          </div>
          <div className="action-buttons">
            <button className="btn-edit" onClick={() => startEditCategory(cat)}>Sửa</button>
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
  <select
    value={editForm.categoryId}
    onChange={(e) => handleEditChange("categoryId", e.target.value)}
  >
    <option value="">--Chọn danh mục--</option>
    {Categories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
  </select>
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
