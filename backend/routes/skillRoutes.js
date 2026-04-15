const express = require("express");
const router = express.Router();
const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} = require("../controllers/skillController");

const { protect, admin } = require("../middleware/authMiddleware");

router.get("/", getSkills);
router.get("/:id", getSkillById);

router.post("/", protect, admin, createSkill);
router.put("/:id", protect, admin, updateSkill);
router.delete("/:id", protect, admin, deleteSkill);
router.patch("/reorder", protect, admin, reorderSkills);

module.exports = router;
