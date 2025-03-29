const { Server } = require("socket.io");
const { llm } = require("../config/genAI");
const { imageToText } = require("../services/imageToText");
const { askPDF } = require("../services/askPDF");

let io;

exports.initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    socket.on("chatbotMessage", async (data) => {
      const { message, file, fileType, chatHistory } = data;

      if (!message && !file) {
        socket.emit("chatbotResponse", {
          response: "Please provide a message, image, or PDF.",
        });
        socket.emit("chatbotResponseEnd");
        return;
      }

      await askChatbot(message, file, fileType, chatHistory, socket.id);
    });
  });
};

const askChatbot = async (message, file, fileType, chatHistory, socketId) => {
  try {
    let context = message || "";

    // Handle file (Image or PDF)
    if (file) {
      if (fileType === "image") {
        context += await imageToText(file);
      } else if (fileType === "pdf") {
        const response = await askPDF(file, message);

        if (response) {
          for await (const chunk of response) {
            await new Promise((resolve) => {
              setTimeout(() => {
                io.to(socketId).emit("chatbotResponse", { response: chunk });
                resolve();
              }, 30);
            });
          }
        }

        return;
      }
    }

    // Format chat history properly
    const formattedHistory = chatHistory
      .map((key) => `${key.sender}: ${key.content}`)
      .join("\n");

    const prompt = `
      Context: You are an intelligent and friendly AI assistant for StudyNotion, a leading platform for web development education.
      Conversation History: ${formattedHistory}
      User Message: ${context}
      Instructions: Deliver a clear and concise response that addresses the user's needs effectively. Maintain a friendly and professional tone throughout the conversation.
    `;

    const response = await llm.invoke(prompt);

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
    io.to(socketId).emit("chatbotResponseEnd");
  }
};
