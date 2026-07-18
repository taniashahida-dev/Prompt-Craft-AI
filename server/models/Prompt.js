const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    prompt: {
      type: String,
      required: [true, "Please add prompt text"]
    },
    output: {
      type: String,
      required: [true, "Please add output content"]
    },
    category: {
      type: String,
      default: "General"
    },
    words: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Prompt", promptSchema);
