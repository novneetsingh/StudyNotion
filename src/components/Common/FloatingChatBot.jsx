import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";
import {
  FiSend,
  FiPaperclip,
  FiX,
  FiMaximize,
  FiMinimize,
} from "react-icons/fi";
import { MdOutlineSmartToy } from "react-icons/md";
import toast from "react-hot-toast";
import ScrollToBottom from "react-scroll-to-bottom";

// Create socket connection
const socket = io(import.meta.env.VITE_BACKEND_URL);

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

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
        setCurrentResponse("");
      });
    });

    return () => {
      socket.off("chatbotResponse");
      socket.off("chatbotResponseEnd");
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
      } else {
        setSelectedImage(file);
        setSelectedPDF(null);
      }
    } else if (file.type === "application/pdf") {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("PDF must be less than 10MB");
      } else {
        setSelectedPDF(file);
        setSelectedImage(null);
      }
    } else {
      toast.error("Only Image or PDF allowed");
    }
  };

  const onSubmit = async (data) => {
    if (!data.message && !selectedImage && !selectedPDF) {
      toast.error("Please enter a message or select an image/pdf");
      return;
    }

    if (data.message) {
      setChatHistory((prev) => [
        ...prev,
        { sender: "user", content: data.message },
      ]);
    }

    const payload = {
      message: data.message || "",
      chatHistory,
    };

    if (selectedImage) {
      payload.file = selectedImage;
      payload.fileType = "image";
    } else if (selectedPDF) {
      payload.file = selectedPDF;
      payload.fileType = "pdf";
    }

    socket.emit("chatbotMessage", payload);

    reset();
    setSelectedImage(null);
    setSelectedPDF(null);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-yellow-50 text-richblack-900 flex items-center justify-center shadow-lg hover:bg-yellow-25 transition-all z-50"
          aria-label="Open chat assistant"
        >
          <MdOutlineSmartToy size={26} />
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed ${
            isFullScreen
              ? "top-0 left-0 w-full h-full"
              : "bottom-6 right-6 w-96 h-[550px]"
          } bg-richblack-800 rounded-lg shadow-xl flex flex-col z-50 transition-all duration-300`}
        >
          {/* Header */}
          <div className="bg-richblack-700 px-4 py-3 flex items-center justify-between border-b border-richblack-600">
            <div className="flex items-center gap-2">
              <MdOutlineSmartToy size={20} className="text-yellow-50" />
              <h3 className="text-richblack-5 font-semibold">
                StudyNotion Assistant
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {/* Full screen toggle icon */}
              <button
                onClick={() => setIsFullScreen((prev) => !prev)}
                className="text-richblack-200 hover:text-richblack-5"
                aria-label="Toggle full screen"
              >
                {isFullScreen ? (
                  <FiMinimize size={20} />
                ) : (
                  <FiMaximize size={20} />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-richblack-200 hover:text-richblack-5"
                aria-label="Close chat"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollToBottom className="flex-1 overflow-y-auto p-4 space-y-4 bg-richblack-900">
            {chatHistory.length === 0 && (
              <div className="bg-richblack-800 p-4 rounded-lg text-richblack-5 mb-4">
                <p>
                  Hi there! I'm your assistant. Ask a question, or upload an
                  image or PDF to get started.
                </p>
              </div>
            )}

            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.sender === "user" ? "justify-end" : "justify-start"
                } gap-4 mb-4`}
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
              <div className="flex justify-start gap-2 mb-4">
                <div className="max-w-[80%] bg-richblack-700 rounded-lg p-3 text-richblack-5">
                  <p className="whitespace-pre-wrap">{currentResponse}</p>
                </div>
              </div>
            )}
          </ScrollToBottom>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 bg-richblack-800 border-t border-richblack-700"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                {...register("message")}
                placeholder="Ask me anything..."
                className="w-full py-2 px-4 pr-24 rounded-full bg-richblack-700 text-richblack-5 focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-richblack-400"
                disabled={isSubmitting}
              />
              <div className="absolute right-2 flex gap-1">
                <input
                  type="file"
                  id="fileUpload"
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  className="hidden"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("fileUpload").click()}
                  className="p-2 rounded-full hover:bg-richblack-600 text-richblack-300 transition-colors"
                  disabled={isSubmitting}
                  aria-label="Upload file"
                >
                  <FiPaperclip size={18} />
                </button>
                <button
                  type="submit"
                  className="p-2 rounded-full bg-yellow-50 text-richblack-900 hover:bg-yellow-25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                  aria-label="Send message"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>

            {/* File Info */}
            {(selectedImage || selectedPDF) && (
              <div className="mt-2 flex items-center text-xs text-richblack-100">
                <span className="truncate">
                  {selectedImage?.name || selectedPDF?.name}
                </span>
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedPDF(null);
                  }}
                  className="ml-2 text-blue-200 font-semibold"
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
