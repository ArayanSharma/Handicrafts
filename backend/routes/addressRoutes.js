const express = require("express");
const router = express.Router();

const {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

const { protect } = require("../middleware/authMiddleware");

// All address routes require a logged-in user
router.get("/", protect, getMyAddresses);
router.post("/", protect, createAddress);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);
router.put("/:id/set-default", protect, setDefaultAddress);

module.exports = router;