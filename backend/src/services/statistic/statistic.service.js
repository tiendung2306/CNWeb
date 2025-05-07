// src/services/statistic/statistic.service.js
import db from '../../models/index.js';
import { Op, Sequelize } from 'sequelize';

const { Order, OrderItem, MenuItem } = db;

export const getStatistics = async (startDate, endDate) => {
  // Chuyển start/end thành Date và set end tới cuối ngày
  const start = new Date(startDate);
  const end   = new Date(endDate);
  end.setHours(23,59,59,999);

  // 1) Tổng số đơn
  const totalOrders = await Order.count({
    where: { orderDate: { [Op.between]: [start, end] } }
  });

  // 2) Tổng doanh thu
  const totalRevenue = await Order.sum('totalAmount', {
    where: { orderDate: { [Op.between]: [start, end] } }
  });

  // 3) Tổng số lượng từng món
  const perItem = await OrderItem.findAll({
    attributes: [
      'menuItemId',
      [Sequelize.fn('sum', Sequelize.col('quantity')), 'totalQuantity']
    ],
    include: [
      { model: Order, where: { orderDate: { [Op.between]: [start, end] } }, attributes: [] },
      { model: MenuItem, attributes: ['name'] }
    ],
    group: ['menuItemId', 'MenuItem.id', 'MenuItem.name']
  });

  const ordersPerItem = perItem.map(item => ({
    menuItemId: item.menuItemId,
    name:       item.MenuItem.name,
    totalQuantity: parseInt(item.get('totalQuantity'), 10)
  }));

  return { totalOrders, totalRevenue, ordersPerItem };
};

export const getUserAndMenuStats = async () => {
  // Số người dùng
  const totalUsers = await db.User.count();
  // Số món ăn
  const totalMenuItems = await db.MenuItem.count();
  return { totalUsers, totalMenuItems };
};
