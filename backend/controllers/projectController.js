const Project = require("../models/Project");
const {
  uploadFromBuffer,
  deleteImage,
  deleteMultipleImages,
} = require("../utils/cloudinaryUpload");

exports.getProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      featured,
      sort = "newest",
    } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (featured !== undefined) query.featured = featured === "true";

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "order") sortOption = { order: 1 };
    if (sort === "title") sortOption = { title: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [projects, total] = await Promise.all([
      Project.find(query).sort(sortOption).skip(skip).limit(parseInt(limit)),
      Project.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      user: req.user._id,
    };

    if (typeof req.body.technologies === "string") {
      projectData.technologies = req.body.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech);
    }

    if (req.files?.image?.[0]) {
      try {
        const result = await uploadFromBuffer(
          req.files.image[0].buffer,
          "portfolio/projects",
        );
        projectData.image = result;
      } catch (uploadError) {
        console.log("Image upload skipped:", uploadError.message);
      }
    }

    if (req.files?.images?.length > 0) {
      try {
        const uploadPromises = req.files.images.map((file) =>
          uploadFromBuffer(file.buffer, "portfolio/projects"),
        );
        projectData.images = await Promise.all(uploadPromises);
      } catch (uploadError) {
        console.log("Gallery upload skipped:", uploadError.message);
      }
    }

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const updateData = { ...req.body };

    if (typeof req.body.technologies === "string") {
      updateData.technologies = req.body.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech);
    }

    if (req.files?.image?.[0]) {
      try {
        if (project.image?.public_id) {
          await deleteImage(project.image.public_id);
        }
        const result = await uploadFromBuffer(
          req.files.image[0].buffer,
          "portfolio/projects",
        );
        updateData.image = result;
      } catch (uploadError) {
        console.log("Image update skipped:", uploadError.message);
      }
    }

    project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    if (project.image?.public_id) {
      try {
        await deleteImage(project.image.public_id);
      } catch (e) {
        console.log("Image deletion skipped");
      }
    }

    if (project.images?.length > 0) {
      try {
        const publicIds = project.images
          .filter((img) => img.public_id)
          .map((img) => img.public_id);
        if (publicIds.length > 0) await deleteMultipleImages(publicIds);
      } catch (e) {
        console.log("Gallery deletion skipped");
      }
    }

    await Project.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFeaturedProjects = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const projects = await Project.find({ featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Featured projects retrieved",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reorderProjects = async (req, res) => {
  try {
    const { orders } = req.body;

    if (!Array.isArray(orders)) {
      return res
        .status(400)
        .json({ success: false, message: "Orders must be an array" });
    }

    const updatePromises = orders.map(({ id, order }) =>
      Project.findByIdAndUpdate(id, { order }),
    );
    await Promise.all(updatePromises);

    res
      .status(200)
      .json({ success: true, message: "Projects reordered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProjectImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const imageIndex = project.images.findIndex(
      (img) => img._id.toString() === imageId,
    );

    if (imageIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    if (project.images[imageIndex].public_id) {
      try {
        await deleteImage(project.images[imageIndex].public_id);
      } catch (e) {
        console.log("Cloudinary deletion skipped");
      }
    }

    project.images.splice(imageIndex, 1);
    await project.save();

    res
      .status(200)
      .json({ success: true, message: "Image deleted", data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
