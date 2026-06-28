const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const products = await Product.countDocuments();
    const users = await User.countDocuments();

    const orders = await Order.find();

    const totalOrders = orders.length;

    const revenue = orders.reduce(
      (sum, order) =>
        sum + (order.totalPrice || 0),
      0
    );

    const lowStock = await Product.countDocuments({
      stock: { $lt: 5 },
    });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      stats: {
        revenue,
        totalOrders,
        products,
        lowStock,
        users,
      },
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};