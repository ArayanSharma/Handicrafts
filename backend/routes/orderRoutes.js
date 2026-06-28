// routes/orderRoutes.js

const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/order.Controller");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const router = express.Router();

// ✅ Static routes FIRST (before any /:id routes)

// Admin: Get all orders
router.get("/", protect, admin, getAllOrders);

// User: Create order (protect so user is linked)
router.post("/", protect, createOrder);

// User: Get my orders — MUST be before /:id
router.get("/my-orders", protect, getMyOrders);

// ✅ Dynamic :id routes AFTER static routes

// User/Admin: Get single order by ID
router.get("/:id", protect, getOrderById);

// Admin: Update order status
router.put("/:id/status", protect, admin, updateOrderStatus);

// Admin: Delete order
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;