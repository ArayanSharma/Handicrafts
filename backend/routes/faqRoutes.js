const express = require("express");
const router = express.Router();

const {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} = require("../controllers/faqController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  admin,
} = require("../middleware/adminMiddleware");

// Public Routes
router.get("/", getAllFaqs);
router.get("/:id", getFaqById);

// Admin Routes
router.post(
  "/",
  protect,
  admin,
  createFaq
);

router.put(
  "/:id",
  protect,
  admin,
  updateFaq
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteFaq
);

module.exports = router;