import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./OrderStatus.css";

export default function OrderStatus() {
    const [searchParams] = useSearchParams();
    const [isSuccess, setIsSuccess] = useState(false);
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem("token");
    const apiCallMade = useRef(false);

    const { cart, addToCart, clearCart } = useContext(CartContext);

    useEffect(() => {
        console.log("OrderStatus useEffect triggered, apiCallMade:", apiCallMade.current);

        // Lấy thông tin từ URL
        const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
        const orderDescription = searchParams.get("vnp_OrderInfo");

        if (!orderDescription) {
            if (vnp_ResponseCode === "00") {
                setIsSuccess(true);
            } else {
                setIsSuccess(false);
            }
            return;
        }

        const orderId = Number(orderDescription.split(" ")[4]);
        const amount = Number(searchParams.get("vnp_Amount")) / 100;

        // Tạo ID giao dịch duy nhất
        const transactionId = `payment_${orderId}_${amount}`;

        // Kiểm tra xem giao dịch này đã được xử lý trong localStorage chưa
        const processedTransactions = JSON.parse(localStorage.getItem("processedTransactions") || "{}");

        // Nếu API đã được gọi trong render trước đó hoặc đã được lưu trong localStorage, không gọi lại
        if (apiCallMade.current || processedTransactions[transactionId]) {
            console.log("API call already made or transaction already processed:", transactionId);
            // Vẫn cập nhật UI state để hiển thị kết quả
            setIsSuccess(vnp_ResponseCode === "00");
            return;
        }

        const processPayment = async () => {
            // Đánh dấu là API đang được gọi
            apiCallMade.current = true;

            // Xác định trạng thái thanh toán
            const isPaymentSuccess = vnp_ResponseCode === "00";
            console.log(`Processing payment... Status: ${isPaymentSuccess ? 'SUCCESS' : 'FAILED'}, orderId: ${orderId}, amount: ${amount}`);

            setIsSuccess(isPaymentSuccess);

            try {
                console.log("Sending payment API call...");
                // Gọi API thanh toán
                await axios.post(`${BASE_URL}/api/payment`, {
                    orderId,
                    amount: amount,
                    paymentMethod: "Momo",
                    paymentStatus: isPaymentSuccess ? "Completed" : "Failed",
                }, {
                    headers: { "x-token": token },
                });
                console.log("API call completed successfully");

                // Lưu giao dịch đã xử lý vào localStorage
                processedTransactions[transactionId] = {
                    processedAt: new Date().toISOString(),
                    status: isPaymentSuccess ? "Completed" : "Failed"
                };
                localStorage.setItem("processedTransactions", JSON.stringify(processedTransactions));
                console.log("Transaction saved to localStorage:", transactionId);

                // Xóa giỏ hàng nếu thanh toán thành công
                if (isPaymentSuccess) {
                    console.log("Payment successful, clearing cart");
                    clearCart();
                }
            } catch (error) {
                console.error("Error processing payment:", error);
                // Set lại flag nếu API gọi thất bại để có thể thử lại
                apiCallMade.current = false;
            }
        };

        processPayment();
    }, []);

    return (
        <div className={`order-status ${isSuccess ? 'success' : 'fail'}`}>
            <div className="icon">{isSuccess ? '✅' : '❌'}</div>
            <h1>{isSuccess ? 'Đặt hàng thành công!' : 'Đặt hàng thất bại'}</h1>
            <p>
                {isSuccess
                    ? 'Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận.'
                    : 'Rất tiếc, đã có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.'}
            </p>
            <Link to={isSuccess ? "/" : "/cart"} className="btn">
                {isSuccess ? 'Quay lại trang chủ' : 'Quay lại giỏ hàng'}
            </Link>
        </div>
    );
} 