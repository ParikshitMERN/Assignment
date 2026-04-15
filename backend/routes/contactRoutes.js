const express = require("express");
const router = express.Router();
const {
  submitContact,
  getContacts,
  getUnreadCount,
  getContactById,
  markAsRead,
  deleteContact,
} = require("../controllers/contactController");

const { protect, admin } = require("../middleware/authMiddleware");

router.post("/", submitContact);

router.get("/", protect, admin, getContacts);
router.get("/unread-count", protect, admin, getUnreadCount);
router.get("/:id", protect, admin, getContactById);
router.patch("/:id/read", protect, admin, markAsRead);
router.delete("/:id", protect, admin, deleteContact);

module.exports = router;
