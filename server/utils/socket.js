const { Server } = require("socket.io");
const { llm } = require("../config/genAI");
const Tesseract = require("tesseract.js");

let io;

exports.initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("chatbotMessage", async (data) => {
      const { message, image, chatHistory } = data;

      if (!message && !image) {
        socket.emit("chatbotResponse", {
          response: "Please provide a message or image.",
        });
        socket.emit("chatbotResponseEnd");
        return;
      }

      // Process message with streaming response
      await askChatbot(message, image, chatHistory, socket.id);
    });
  });
};

const askChatbot = async (message, image, chatHistory, socketId) => {
  try {
    let context = message || "";

    if (image) {
      try {
        const result = await Tesseract.recognize(image, "eng");

        if (result?.data?.text) {
          context += `\nImage text: ${result.data.text}`;
        }
      } catch (error) {
        console.error("Image processing error:");
        context += "\nNote: There was an error processing the attached image.";
      }
    }

    // Format chat history properly
    chatHistory = chatHistory
      .map((key) => `${key.sender}: ${key.content}`)
      .join("\n");

    // Build the Gemini prompt.
    const prompt = `
      Context: You are an intelligent and friendly AI assistant for StudyNotion, a leading platform for web development education.
      Conversation History: ${chatHistory}
      User Message: ${context}
      Instructions: Deliver a clear and concise response that addresses the user's needs effectively. Maintain a friendly and professional tone throughout the conversation.
    `;

    // Invoke Gemini API via llm
    const response = await llm.invoke(prompt);

    // Check response format and stream appropriately
    if (response?.content) {
      for await (const chunk of response.content) {
        await new Promise((resolve) => {
          setTimeout(() => {
            io.to(socketId).emit("chatbotResponse", { response: chunk });
            resolve();
          }, 30);
        });
      }
    }
  } catch (error) {
    console.error("Chatbot error:", error);
    io.to(socketId).emit("chatbotResponse", {
      response:
        "Sorry, I encountered an error processing your request. Please try again later.",
    });
  } finally {
    // Notify frontend that response is complete
    io.to(socketId).emit("chatbotResponseEnd");
  }
};
