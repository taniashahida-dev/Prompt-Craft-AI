const Template = require("../models/Template");

// @desc    Get all prompt templates (supports category filtering)
// @route   GET /api/templates
// @access  Public
const getTemplates = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};

    if (category) {
      filter.category = new RegExp(category, "i"); // Case-insensitive filter
    }

    const templates = await Template.find(filter)
      .populate("createdBy", "name email") // Populate creator context details
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single prompt template
// @route   GET /api/templates/:id
// @access  Public
const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id).populate("createdBy", "name email");

    if (!template) {
      return res.status(404).json({ success: false, message: "Template not found." });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new prompt template
// @route   POST /api/templates
// @access  Private
const createTemplate = async (req, res) => {
  try {
    const { title, category, description, imageUrl } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ 
        success: false, 
        message: "Title, category, and description are required." 
      });
    }

    const template = await Template.create({
      title,
      category,
      description,
      imageUrl: imageUrl || "",
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a prompt template
// @route   PATCH /api/templates/:id
// @access  Private
const updateTemplate = async (req, res) => {
  try {
    let template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ success: false, message: "Template not found." });
    }

    // Secure check: verify request user created this template
    if (template.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authorized to update this template." 
      });
    }

    // Update fields (only update fields present in body)
    const { title, category, description, imageUrl } = req.body;
    if (title !== undefined) template.title = title;
    if (category !== undefined) template.category = category;
    if (description !== undefined) template.description = description;
    if (imageUrl !== undefined) template.imageUrl = imageUrl;

    const updatedTemplate = await template.save();

    res.status(200).json({
      success: true,
      data: updatedTemplate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a prompt template
// @route   DELETE /api/templates/:id
// @access  Private
const deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ success: false, message: "Template not found." });
    }

    // Secure check: verify request user created this template
    if (template.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authorized to delete this template." 
      });
    }

    await template.deleteOne();

    res.status(200).json({
      success: true,
      message: "Template deleted successfully."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate
};
