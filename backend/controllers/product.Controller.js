const Product = require("../models/Product");

// Create Product
const createProduct = async (req, res) => {
  try {
    const existingProduct =
      await Product.findOne({
        slug: req.body.slug,
      });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message:
          "Product already exists",
      });
    }

    const mainImage =
      req.files?.mainImage?.[0]
        ? `/uploads/products/${req.files.mainImage[0].filename}`
        : "";

    const hoverImage =
      req.files?.hoverImage?.[0]
        ? `/uploads/products/${req.files.hoverImage[0].filename}`
        : "";

    const product =
      await Product.create({
        name: req.body.name,
        slug: req.body.slug,

        // CATEGORY ADDED
        category:
          req.body.category || "",

        productType:
          req.body.productType || "none",

        description:
          req.body.description,

        price: req.body.price,

        discount:
          req.body.discount || 0,

        stock:
          req.body.stock || 0,

        availableOffers:
          req.body
            .availableOffers || "",

        estimatedDelivery:
          req.body
            .estimatedDelivery || "",

        mainImage,
        hoverImage,
      });

    res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(
      "PRODUCT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

// Get All Products
const getProducts = async (
  req,
  res
) => {
  try {
    const { category } = req.query;
    
    let query = {};
    if (category) {
      // Filter by category name or slug
      query.category = { 
        $regex: category, 
        $options: "i" 
      };
    }
    
    const products =
      await Product.find(query);

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(
      "GET PRODUCTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Product By ID
const getProductById = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Product By Slug
const getProductBySlug = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findOne({
        slug: req.params.slug,
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product
const updateProduct = async (
  req,
  res
) => {
  try {
    const updatedData = {
      name: req.body.name,
      category:
        req.body.category || "",
      productType:
        req.body.productType || "none",
      price: req.body.price,
      stock: req.body.stock,
      discount:
        req.body.discount,
      availableOffers:
        req.body
          .availableOffers,
      estimatedDelivery:
        req.body
          .estimatedDelivery,
      description:
        req.body.description,
    };

    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        updatedData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product
const deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};