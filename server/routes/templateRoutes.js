const express = require("express");
const router = express.Router();
const {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate
} = require("../controllers/templateController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.route("/")
  .get(getTemplates);

router.route("/:id")
  .get(getTemplateById);

// Protected routes (require Bearer JWT)
router.route("/")
  .post(protect, createTemplate);

router.route("/:id")
  .patch(protect, updateTemplate)
  .delete(protect, deleteTemplate);

module.exports = router;
