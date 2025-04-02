const { Server } = require("socket.io");
const { llm } = require("../config/genAI");
const { imageToText } = require("../services/chatbot/imageToText");
const { askPDF } = require("../services/chatbot/askPDF");
const { streamResponse } = require("../services/chatbot/streamResponse");
const { handleLiveVideo } = require("../services/liveVideo");

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

    // Live Video
    handleLiveVideo(io, socket);
  });
};

const askChatbot = async (message, file, fileType, chatHistory, socketId) => {
  try {
    let context = message || "";

    // Handle file (Image or PDF)
    if (file) {
      if (fileType === "image") {
        const response = await imageToText(file, message);

        if (response) {
          await streamResponse(io, socketId, response);
        }
      } else if (fileType === "pdf") {
        const response = await askPDF(file, message);

        if (response) {
          await streamResponse(io, socketId, response);
        }
      }
      return;
    }

    // Format chat history properly
    const formattedHistory = chatHistory
      .map((key) => `${key.sender}: ${key.content}`)
      .join("\n");

    const prompt = `
      Context: You are a knowledgeable and friendly AI assistant for StudyNotion, a leading online education platform for CSE B.Tech students.
      Conversation History: ${formattedHistory}
      User Message: ${context}
      Instructions: Deliver a clear and concise response that addresses the user's needs effectively. Maintain a friendly and professional tone throughout the conversation.
    `;

    const response = await llm.invoke(prompt);

    if (response?.content) {
      await streamResponse(io, socketId, response.content);
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
