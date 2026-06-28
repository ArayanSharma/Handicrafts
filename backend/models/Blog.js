const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    image: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Blog",
  blogSchema
);