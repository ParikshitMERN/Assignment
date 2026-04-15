const express = require("express");
const router = express.Router();
const {
  getProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  deleteProjectImage,
} = require("../controllers/projectController");

const { protect, admin } = require("../middleware/authMiddleware");
const { uploadProjectImages } = require("../middleware/uploadMiddleware");

router.get("/", getProjects);
router.get("/featured", getFeaturedProjects);
router.get("/slug/:slug", getProjectBySlug);
router.get("/:id", getProjectById);

router.post("/", protect, admin, uploadProjectImages, createProject);
router.put("/:id", protect, admin, uploadProjectImages, updateProject);
router.delete("/:id", protect, admin, deleteProject);
router.patch("/reorder", protect, admin, reorderProjects);
router.delete("/:id/images/:imageId", protect, admin, deleteProjectImage);

module.exports = router;
