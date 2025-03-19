import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export const useVoiceRecorder = (recordingLimit = 60000) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcribedTextRef = useRef("");

  // UseEffect to initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }
        // Update the ref without triggering a re-render
        transcribedTextRef.current = finalTranscript || interimTranscript;
      };

      recognitionRef.current.onerror = (error) => {
        console.error("Speech recognition error:", error);
        toast.error("Speech recognition error");
      };
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      setAudioBlob(null);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
      recognitionRef.current?.start();
      setIsRecording(true);

      // Automatically stop after the given recordingLimit (default 1 minute)
      timerRef.current = setTimeout(() => {
        stopRecording();
      }, recordingLimit);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to start recording");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      recognitionRef.current?.stop();
      setIsRecording(false);
      clearTimeout(timerRef.current);
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  // Reset function to clear previous recording data and transcript
  const resetRecorder = () => {
    setAudioBlob(null);
    setIsRecording(false);
    chunksRef.current = [];
    transcribedTextRef.current = "";
  };

  return {
    isRecording,
    audioBlob,
    transcribedText: transcribedTextRef.current,
    startRecording,
    stopRecording,
    resetRecorder,
  };
};
