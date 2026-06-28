const express = require("express");
const router = express.Router();

const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  admin,
} = require("../middleware/adminMiddleware");

const upload = require(
  "../middleware/blogUpload"
);

// Public Routes
router.get(
  "/",
  getAllBlogs
);

router.get(
  "/:id",
  getBlogById
);

// Admin Routes
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createBlog
);

router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  updateBlog
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteBlog
);

module.exports = router;