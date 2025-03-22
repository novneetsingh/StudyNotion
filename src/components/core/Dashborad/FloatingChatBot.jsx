import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { FiSend, FiPaperclip, FiX } from "react-icons/fi";
import { MdOutlineSmartToy } from "react-icons/md";
import toast from "react-hot-toast";

// Create the socket connection once.
const socket = io(import.meta.env.VITE_BACKEND_URL);

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentResponse, setCurrentResponse] = useState("");

  useEffect(() => {
    socket.on("chatbotResponse", (data) => {
      setCurrentResponse((prev) => prev + data.response);
    });

    socket.on("chatbotResponseEnd", () => {
      setCurrentResponse((finalResponse) => {
        
          setChatHistory((prev) => [
            ...prev,
            { sender: "bot", content: finalResponse },
          ]);
        
        setIsLoading(false);
        return ""; // Reset current response
      });
    });

    return () => {
      socket.off("chatbotResponse");
      socket.off("chatbotResponseEnd");
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedImage) {
      toast.error("Please enter a message or select an image");
      return;
    }

    // Add user message to chat history.
    setChatHistory((prev) => [...prev, { sender: "user", content: message }]);
    setIsLoading(true);
    setCurrentResponse(""); // Reset current response

    const payload = { message: message.trim() };

    if (selectedImage) {
      // Validate file type and size.
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(selectedImage.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
        setIsLoading(false);
        return;
      }
      if (selectedImage.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        setIsLoading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        // Remove header and send only base64 data.
        payload.image = reader.result.split(",")[1];
        socket.emit("chatbotMessage", payload);
      };
      reader.onerror = () => {
        toast.error("Failed to process image");
        setIsLoading(false);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      socket.emit("chatbotMessage", payload);
    }

    setMessage("");
    setSelectedImage(null);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-yellow-50 text-richblack-900 flex items-center justify-center shadow-lg hover:bg-yellow-25 transition-all z-50"
          aria-label="Open chat assistant"
        >
          <MdOutlineSmartToy size={26} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-richblack-800 rounded-lg shadow-xl overflow-hidden flex flex-col z-50 transition-all duration-300">
          {/* Header */}
          <div className="bg-richblack-700 px-4 py-3 flex items-center justify-between border-b border-richblack-600">
            <div className="flex items-center gap-2">
              <MdOutlineSmartToy size={20} className="text-yellow-50" />
              <h3 className="text-richblack-5 font-semibold">
                StudyNotion Assistant
              </h3>
            </div>
            <button
              onClick={toggleChatbot}
              className="text-richblack-200 hover:text-richblack-5"
              aria-label="Close chat"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-richblack-900">
            {chatHistory.length === 0 && (
              <div className="bg-richblack-800 p-4 rounded-lg text-richblack-5">
                <p>
                  Hi there! I'm your assistant. Ask a question or upload an
                  image.
                </p>
              </div>
            )}
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.sender === "user" ? "justify-end" : "justify-start"
                } gap-2`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    chat.sender === "user"
                      ? "bg-blue-400 text-richblack-900"
                      : "bg-richblack-700 text-richblack-5"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{chat.content}</p>
                </div>
              </div>
            ))}
            {currentResponse && (
              <div className="flex justify-start gap-2">
                <div className="max-w-[80%] bg-richblack-700 rounded-lg p-3 text-richblack-5">
                  <p className="whitespace-pre-wrap">{currentResponse}</p>
                </div>
              </div>
            )}
            {isLoading && !currentResponse && (
              <div className="flex justify-start gap-2">
                <div className="max-w-[80%] bg-richblack-700 rounded-lg p-3 text-richblack-5">
                  <div className="flex gap-1">
                    <div
                      className="h-2 w-2 rounded-full bg-richblack-300 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-richblack-300 animate-bounce"
                      style={{ animationDelay: "100ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-richblack-300 animate-bounce"
                      style={{ animationDelay: "200ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-richblack-800 border-t border-richblack-700"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full py-2 px-4 pr-24 rounded-full bg-richblack-700 text-richblack-5 focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-richblack-400"
                disabled={isLoading}
              />
              <div className="absolute right-2 flex gap-1">
                <input
                  type="file"
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() =>
                    document.querySelector('input[type="file"]').click()
                  }
                  className="p-2 rounded-full hover:bg-richblack-600 text-richblack-300 transition-colors"
                  disabled={isLoading}
                  aria-label="Upload image"
                >
                  <FiPaperclip size={18} />
                </button>
                <button
                  type="submit"
                  className="p-2 rounded-full bg-yellow-50 text-richblack-900 hover:bg-yellow-25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || (!message.trim() && !selectedImage)}
                  aria-label="Send message"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>
            {selectedImage && (
              <div className="mt-2 flex items-center text-xs text-richblack-300">
                <span className="truncate">{selectedImage.name}</span>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="ml-2 text-red-400 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingChatBot;
