const express = require("express");
const router = express.Router();
const { 
  savePrompt, 
  getUserHistory, 
  deleteHistoryItem,
  generateAIContent,
  improvePrompt
} = require("../controllers/promptController");
const { protect } = require("../middleware/authMiddleware");

// All prompts routes are protected
router.use(protect);

router.post("/generate", generateAIContent);
router.post("/improve", improvePrompt);

router.route("/")
  .post(savePrompt)
  .get(getUserHistory);

router.route("/:id")
  .delete(deleteHistoryItem);

module.exports = router;
