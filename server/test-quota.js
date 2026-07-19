const { GoogleGenAI } = require("@google/genai");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error("Error: API Key is missing.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const modelsToTest = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
  "gemini-pro-latest"
];

async function testQuota() {
  for (const model of modelsToTest) {
    try {
      console.log(`Testing model: ${model}...`);
      const res = await ai.models.generateContent({
        model: model,
        contents: "Hello, reply with exactly the word OK."
      });
      if (res && res.text) {
        console.log(`✔ SUCCESS with model: ${model}! Response: ${res.text.trim()}`);
        return;
      }
    } catch (err) {
      console.log(`✘ FAILED with model: ${model}. Error: ${err.message}`);
    }
  }
  console.log("All model tests failed.");
}

testQuota();
