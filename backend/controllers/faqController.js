const Faq = require("../models/Faq");

// Get All FAQ
const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      faqs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single FAQ
const getFaqById = async (
  req,
  res
) => {
  try {
    const faq = await Faq.findById(
      req.params.id
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    res.status(200).json({
      success: true,
      faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create FAQ
const createFaq = async (
  req,
  res
) => {
  try {
    const {
      question,
      answer,
    } = req.body;

    const faq = await Faq.create({
      question,
      answer,
    });

    res.status(201).json({
      success: true,
      message:
        "FAQ created successfully",
      faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update FAQ
const updateFaq = async (
  req,
  res
) => {
  try {
    const faq = await Faq.findById(
      req.params.id
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    faq.question =
      req.body.question ||
      faq.question;

    faq.answer =
      req.body.answer ||
      faq.answer;

    await faq.save();

    res.status(200).json({
      success: true,
      message:
        "FAQ updated successfully",
      faq,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete FAQ
const deleteFaq = async (
  req,
  res
) => {
  try {
    const faq = await Faq.findById(
      req.params.id
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: "FAQ not found",
      });
    }

    await faq.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "FAQ deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
};