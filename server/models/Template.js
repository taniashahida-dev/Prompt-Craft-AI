const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a template title"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Please add a short description"],
      trim: true
    },
    fullPrompt: {
      type: String,
      required: [true, "Please add the full prompt blueprint"]
    },
    tags: {
      type: [String],
      default: []
    },
    imageUrl: {
      type: String,
      default: ""
    },
    difficulty: {
      type: String,
      default: "Intermediate",
      enum: ["Beginner", "Intermediate", "Advanced"]
    },
    usages: {
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Template", templateSchema);
