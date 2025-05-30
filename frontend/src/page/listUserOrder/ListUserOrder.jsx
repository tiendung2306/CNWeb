"use client"

import axios from "axios"
import { Package } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext.js"
import "./ListUserOrder.css"
const ListUserOrder = () => {
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [orders, setOrders] = useState([])
    const [items, setItems] = useState([])
    const [filter, setFilter] = useState("all")
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectOrder, setSelectOrder] = useState({})
    // const [searchQuery, setSearchQuery] = useState("")
    const { user } = useAuth()
    const token = localStorage.getItem("token");
    const [showDetail, setShowDetail] = useState(false)
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/order/user/${user.id}`, {
                    headers: {
                        "x-token": token
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
                                const orderItem = await axios.get(`${BASE_URL}/pub/menuitems/${response.data.data[i].orderItems[j].menuItemId}`, {
                                    headers: {
                                        "x-token": token
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
    const filterOrders = orders.filter(order => {
        const orderStatus = filter === "all" ? true : order.status === filter
        const orderDate = new Date(order.orderDate)
        const orderDateStr = orderDate.toISOString().split("T")[0]

        const start = startDate || null
        const end = endDate || null

        const matchesDate = (!start || orderDateStr >= start) && (!end || orderDateStr <= end)

        return matchesDate && orderStatus

    }
    )

    const newOrder = () => {
        navigate('/menu')
    }
    const openPopup = (order) => {
        setShowDetail(true)
        setSelectOrder(order)
    }
    const closePopup = () => {
        setShowDetail(false)
        setSelectOrder({})
    }
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

                    <button onClick={newOrder} className="btn btn-primary">
                        <Package className="icon" />
                        Đơn hàng mới
                    </button>
                </div>
            </div>

            <div className="filters">
                <div className="filterDate">
                    <div className="filterDateItem">
                        <div>
                            <label>Từ ngày :</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className=""
                            />
                        </div>
                    </div>
                    <div className="filterDateItem">
                        <div>
                            <label>Đến ngày :</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className=""
                            />
                        </div>
                    </div>
                </div>


                <select className="status-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">Toàn bộ đơn hàng</option>
                    <option value="Pending">Chờ xác nhận</option>
                    <option value="Preparing">Đang chuẩn bị</option>
                    <option value="Completed">Sẵn sàng</option>
                    <option value="Delivering">Đang vận chuyển</option>
                </select>
            </div>
            {
                showDetail && (
                    <div className="popup-overlay" onClick={closePopup}>
                        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                            <h2>Chi tiết đơn hàng</h2>
                            <p><strong>Mã đơn:</strong> {selectOrder.id}</p>
                            <p><strong>Địa chỉ:</strong> {selectOrder.deliveryAddress}</p>
                            <p><strong>Ngày đặt:</strong> {formatDate(selectOrder.orderDate)}</p>
                            <p><strong>Trạng thái:</strong> {selectOrder.status}</p>

                            <div className="popup-items">
                                <h3>Món đã đặt</h3>
                                {items[orders.findIndex(order => order.id === selectOrder.id)]?.map((item, key) => (
                                    <div key={key} className="popup-item">
                                        <img src={item.imageUrl || "/placeholder.svg"} alt={item.name} className="popup-item-img" />
                                        <div className="popup-item-info">
                                            <p>{item.name}</p>
                                            <p>Số lượng: {item.quantity}</p>
                                            <p>Giá: ${(item.quantity * item.price).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="popup-close" onClick={closePopup}>Đóng</button>
                        </div>
                    </div>
                )
            }
            <div className="orders-container">
                {filterOrders.length > 0 ? (
                    filterOrders.map((order, index) => (
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
                                    <button onClick={(e) => openPopup(order)} className="btn btn-outline">Chi tiết</button>

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
                                                    <div className="item-price">{(item.quantity * item.price).toFixed(2)} VNĐ</div>
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

