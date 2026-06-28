// routes/categoryRoutes.js

const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
  createCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.Controller");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  admin,
} = require("../middleware/adminMiddleware");

const router = express.Router();


// =========================
// Public Routes
// =========================

// Get all categories
router.get("/", getCategories);

// Get category by slug
router.get("/slug/:slug", getCategoryBySlug);

// Get category by ID
router.get("/:id", getCategoryById);


// =========================
// Admin Routes
// =========================

// Create Category
router.post(
  "/",
  upload.single("image"),
  createCategory
);

// Update Category
router.put(
  "/:id",
  upload.single("image"),
  updateCategory
);

// Delete Category
router.delete(
  "/:id",
  deleteCategory
);

module.exports = router;