const { llm } = require("../../config/genAI");

exports.askPDF = async (pdfBuffer, userMessage) => {
  try {
    // Convert the pdf buffer to a Base64-encoded string.
    const base64Pdf = pdfBuffer.toString("base64");

    // Construct the message for the AI model
    const response = await llm.invoke([
      [
        "system",
        "You are a knowledgeable and friendly AI assistant for StudyNotion, a leading online education platform for CSE B.Tech students. You provide concise, accurate answers using provided educational documents.",
      ],
      [
        "user",
        [
          {
            type: "application/pdf",
            data: base64Pdf,
          },
          {
            type: "text",
            text: `You have received a question from the user: "${userMessage}". Please analyze the PDF and provide a clear and concise response based on the information it contains. If the PDF does not contain relevant information, please indicate that as well.`,
          },
        ],
      ],
    ]);

    if (response?.content) {
      return response.content.trim();
    } else {
      return "I couldn't generate a response based on the PDF and your question. Please try again.";
    }
  } catch (error) {
    console.error("Error processing PDF:", error);
    return "There was an error processing the PDF. Please ensure the PDF is clear and try again.";
  }
};
