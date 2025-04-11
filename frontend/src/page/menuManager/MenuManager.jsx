import React, { useState } from 'react'
import { PlusCircle } from "lucide-react"
import MenuItemForm from '../../components/MenuItemForm/MenuItemForm'
import MenuItemList from '../../components/MenuItemList/MenuItemList'

const MenuManager = () => {
    const menu = [
        {
            name: "Phở Bò Hà Nội",
            description: "Món phở truyền thống với nước dùng đậm đà, thịt bò tươi ngon và bánh phở mềm.",
            price: 45000,
            category: "Món Chính",
            imageUrl: "https://via.placeholder.com/150/FFC107/000000?Text=PhoBo"
        },
        {
            name: "Bún Chả",
            description: "Bún tươi ăn kèm chả thịt nướng thơm lừng và nước chấm chua ngọt đặc trưng.",
            price: 40000,
            category: "Món Chính",
            imageUrl: "https://via.placeholder.com/150/4CAF50/FFFFFF?Text=BunCha"
        },
        {
            name: "Nem Rán (Chả Giò)",
            description: "Nem rán giòn rụm với nhân thịt heo, tôm, miến và rau củ.",
            price: 35000,
            category: "Món Khai Vị",
            imageUrl: "https://via.placeholder.com/150/F44336/FFFFFF?Text=NemRan"
        }]
    const [items, setItems] = useState([])
    const [isAddingItem, setIsAddingItem] = useState(false)
    const [isEditingItem, setIsEditingItem] = useState(false)
    const [newItem, setNewItem] = useState({
        name: '',
        price: 0,
        description: '',
        imageUrl: '',
        category: '',
    })
    const handleAddItem = (newItem) => {
        setIsAddingItem(true)
        setNewItem(newItem)
        setIsAddingItem(false)
        setItems([...items, newItem])
    }
    const handleUpdateItem = (updateItem) => {
        setItems(items.map((item) => (item.id === updateItem.id ? updateItem : item)))
        setIsAddingItem(false)
    }
    const handleDeleteItem = (id) => {
        setItems(items.filter((item) => item.id !== id))
    }
    // const handleEditItem = (editItem) => {
    //     setIsAddingItem(true)
    //     setEditItem(editItem)
    // }
    // const handleCancelEdit = () => {
    //     setEditItem(null)
    // }
    const handleCancelAdd = () => {
        setIsAddingItem(false)
    }
    return (
        <div>
            <div>
                <img src="https://theme.hstatic.net/200000879247/1001261080/14/collection_banner.jpg?v=620" alt="" />
                <h1>Tất cả sản phẩm</h1>
                <p>Trang chủ / Tất cả sản phẩm</p>
            </div>
            {!isAddingItem && !isEditingItem && (
                <div>
                    <button onClick={() => setIsAddingItem(true)}>
                        <PlusCircle size={20} color="#000" /> Thêm sản phẩm
                    </button>
                </div>
            )}
            {isAddingItem && (
                <div>
                    <h2>Thêm sản phẩm mới</h2>
                    <MenuItemForm onSubmit={handleAddItem} onCancel={handleCancelAdd} />
                </div>
            )}
            {/* {editItem && (
                <div>
                    <h2>Chỉnh sửa sản phẩm</h2>
                    <MenuItemForm
                        initialValue={editItem}
                        onSubmit={handleUpdateItem}
                        onCancel={handleCancelEdit}
                    />
                </div>
            )} */}
            <MenuItemList menuItems={menu} />
        </div>
    )
}

export default MenuManager
