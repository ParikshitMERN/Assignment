const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    image: {
      public_id: String,
      url: String,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    liveUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["web", "mobile", "desktop", "api", "other"],
      default: "web",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "archived"],
      default: "completed",
    },
    order: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Use async/await - NO next() needed
projectSchema.pre("save", async function () {
  // Generate slug from title
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Auto-generate short description
  if (!this.shortDescription && this.description) {
    this.shortDescription = this.description.substring(0, 197) + "...";
  }
});

module.exports = mongoose.model("Project", projectSchema);
