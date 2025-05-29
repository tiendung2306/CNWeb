import React, { useState } from 'react'
import './MenuItemList.css'
const MenuItemList = ({ menuItems, onEdit, onDelete }) => {
    const [itemtoDelete, setItemToDelete] = useState(null)

    const confirmDelete = (id) => {
        setItemToDelete(id)
    }
    const handleDelete = () => {
        if (itemtoDelete) {
            onDelete(itemtoDelete)
            setItemToDelete(null)
        }
    }
    const cancelDelete = () => {
        setItemToDelete(null)
    }
    if (menuItems.length === 0) {
        return (
            <div className="empty-state">
                <h3 className="empty-title">Menu hiện đang trống</h3>
                <p className="empty-subtitle">Thêm sản phẩm đầu tiên của bạn để bắt đầu</p>
            </div>
        )
    }
    return (
        <div>
            <h2 className='title'>Danh sách sản phẩm</h2>
            <div className="items-grid">
                {menuItems.map((item, index) => (
                    <div className="item-card" key={index}>
                        <img src={item.imageUrl} alt={item.name} className="item-image" />
                        <p className='item-name'>{item.name}</p>
                        <button onClick={() => onEdit(item)}>Edit</button>
                        <button onClick={() => confirmDelete(item.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MenuItemList
