const Prompt = require("../models/Prompt");

// @desc    Log a new generated prompt
// @route   POST /api/prompts
// @access  Private
const savePrompt = async (req, res) => {
  try {
    const { prompt, output, category, words } = req.body;

    if (!prompt || !output) {
      return res.status(400).json({ success: false, message: "Prompt and output are required." });
    }

    const newPrompt = await Prompt.create({
      user: req.user.id,
      prompt,
      output,
      category: category || "General",
      words: words || 0
    });

    res.status(201).json({
      success: true,
      data: newPrompt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user prompt logs
// @route   GET /api/prompts
// @access  Private
const getUserHistory = async (req, res) => {
  try {
    const history = await Prompt.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete prompt log item
// @route   DELETE /api/prompts/:id
// @access  Private
const deleteHistoryItem = async (req, res) => {
  try {
    const promptItem = await Prompt.findById(req.params.id);

    if (!promptItem) {
      return res.status(404).json({ success: false, message: "Prompt history log not found." });
    }

    // Secure check: verify prompt owner matches request user
    if (promptItem.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "User not authorized to delete this log." });
    }

    await promptItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Prompt log removed successfully."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  savePrompt,
  getUserHistory,
  deleteHistoryItem
};
