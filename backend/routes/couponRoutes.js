const express = require("express");
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
  validateCoupon,
} = require("../controllers/couponController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin routes (protect only — no isAdmin since middleware doesn't export it)
router.get("/", protect, getAllCoupons);
router.post("/", protect, createCoupon);
router.get("/:id", protect, getCouponById);
router.put("/:id", protect, updateCoupon);
router.delete("/:id", protect, deleteCoupon);
router.patch("/:id/toggle", protect, toggleCoupon);

// ⚠️ IMPORTANT: /validate must be before /:id or Express treats "validate" as an :id param
router.post("/validate", protect, validateCoupon);

module.exports = router;