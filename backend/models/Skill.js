const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["frontend", "backend", "database", "devops", "tools", "other"],
      default: "other",
    },
    proficiency: {
      type: Number,
      min: 1,
      max: 100,
      default: 50,
    },
    icon: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Skill", skillSchema);
