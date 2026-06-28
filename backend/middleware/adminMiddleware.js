// middleware/adminMiddleware.js

const admin = (req, res, next) => {
  try {
    if (
      req.user &&
      req.user.role === "admin"
    ) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { admin };