const Prompt = require("../models/Prompt");
const { GoogleGenAI } = require("@google/genai");

// Helper to handle all Gemini SDK errors robustly
const handleGeminiError = (geminiErr, res) => {
  console.error("Gemini SDK Error:", geminiErr);
  
  const status = geminiErr.status || geminiErr.statusCode || 502;
  const message = geminiErr.message || "";
  
  // Rate Limit / Quota Exhaustion
  if (status === 429 || message.toLowerCase().includes("exhausted") || message.toLowerCase().includes("rate limit") || message.toLowerCase().includes("429")) {
    return res.status(429).json({
      success: false,
      message: "Gemini API rate limit exceeded or quota exhausted. Please try again later."
    });
  }
  
  // Authentication Errors (invalid API key)
  if (status === 403 || status === 401 || message.toLowerCase().includes("key") || message.toLowerCase().includes("unauthorized") || message.toLowerCase().includes("forbidden") || message.toLowerCase().includes("403") || message.toLowerCase().includes("api key")) {
    return res.status(401).json({
      success: false,
      message: "Invalid or unauthorized Gemini API key. Please check your credentials."
    });
  }

  // Network / Connection Issues
  if (message.toLowerCase().includes("enotfound") || message.toLowerCase().includes("timeout") || message.toLowerCase().includes("fetch") || message.toLowerCase().includes("connect")) {
    return res.status(503).json({
      success: false,
      message: "Network connection to Gemini service timed out or failed. Please check your connectivity."
    });
  }

  // Model Not Found / Deprecated
  if (status === 404 || message.toLowerCase().includes("not found")) {
    return res.status(404).json({
      success: false,
      message: "The requested Gemini model was not found or is no longer available."
    });
  }
  
  // Default fallback status
  return res.status(status >= 400 && status < 600 ? status : 502).json({
    success: false,
    message: `Gemini API execution failed: ${message}`
  });
};

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

// @desc    Generate AI Content using Gemini API
// @route   POST /api/prompts/generate
// @access  Private
const generateAIContent = async (req, res) => {
  try {
    const { topic, contentType, tone, outputLength } = req.body;

    if (!topic || !contentType || !tone || !outputLength) {
      return res.status(400).json({ success: false, message: "Topic, content type, tone, and output length are required." });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ 
        success: false, 
        message: "Gemini API key is missing. Please configure GEMINI_API_KEY in your environment configuration." 
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `You are a professional AI content generator. Write high-quality, unique, and dynamic content.
Do not repeat yourself. Avoid generic templates or placeholder text.

Write a ${contentType} on the following Topic:
"${topic}"

Requirements:
- Tone of voice: ${tone}
- Output length: approximately ${outputLength}
- Format using Markdown with proper headings if applicable.
- Make the response engaging, professional, and contextually rich.`;

    let generatedOutput = "";
    try {
      const geminiRes = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL ,
        contents: promptText
      });

      if (geminiRes && geminiRes.text) {
        generatedOutput = geminiRes.text;
      } else {
        throw new Error("Invalid response structure received from Gemini API.");
      }
    } catch (geminiErr) {
      return handleGeminiError(geminiErr, res);
    }

    // Save generation log to database
    const wordCount = generatedOutput.split(/\s+/).length;
    const newLog = await Prompt.create({
      user: req.user.id,
      prompt: promptText,
      output: generatedOutput,
      category: contentType,
      words: wordCount
    });

    res.status(201).json({
      success: true,
      data: newLog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Improve a prompt using Gemini API
// @route   POST /api/prompts/improve
// @access  Private
const improvePrompt = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "Prompt is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ 
        success: false, 
        message: "Gemini API key is missing. Please configure GEMINI_API_KEY in your environment configuration." 
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `You are a Principal Prompt Engineer. Optimize the following user prompt to improve its structure, instructions, and context, while strictly preserving its original intent.
User prompt: "${prompt}"

Improve it by adding a clear persona/role, clarifying constraints, and setting up parameters.`;

    let generatedOutput = "";
    try {
      const geminiRes = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL ,
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              improvedPrompt: { type: "STRING" },
              structure: { type: "STRING" },
              instructions: { type: "STRING" },
              context: { type: "STRING" }
            },
            required: ["improvedPrompt", "structure", "instructions", "context"]
          }
        }
      });

      if (geminiRes && geminiRes.text) {
        generatedOutput = geminiRes.text;
      } else {
        throw new Error("Invalid response structure received from Gemini API.");
      }
    } catch (geminiErr) {
      return handleGeminiError(geminiErr, res);
    }

    // Try parsing the output to ensure it's valid JSON
    let parsedResult;
    try {
      let cleanText = generatedOutput.trim();
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.substring(7);
      }
      if (cleanText.endsWith("```")) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      parsedResult = JSON.parse(cleanText.trim());

      // Validate schema format presence
      if (!parsedResult.improvedPrompt || !parsedResult.structure || !parsedResult.instructions || !parsedResult.context) {
        throw new Error("Missing required JSON attributes from Gemini output.");
      }
    } catch (parseErr) {
      console.error("JSON parsing failure on Gemini output:", parseErr.message);
      return res.status(422).json({
        success: false,
        message: "Failed to parse AI response as valid JSON schema properties."
      });
    }

    // Save generation log to database
    const logOutputText = `[Improved Prompt]\n${parsedResult.improvedPrompt}\n\n[Better Structure]\n${parsedResult.structure}\n\n[Clear Instructions]\n${parsedResult.instructions}\n\n[More Detailed Context]\n${parsedResult.context}`;
    const logWordCount = logOutputText.split(/\s+/).length;
    const newLog = await Prompt.create({
      user: req.user.id,
      prompt: `Improve Prompt: "${prompt.substring(0, 60)}${prompt.length > 60 ? '...' : ''}"`,
      output: logOutputText,
      category: "Prompt Improver",
      words: logWordCount
    });

    res.status(201).json({
      success: true,
      data: {
        log: newLog,
        improved: parsedResult
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  savePrompt,
  getUserHistory,
  deleteHistoryItem,
  generateAIContent,
  improvePrompt
};
