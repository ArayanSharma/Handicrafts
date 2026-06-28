const Review = require("../models/Review");
const Product = require("../models/Product");

// Create Review
const createReview = async (req, res) => {
  try {
    const {
      product,
      rating,
      title,
      content,
      displayName,
      email,
      youtubeUrl,
    } = req.body;

    // ✅ product is now optional. The store-wide review form never
    // sends a "product" id, so we only validate/attach a product
    // when one was actually provided. Previously this returned a
    // 404 "Product not found" on every single submission.
    let productExists = null;

    if (product) {
      productExists = await Product.findById(product);

      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
    }

    const review = await Review.create({
      product: product || null,
      user: req.user?.id || null,
      rating,
      title,
      content, // ✅ matches the schema field now (was "review")
      displayName,
      email,
      // ✅ actually use the uploaded file instead of ignoring it.
      // multer (uploadReview.single("image")) puts the file on req.file.
      image: req.file ? req.file.path : "",
      youtubeUrl,
    });

    if (productExists) {
      productExists.reviews.push(review._id);

      const reviews = await Review.find({
        product,
        isApproved: true,
      });

      const totalReviews = reviews.length;

      const averageRating =
        totalReviews > 0
          ? reviews.reduce(
              (sum, r) => sum + r.rating,
              0
            ) / totalReviews
          : 0;

      productExists.totalReviews = totalReviews;
      productExists.averageRating = averageRating.toFixed(1);

      await productExists.save();
    }

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Reviews By Product
const getReviewsByProduct =
  async (req, res) => {
    try {
      const reviews =
        await Review.find({
          product:
            req.params.productId,
          isApproved: true,
        })
          .populate(
            "user",
            "firstName lastName"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count: reviews.length,
        reviews,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// Get All Reviews
const getAllReviews =
  async (req, res) => {
    try {
      const reviews =
        await Review.find()
          .populate(
            "product",
            "name"
          )
          .populate(
            "user",
            "firstName lastName"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count: reviews.length,
        reviews,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// Approve Review
const approveReview =
  async (req, res) => {
    try {
      const review =
        await Review.findByIdAndUpdate(
          req.params.id,
          {
            isApproved: true,
          },
          {
            new: true,
          }
        );

      if (!review) {
        return res.status(404).json({
          success: false,
          message:
            "Review not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Review approved",
        review,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

// Delete Review
const deleteReview =
  async (req, res) => {
    try {
      const review =
        await Review.findById(
          req.params.id
        );

      if (!review) {
        return res.status(404).json({
          success: false,
          message:
            "Review not found",
        });
      }

      if (review.product) {
        await Product.findByIdAndUpdate(
          review.product,
          {
            $pull: {
              reviews: review._id,
            },
          }
        );
      }

      await review.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Review deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {
  createReview,
  getReviewsByProduct,
  getAllReviews,
  approveReview,
  deleteReview,
};