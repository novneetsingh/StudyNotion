const { llm } = require("../config/genAI");
const pdfParse = require("pdf-parse");

exports.askPDF = async (file, message) => {
  try {
    // Extract text from PDF
    const pdfData = await pdfParse(file);
    const pdfText = pdfData.text;

    // Send the extracted text and query to the model
    const response = await llm.invoke([
      [
        "system",
        "Use the provided document information to answer the question",
      ],
      ["user", `Document content: ${pdfText}\n\nQuestion: ${message}`],
    ]);

    return response.content;
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  }
};
