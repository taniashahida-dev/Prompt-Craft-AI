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
      required: [true, "Please add a description"]
    },
    imageUrl: {
      type: String,
      default: ""
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
