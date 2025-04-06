import React, { useState } from "react";
import "./Products.css"; // Import CSS của bạn

export default function Products() {
  const [products, setProducts] = useState([
    { id: 1, name: "Sản phẩm 1", price: 100 },
    { id: 2, name: "Sản phẩm 2", price: 200 },
  ]);

  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="products-container">
      <h2 className="products-title">Quản lý Sản phẩm</h2>
      <div className="add-product-btn">
        <button className="btn-add-product">
          Thêm sản phẩm
        </button>
      </div>
      <table className="products-table">
        <thead>
          <tr>
            <th className="table-header">Tên sản phẩm</th>
            <th className="table-header">Giá</th>
            <th className="table-header">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="table-cell">{product.name}</td>
              <td className="table-cell">{product.price} VNĐ</td>
              <td className="table-cell">
                <button className="btn-edit">
                  Sửa
                </button>
                <button 
                  onClick={() => handleDelete(product.id)} 
                  className="btn-delete">
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
