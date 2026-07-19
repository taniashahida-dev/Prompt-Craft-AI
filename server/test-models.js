const { GoogleGenAI } = require("@google/genai");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("Error: GEMINI_API_KEY or GOOGLE_API_KEY is not defined.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
  try {
    console.log("Querying available Gemini models...");
    const response = await ai.models.list();
    console.log("\nModel Names list:");
    for await (const m of response) {
      console.log(`- ${m.name}`);
    }
  } catch (error) {
    console.error("Failed to query models:", error.message || error);
  }
}

listModels();
