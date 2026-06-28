const express = require("express");

const router = express.Router();

const uploadReview = require(
  "../middleware/uploadReview"
);

const {
  createReview,
  getReviewsByProduct,
  getAllReviews,
  approveReview,
  deleteReview,
} = require(
  "../controllers/reviewController"
);

router.post(
  "/",
  uploadReview.single(
    "image"
  ),
  createReview
);

router.get(
  "/product/:productId",
  getReviewsByProduct
);

router.get(
  "/",
  getAllReviews
);

// added: approveReview existed in the controller but had no route,
// so there was no way to actually call it.
router.patch(
  "/:id/approve",
  approveReview
);

router.delete(
  "/:id",
  deleteReview
);

module.exports = router;