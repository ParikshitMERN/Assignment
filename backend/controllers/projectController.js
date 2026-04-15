const Project = require("../models/Project");
const { uploadFromBuffer, deleteImage } = require("../utils/cloudinaryUpload");

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

exports.getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: projects,
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

    if (project.image?.public_id) {
      await deleteImage(project.image.public_id);
    }

    if (project.images?.length > 0) {
      for (const img of project.images) {
        if (img.public_id) {
          await deleteImage(img.public_id);
        }
      }
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reorderProjects = async (req, res) => {
  try {
    const { projectIds } = req.body;

    if (!Array.isArray(projectIds)) {
      return res
        .status(400)
        .json({ success: false, message: "projectIds must be an array" });
    }

    const updatePromises = projectIds.map((id, index) =>
      Project.findByIdAndUpdate(id, { order: index }),
    );

    await Promise.all(updatePromises);

    res.json({ success: true, message: "Projects reordered" });
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

    const imageIndex = project.images.findIndex(
      (img) => img.public_id === imageId || img._id.toString() === imageId,
    );

    if (imageIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    const image = project.images[imageIndex];
    if (image.public_id) {
      await deleteImage(image.public_id);
    }

    project.images.splice(imageIndex, 1);
    await project.save();

    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
