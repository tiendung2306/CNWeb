"use client"

import { useState, useEffect } from "react"
import { Check, Clock, CookingPot, MoreHorizontal, Package, Search, Truck } from "lucide-react"
import axios from "axios"
import "./ListUserOrder.css"
// Sample order data
// const orders = [
//     {
//         id: "ORD-5532",
//         date: "2023-05-15T10:30:00",
//         customer: {
//             name: "John Smith",
//             address: "123 Main St, Anytown, CA",
//             phone: "(555) 123-4567",
//         },
//         items: [
//             { name: "Margherita Pizza", quantity: 2, price: 12.99, image: "https://product.hstatic.net/200000879247/product/4fa9_1ce4db0ba0c848709846b69ca6950144_464635a5446943e8bb9530efd84df17e_49182c82bdd2480fb52912fbcf2fe7d6_master.png" },
//             { name: "Garlic Bread", quantity: 1, price: 4.99, image: "/placeholder.svg?height=50&width=50" },
//             { name: "Coca Cola", quantity: 2, price: 2.49, image: "/placeholder.svg?height=50&width=50" },
//         ],
//         status: "delivered",
//         total: 35.95,
//     },
//     {
//         id: "ORD-5531",
//         date: "2023-05-15T10:15:00",
//         customer: {
//             name: "Emily Johnson",
//             address: "456 Oak Ave, Somewhere, NY",
//             phone: "(555) 987-6543",
//         },
//         items: [
//             { name: "Chicken Burger", quantity: 1, price: 9.99, image: "/placeholder.svg?height=50&width=50" },
//             { name: "French Fries", quantity: 1, price: 3.99, image: "/placeholder.svg?height=50&width=50" },
//             { name: "Milkshake", quantity: 1, price: 4.99, image: "/placeholder.svg?height=50&width=50" },
//         ],
//         status: "ready",
//         total: 18.97,
//     },
//     {
//         id: "ORD-5530",
//         date: "2023-05-15T09:45:00",
//         customer: {
//             name: "Michael Brown",
//             address: "789 Pine St, Elsewhere, TX",
//             phone: "(555) 456-7890",
//         },
//         items: [
//             { name: "Vegetable Salad", quantity: 1, price: 8.99, image: "/placeholder.svg?height=50&width=50" },
//             { name: "Grilled Chicken", quantity: 1, price: 11.99, image: "/placeholder.svg?height=50&width=50" },
//             { name: "Iced Tea", quantity: 1, price: 2.99, image: "/placeholder.svg?height=50&width=50" },
//         ],
//         status: "preparing",
//         total: 23.97,
//     },
//     {
//         id: "ORD-5529",
//         date: "2023-05-15T09:30:00",
//         customer: {
//             name: "Sarah Wilson",
//             address: "321 Elm St, Nowhere, FL",
//             phone: "(555) 789-0123",
//         },
//         items: [
//             { name: "Sushi Platter", quantity: 1, price: 24.99, image: "/placeholder.svg?height=50&width=50" },
//             { name: "Miso Soup", quantity: 2, price: 3.99, image: "/placeholder.svg?height=50&width=50" },
//             { name: "Green Tea", quantity: 2, price: 2.49, image: "/placeholder.svg?height=50&width=50" },
//         ],
//         status: "pending",
//         total: 37.95,
//     },
// ]

// Status badge component
// const StatusBadge = ({ status }) => {
//     const statusConfig = {
//         pending: { icon: Clock, label: "Pending", variant: "badge-outline" },
//         preparing: { icon: CookingPot, label: "Preparing", variant: "badge-secondary" },
//         ready: { icon: Package, label: "Ready", variant: "badge-default" },
//         delivered: { icon: Check, label: "Delivered", variant: "badge-success" },
//     }

//     const config = statusConfig[status]
//     const Icon = config.icon

//     return (
//         <span className={`badge ${config.variant}`}>
//             <Icon className="icon-small" />
//             <span>{config.label}</span>
//         </span>
//     )
// }

