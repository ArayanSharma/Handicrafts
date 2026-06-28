const mongoose = require("mongoose");

const reviewSchema =
  new mongoose.Schema(
    {
      product: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Product",
        default: null,
      },

      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
        default: null,
      },

      rating: {
        type: Number,
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      // renamed from "review" -> "content"
      // The controller saves this value as "content", but the field
      // was named "review" before, so Mongoose silently dropped it
      // (it's not in the schema = not saved).
      content: {
        type: String,
        required: true,
      },

      image: {
        type: String,
        default: "",
      },

      youtubeUrl: {
        type: String,
        default: "",
      },

      displayName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      // added: approveReview / getReviewsByProduct both rely on this
      // field existing, but it was missing, so it could never be set
      // or filtered on.
      isApproved: {
        type: Boolean,
        default: true, // set to false if you want a moderation queue
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Review",
    reviewSchema
  );