const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  checkAdminExists,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validatoinMiddleware");
const {
  signupValidator,
  loginValidator,
} = require("../middleware/validators/authValidator");

router.get("/admin-exists", checkAdminExists);
router.post("/register", signupValidator, validate, registerUser);
router.post("/login", loginValidator, validate, loginUser);
router.get("/me", protect, getMe);

module.exports = router;
