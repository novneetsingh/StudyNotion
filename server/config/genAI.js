const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

exports.llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-lite-preview-02-05",
  apiKey: process.env.GEMINI_API_KEY,
});
