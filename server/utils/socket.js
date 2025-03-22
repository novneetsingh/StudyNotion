const { Server } = require("socket.io");
const { llm } = require("../config/genAI");
const Tesseract = require("tesseract.js");

let io;

exports.initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
    },
    maxHttpBufferSize: 5e6, // 5MB max message size (default is 1MB)
  });

  io.on("connection", (socket) => {
    socket.on("chatbotMessage", async (data) => {
      const { message, image } = data;

      if (!message && !image) {
        socket.emit("chatbotResponse", {
          response: "Please provide a message or image.",
        });
        socket.emit("chatbotResponseEnd");
        return;
      }

      // Process message with streaming response
      await askChatbot(message, image, socket.id);
    });
  });
};

const askChatbot = async (message, image, socketId) => {
  try {
    let context = message || "";

    // If an image is provided (base64 string), convert it to a Buffer and extract text.
    if (image) {
      try {
        const imageBuffer = Buffer.from(image, "base64");
        const result = await Tesseract.recognize(imageBuffer, "eng");

        if (result?.data?.text) {
          context += `\nImage text: ${result.data.text}`;
        }
      } catch (error) {
        console.error("Image processing error:");
        context += "\nNote: There was an error processing the attached image.";
      }
    }

    // Build the Gemini prompt.
    const prompt = `
      Context: You are a helpful AI assistant for StudyNotion, an educational platform.
      User Message: ${context}
      Instructions: Provide a clear, concise response to help the user.
      Be friendly but professional.
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
