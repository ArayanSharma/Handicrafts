const User = require("../models/User");
const Order = require("../models/Order");

// Admin - Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({
          user: user._id,
        });

        const totalOrders = orders.length;

        const totalSpent = orders.reduce(
          (sum, order) => sum + order.totalPrice,
          0
        );

        const lastOrder =
          orders.length > 0
            ? orders[0].createdAt
            : null;

        return {
          ...user.toObject(),
          totalOrders,
          totalSpent,
          lastOrder,
        };
      })
    );

    res.status(200).json({
      success: true,
      users: usersWithStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getAllUsers,
  deleteUser,
};