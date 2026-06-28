// routes/productRoutes.js

const express = require("express");

const upload = require("../middleware/uploadMiddleware");

const {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.Controller");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  admin,
} = require("../middleware/adminMiddleware");

const router = express.Router();

/* =========================
   Public Routes
========================= */

router.get("/", getProducts);

router.get(
  "/slug/:slug",
  getProductBySlug
);

router.get(
  "/:id",
  getProductById
);

/* =========================
   Admin Routes
========================= */

router.post(
  "/",
  upload.fields([
    {
      name: "mainImage",
      maxCount: 1,
    },
    {
      name: "hoverImage",
      maxCount: 1,
    },
  ]),
  createProduct
);

router.put(
  "/:id",
  updateProduct
);

router.delete(
  "/:id",
  deleteProduct
);

module.exports = router;