const { HumanMessage } = require("@langchain/core/messages");
const { llm } = require("../../config/genAI");

exports.imageToText = async (imageBuffer, userMessage) => {
  try {
    // Convert the image buffer to a Base64-encoded string.
    const base64Image = imageBuffer.toString("base64");

    const message = new HumanMessage({
      content: [
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${base64Image}` },
        },
        {
          type: "text",
          text: `You have received a question from the user: "${userMessage}". Please analyze the attached image and provide a clear and concise response. If the image is not relevant to the question, please indicate that as well.`,
        },
      ],
    });

    // Invoke the Gemini LLM via LangChain
    const response = await llm.invoke([message]);

    if (response?.content) {
      return response.content.trim();
    } else {
      return "No answer could be generated based on the image.";
    }
  } catch (error) {
    console.error("Error processing image with Gemini Vision:", error);
    return "Error processing the attached image.";
  }
};
