// models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [
        true,
        "Product name is required",
      ],
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // CATEGORY ADDED
    category: {
      type: String,
      required: [
        true,
        "Category is required",
      ],
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    mainImage: {
      type: String,
      default: "",
    },

    hoverImage: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },

    availableOffers: {
      type: String,
      default: "",
    },

    estimatedDelivery: {
      type: String,
      default: "",
    },

    productType: {
      type: String,
      enum: [
        "none",
        "newArrival",
        "topSelling",
        "trending",
      ],
      default: "none",
    },
    productType: {
  type: String,
  enum: ["none", "newArrival", "topSelling", "trending"],
  default: "none",
},

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);