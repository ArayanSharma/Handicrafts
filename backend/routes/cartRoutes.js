const express = require("express");

const router = express.Router();

const {
    getCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart,
} = require("../controllers/cart.Controller");

const {
    protect,
} = require("../middleware/authMiddleware");

// Get Cart
router.get("/", protect, getCart);

// Add Product
router.post("/add", protect, addToCart);

// Update Quantity
router.put("/update", protect, updateCart);

// Remove Product
router.delete("/remove", protect, removeFromCart);

// Clear Cart
router.delete("/clear", protect, clearCart);

module.exports = router;