const ListUserOrder = () => {
    const [orders, setOrders] = useState([])
    const [items, setItems] = useState([])
    const [filter, setFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")


    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("ec2-3-0-101-188.ap-southeast-1.compute.amazonaws.com:3000/api/order/user/2", {
                    headers: {
                        "x-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MywiZW1haWwiOiJhZG1pbjFAZ21haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyNS0wMy0zMFQwMDoyMjoyNS4zNjBaIn0sImlhdCI6MTc0MzI5NDE0NX0.djSJ8j3Rrfvkm9w16bsjpoJFlvG7tKR9wrXxrkrByO0"
                    }
                })
                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    let tempUserOrders = []
                    let tempUserItems = []
                    for (let i = 0; i < response.data.data.length; i++) {
                        tempUserOrders.push(response.data.data[i].order)
                        let orderItemsWithDetails = [];
                        if (Array.isArray(response.data.data[i].orderItems)) {
                            for (let j = 0; j < response.data.data[i].orderItems.length; j++) {
                                const orderItem = await axios.get(`ec2-3-0-101-188.ap-southeast-1.compute.amazonaws.com:3000/api/menuitems/${response.data.data[i].orderItems[j].menuItemId}`, {
                                    headers: {
                                        "x-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MywiZW1haWwiOiJhZG1pbjFAZ21haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyNS0wMy0zMFQwMDoyMjoyNS4zNjBaIn0sImlhdCI6MTc0MzI5NDE0NX0.djSJ8j3Rrfvkm9w16bsjpoJFlvG7tKR9wrXxrkrByO0"
                                    }
                                })
                                if (orderItem.data && orderItem.data.data) {
                                    orderItemsWithDetails.push({
                                        ...orderItem.data.data,
                                        quantity: response.data.data[i].orderItems[j].quantity,

                                    })
                                }
                            }
                        }
                        tempUserItems.push(orderItemsWithDetails)
                    }
                    setOrders(tempUserOrders)
                    setItems(tempUserItems)
                    console.log("userOrders after update:", tempUserOrders);
                    console.log("userItems after update:", tempUserItems);
                } else {
                    console.error("Invalid response data:", response.data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error)
            }
        }
        fetchOrders()
    }, [])
    // Filter orders based on status and search query
    const filteredOrders = orders.filter((order) => {
        const matchesStatus = filter === "all" || order.status === filter
        const matchesSearch = order.id
        return matchesStatus && matchesSearch
    })

    // Format date to readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        })
    }

    return (
        <div className="container">
            <div className="header">
                <div className="header-left">
                    <h1 className="title">Lịch sử đặt hàng</h1>
                    <p className="subtitle">Quản lý và theo dõi đơn hàng</p>
                </div>
                <div className="header-right">
                    <button className="btn btn-outline">
                        <Truck className="icon" />
                        Theo dõi di chuyển
                    </button>
                    <button className="btn btn-primary">
                        <Package className="icon" />
                        Đơn hàng mới
                    </button>
                </div>
            </div>

            <div className="filters">
                <div className="search-container">
                    <Search className="search-icon" />
                    <input
                        type="search"
                        placeholder="Tìm kiếm"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select className="status-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">Toàn bộ đơn hàng</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="preparing">Đang chuẩn bị</option>
                    <option value="ready">Sẵn sàng</option>
                    <option value="delivered">Đang vận chuyển</option>
                </select>
            </div>

            <div className="orders-container">
                {orders.length > 0 ? (
                    orders.map((order, index) => (
                        <div key={index} className="order-card">
                            <div className="order-header">
                                <div className="order-header-left">
                                    <div className="order-title">
                                        Mã số đơn hàng : {order.id}
                                        {/* <StatusBadge status={order.status} /> */}
                                    </div>
                                    <p className="order-date">Được đặt vào {formatDate(order.orderDate)}</p>
                                </div>
                                <div className="order-actions">
                                    <button className="btn btn-outline">Chi tiết</button>
                                    <div className="dropdown">
                                        <button className="btn btn-icon">
                                            <MoreHorizontal className="icon" />
                                            <span className="sr-only">Thêm</span>
                                        </button>
                                        <div className="dropdown-menu">
                                            <div className="dropdown-item">Cập nhật trạng thái</div>
                                            <div className="dropdown-item">Liên hệ</div>
                                            <div className="dropdown-item">In hóa đơn</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-content">
                                <div className="order-grid">
                                    <div className="order-section">
                                        <h3 className="section-title">Thông tin khách hàng</h3>
                                        <div className="customer-info">
                                            <p className="customer-name">{order.userId}</p>
                                            <p className="customer-address">{order.deliveryAddress}</p>
                                            {/* <p className="customer-phone">{order.customer.phone}</p> */}
                                        </div>
                                    </div>
                                    <div className="order-section">
                                        <h3 className="section-title">Nội dung đơn hàng</h3>
                                        <div className="order-items">
                                            {items[index].map((item, key) => (
                                                <div key={key} className="order-item">
                                                    <img src={item.imageUrl || "/placeholder.svg"} alt={item.name} className="item-image" />
                                                    <div className="item-details">
                                                        <p className="item-name">{item.name}</p>
                                                        {/* <p className="item-quantity">
                                                            {item.quantity} × ${item.price.toFixed(2)}
                                                        </p> */}
                                                    </div>
                                                    <div className="item-price">${(item.quantity * item.price).toFixed(2)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="separator"></div>
                                <div className="order-summary">
                                    {/* <div className="items-count">
                                        {order.items.reduce((total, item) => total + item.quantity, 0)} items
                                    </div>
                                    <div className="total-amount">
                                        <p className="total-label">Total Amount</p>
                                        <p className="total-value">${order.total.toFixed(2)}</p>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-orders">
                        <div className="no-orders-content">
                            <p className="no-orders-title">No orders found</p>
                            <p className="no-orders-subtitle">Try adjusting your search or filter to find what you're looking for.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListUserOrder

