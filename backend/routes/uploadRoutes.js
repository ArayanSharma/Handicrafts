const express = require("express");

const upload =
  require("../middleware/uploadMiddleware");

const {
  uploadImage,
} = require(
  "../controllers/upload.Controller"
);

const router = express.Router();

router.post("/",upload.single("image"),uploadImage);

module.exports = router;