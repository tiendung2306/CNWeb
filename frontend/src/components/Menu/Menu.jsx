import React, { useEffect, useState } from 'react';
import './Menu.css'; // Import file CSS
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'
const Menu = () => {
    const [suggestedProducts, setSuggestedProducts] = useState([]);
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem("token");
    // Hàm lấy ngẫu nhiên n phần tử từ mảng
    const getRandomItems = (data, count) => {
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await fetch(`${BASE_URL}/pub/menuitems/random`);
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    const randomSuggestions = getRandomItems(data.data, 6); // lấy 3 món ngẫu nhiên
                    setSuggestedProducts(randomSuggestions);
                }
            } catch (err) {
                console.error("Lỗi khi fetch gợi ý:", err);
            }
        };
        fetchSuggestions();
    }, []);
    return (
        <div className="menu-container">
            <div className="menu-title">
                <h1>CÓ THỂ BẠN SẼ THÍCH</h1>

            </div>
            <div className="suggested-products">
                {!suggestedProducts || suggestedProducts.length === 0 ? (
                    <div className="error-message">Chức năng đang gặp lỗi hoặc không có dữ liệu</div>
                ) : (
                    <div className="product-grid-2-cols">
                        {suggestedProducts.map((product, index) => (
                            <div key={index} className="product-card">
                                <img
                                    src={product.imageUrl || "/placeholder.svg"}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <div>
                                    <div>
                                        <p className="product-name">{product.name}</p>
                                        <p className="product-decription">{product.decription}</p>
                                    </div>

                                    <p className="product-price">{product.price.toLocaleString()} VNĐ</p>

                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;