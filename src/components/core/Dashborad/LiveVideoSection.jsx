import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { FiVideo, FiUsers, FiX } from "react-icons/fi";
import { toast } from "react-hot-toast";
import Peer from "simple-peer";

// Create socket connection
const socket = io(import.meta.env.VITE_BACKEND_URL);

const LiveVideoSection = () => {
  const { user } = useSelector((state) => state.profile);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [isViewing, setIsViewing] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [streamerReady, setStreamerReady] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);

  const isInstructor = user?.accountType === "Instructor";

  useEffect(() => {
    // Get active sessions on mount
    socket.emit("getActiveSessions");

    // Listen for socket events
    socket.on("activeSessions", ({ sessions }) => {
      console.log("Received active sessions:", sessions);
      setActiveSessions(sessions);
    });

    socket.on("liveSessionStarted", (session) => {
      console.log("New session started:", session);
      setActiveSessions((prev) => [...prev, session]);
      toast.success("New live session started!");
    });

    socket.on("liveSessionEnded", ({ sessionId }) => {
      console.log("Session ended:", sessionId);
      setActiveSessions((prev) =>
        prev.filter((session) => session.id !== sessionId)
      );
      if (currentSessionId === sessionId) {
        stopViewingSession();
      }
    });

    socket.on("liveSessionCreated", ({ sessionId }) => {
      console.log("Session created with ID:", sessionId);
      setCurrentSessionId(sessionId);
      // Wait for viewers before initializing peer
      setStreamerReady(true);
    });

    socket.on("liveSessionError", ({ message }) => {
      console.error("Live session error:", message);
      toast.error(message);
    });

    // Handle viewer joined for instructor
    socket.on("viewerJoined", ({ sessionId, userId }) => {
      if (isStreaming && currentSessionId === sessionId && streamerReady) {
        console.log(
          `Viewer ${userId} joined my session, initiating connection`
        );
        initiateConnection(true, sessionId);
      }
    });

    // WebRTC signaling with SimplePeer
    socket.on("signal", ({ signal, sessionId, from }) => {
      console.log("Received signal from", from, "for session", sessionId);

      if (currentSessionId === sessionId) {
        if (peerRef.current) {
          try {
            peerRef.current.signal(signal);
          } catch (err) {
            console.error("Error processing signal:", err);
          }
        } else {
          console.warn("Received signal but peer is not initialized");
          // If viewer receives signal before peer is created, initialize it
          if (isViewing) {
            initiateConnection(false, sessionId);
            // Signal will be processed after the peer is created
            setTimeout(() => {
              if (peerRef.current) {
                try {
                  peerRef.current.signal(signal);
                } catch (err) {
                  console.error("Error processing delayed signal:", err);
                }
              }
            }, 1000);
          }
        }
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off("activeSessions");
      socket.off("liveSessionStarted");
      socket.off("liveSessionEnded");
      socket.off("liveSessionCreated");
      socket.off("liveSessionError");
      socket.off("viewerJoined");
      socket.off("signal");

      cleanupMedia();
    };
  }, [isStreaming, isViewing, currentSessionId, streamerReady]);

  // Initiates a WebRTC connection using SimplePeer
  const initiateConnection = (initiator, sessionId) => {
    try {
      console.log(
        `Initializing peer connection as ${
          initiator ? "initiator" : "receiver"
        }`
      );

      // Clean up existing peer
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }

      const peerOptions = {
        initiator,
        trickle: true,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        },
      };

      // Add stream to outgoing peer connection if initiator
      if (initiator && localStreamRef.current) {
        peerOptions.stream = localStreamRef.current;
      }

      // Create new SimplePeer instance
      const peer = new Peer(peerOptions);
      peerRef.current = peer;

      // Handle the signal event
      peer.on("signal", (signal) => {
        console.log("Sending signal to peers");
        socket.emit("signal", {
          signal,
          sessionId,
          from: user._id,
          initiator,
        });
      });

      // Handle incoming stream for viewers
      peer.on("stream", (stream) => {
        console.log("Received remote stream");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
          remoteVideoRef.current.play().catch((err) => {
            console.warn("Auto-play failed, user interaction needed:", err);
          });
        }
      });

      peer.on("error", (err) => {
        console.error("Peer connection error:", err);
        toast.error("Connection error: " + err.message);
      });

      return peer;
    } catch (err) {
      console.error("Error creating peer:", err);
      toast.error("Failed to establish peer connection");
      return null;
    }
  };

  // Clean up media streams and peer connections
  const cleanupMedia = () => {
    // Stop all tracks in local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      localStreamRef.current = null;
    }

    // Destroy peer connection
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setStreamerReady(false);
  };

  const startLiveStream = async () => {
    try {
      console.log("Starting live stream...");

      // Check if media devices are available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Media devices not supported in this browser");
      }

      // Clean up any existing resources
      cleanupMedia();

      // Request media with audio and video
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: true,
      });

      console.log("Media stream acquired");

      // Set local stream to video element
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true; // Mute local video to prevent feedback

        await localVideoRef.current.play().catch((err) => {
          console.warn("Auto-play failed, may require user interaction:", err);
        });
      }

      // Create a unique session ID
      const sessionId = `session_${Date.now()}`;

      // Start a session
      socket.emit("startLiveSession", {
        instructorId: user._id,
        courseName: "Live Session",
        sessionId: sessionId,
      });

      // Update state
      setIsStreaming(true);

      // Note: We don't create the peer connection here
      // It will be created when a viewer joins the session
    } catch (error) {
      console.error("Error starting stream:", error);

      // Provide specific error messages
      if (error.name === "NotAllowedError") {
        toast.error(
          "Camera/microphone access denied. Please check your permissions."
        );
      } else if (error.name === "NotFoundError") {
        toast.error(
          "No camera or microphone found. Please connect and try again."
        );
      } else if (error.name === "NotReadableError") {
        toast.error(
          "Camera/microphone is already in use by another application."
        );
      } else {
        toast.error(
          "Failed to start stream: " + (error.message || "Unknown error")
        );
      }

      cleanupMedia();
    }
  };

  const stopLiveStream = () => {
    console.log("Stopping live stream");

    // Clean up all media resources
    cleanupMedia();

    // End session on server
    if (currentSessionId) {
      socket.emit("endLiveSession", { sessionId: currentSessionId });
    }

    // Update state
    setIsStreaming(false);
    setCurrentSessionId(null);

    toast.success("Live session ended");
  };

  const joinSession = (sessionId) => {
    console.log("Joining session:", sessionId);
    setCurrentSessionId(sessionId);
    setIsViewing(true);

    socket.emit("joinLiveSession", {
      sessionId,
      userId: user._id,
    });

    // We'll initialize the peer when we receive the first signal
  };

  const stopViewingSession = () => {
    console.log("Stopping viewing session");

    // Clean up resources
    cleanupMedia();

    // Update state
    setIsViewing(false);
    setCurrentSessionId(null);
  };

  return (
    <div className="bg-richblack-800 min-h-[calc(100vh-3.5rem)] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-richblack-5">
          Live Video Sessions
        </h1>

        {isInstructor && !isStreaming && !isViewing && (
          <button
            onClick={startLiveStream}
            className="flex items-center gap-2 py-2 px-4 bg-yellow-50 text-richblack-900 rounded-md hover:bg-yellow-25 transition-all"
          >
            <FiVideo size={18} />
            Start Live Session
          </button>
        )}
      </div>

      {/* Instructor's streaming interface */}
      {isStreaming && (
        <div className="mb-8 bg-richblack-900 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-richblack-5">
              Your Live Session
            </h2>
            <button
              onClick={stopLiveStream}
              className="flex items-center gap-2 py-2 px-4 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-all"
            >
              <FiX size={18} />
              End Session
            </button>
          </div>
          <div className="aspect-video bg-richblack-700 rounded-lg overflow-hidden relative">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
            {!localStreamRef.current && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <p className="text-white text-lg">Starting camera...</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <p className="text-sm text-richblack-300">
              {localStreamRef.current
                ? "Your stream is live"
                : "Initializing stream..."}
            </p>
          </div>
        </div>
      )}

      {/* Student's viewing interface */}
      {isViewing && (
        <div className="mb-8 bg-richblack-900 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-richblack-5">
              Live Session
            </h2>
            <button
              onClick={stopViewingSession}
              className="flex items-center gap-2 py-2 px-4 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-all"
            >
              <FiX size={18} />
              Leave Session
            </button>
          </div>
          <div className="aspect-video bg-richblack-700 rounded-lg overflow-hidden relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            {!remoteVideoRef.current?.srcObject && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <p className="text-white text-lg">Connecting to stream...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* List of active sessions */}
      {!isStreaming && !isViewing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSessions.length === 0 ? (
            <p className="text-richblack-300 col-span-full text-center py-8">
              No live sessions currently available.
            </p>
          ) : (
            activeSessions.map((session) => (
              <div
                key={session.id}
                className="bg-richblack-700 p-4 rounded-lg border border-richblack-600 hover:border-yellow-50 transition-all"
              >
                <h3 className="text-lg font-semibold text-richblack-5 mb-2">
                  {session.courseName}
                </h3>
                <div className="flex items-center gap-2 text-richblack-300 mb-4">
                  <FiUsers size={16} />
                  <span>{session.viewers?.length || 0} Viewers</span>
                </div>
                <button
                  onClick={() => joinSession(session.id)}
                  className="w-full py-2 bg-yellow-50 text-richblack-900 rounded-md hover:bg-yellow-25 transition-all"
                >
                  Join Session
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LiveVideoSection;
