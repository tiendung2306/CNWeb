const orderService = require('../../services/order/order.service');
import { createdResponse, errorResponse, notFoundResponse, successResponse } from '../../helpers';
import nodemailer from "nodemailer";
import { Op } from "sequelize";
import db from "../../models/index.js";

// Create a new order
const createOrder = async (req, res) => {
    try {
        const order = await orderService.createOrder(req.body);
        return createdResponse(req, res, {...order});
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        return successResponse(req, res, {orders});
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (order) {
            return successResponse(req, res, {...order});
        } else {
            return notFoundResponse(req, res, 'Order not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

const getOrderByUserId = async (req, res) => {
    try {
        const order = await orderService.getOrderByUserId(req.params.id);
        if (order) {
            return successResponse(req, res, order);
        } else {
            return notFoundResponse(req, res, 'Order not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
}

// Update order by ID
const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await orderService.updateOrderById(req.params.id, req.body);
        if (updatedOrder) {
            return successResponse(req, res, {...updatedOrder});
        } else {
            return notFoundResponse(req, res, 'Order not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Delete order by ID
const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await orderService.deleteOrderById(req.params.id);
        if (deletedOrder) {
            return successResponse(req, res, {message: 'Order deleted successfully'});
        } else {
            return notFoundResponse(req, res, 'Order not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

export const sendInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Tìm đơn hàng với các liên kết tới OrderItem và Payment
    const order = await db.Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: db.User,
          as: 'user', // Lấy thông tin người dùng
          attributes: ['email', 'username']
        },
        {
          model: db.OrderItem,
          as: 'orderItems', // Lấy các món ăn trong đơn hàng
          include: [
            {
              model: db.MenuItem,
              as: 'menuItem', // Lấy thông tin món ăn
              attributes: ['name', 'price']
            }
          ]
        },
        {
          model: db.Payment,
          as: 'payment', // Lấy thông tin thanh toán
          attributes: ['paymentMethod', 'paymentStatus', 'amount']
        }
      ]
    });

    // Kiểm tra xem đơn hàng có tồn tại không
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Nếu không có thanh toán, trả về lỗi
    if (!order.payment) {
      return res.status(400).json({ success: false, message: 'Payment not found for this order' });
    }

    const user = order.user;
    const orderItems = order.orderItems;
    const payment = order.payment;

    // Tạo nội dung hóa đơn dưới dạng HTML
    const invoiceHtml = `
      <h2>Hóa Đơn Mua Hàng</h2>
      <p><strong>Khách hàng:</strong> ${user.username}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Địa chỉ giao hàng:</strong> ${order.deliveryAddress}</p>
      <h3>Chi tiết đơn hàng:</h3>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>Tên món ăn</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Tổng giá</th>
          </tr>
        </thead>
        <tbody>
          ${orderItems
            .map(
              (item) =>
                `<tr>
                  <td>${item.menuItem.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.menuItem.price}</td>
                  <td>${item.menuItem.price * item.quantity}</td>
                </tr>`
            )
            .join('')}
        </tbody>
      </table>
      <h3>Tổng tiền: ${order.totalAmount}</h3>
      <h3>Hình thức thanh toán: ${payment.paymentMethod}</h3>
      <h3>Trạng thái thanh toán: ${payment.paymentStatus}</h3>
      <p>Cảm ơn bạn đã mua hàng tại cửa hàng chúng tôi!</p>
    `;

    // Cấu hình Nodemailer để gửi email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Cấu hình email
    const mailOptions = {
      from: process.env.SMTP_SENDER,
      to: user.email,
      subject: `Hóa đơn mua hàng - Đơn hàng #${order.id}`,
      html: invoiceHtml
    };

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Error sending email', error });
      }

      // Trả về thành công nếu gửi thành công
      console.log('Email sent:', info);
      return res.status(200).json({
        success: true,
        message: 'Invoice sent successfully',
        emailInfo: info
      });
    });

  } catch (error) {
    console.error('Error in sendInvoice:', error); // Log toàn bộ lỗi
    return res.status(500).json({ success: false, message: 'Internal server error', error });
  }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrderByUserId,
    updateOrder,
    deleteOrder,
    sendInvoice
};