// funtion to stream the results
exports.streamResponse = async (io, socketId, text) => {
  for await (const chunk of text) {
    await new Promise((resolve) => {
      setTimeout(() => {
        io.to(socketId).emit("chatbotResponse", { response: chunk });
        resolve();
      }, 30);
    });
  }
};
