// Store active live sessions
const activeSessions = new Map();

exports.handleLiveVideo = (io, socket) => {
  // Instructor starts a live session
  socket.on("startLiveSession", async (data) => {
    try {
      console.log("Received startLiveSession:", data);
      const { instructorId, courseName, sessionId } = data;

      if (!instructorId) {
        throw new Error("Missing instructor ID");
      }

      // Create a unique session ID if not provided
      const finalSessionId = sessionId || `session_${Date.now()}`;
      const session = {
        id: finalSessionId,
        instructorId,
        courseName: courseName || "Live Session",
        startTime: new Date(),
        viewers: [],
      };

      // Store session
      activeSessions.set(finalSessionId, session);

      // Join the session room
      socket.join(finalSessionId);

      // Emit to all clients that session has started
      io.emit("liveSessionStarted", session);

      // Send the created session ID back to the instructor
      socket.emit("liveSessionCreated", { sessionId: finalSessionId });

      console.log("Live session created successfully:", finalSessionId);
    } catch (error) {
      console.error("Error starting live session:", error);
      socket.emit("liveSessionError", {
        message: "Failed to start live session: " + error.message,
      });
    }
  });

  // Student joins a live session
  socket.on("joinLiveSession", ({ sessionId, userId }) => {
    console.log("User joining session:", userId, sessionId);
    const session = activeSessions.get(sessionId);

    if (!session) {
      socket.emit("liveSessionError", {
        message: "Session not found or has ended",
      });
      return;
    }

    // Add viewer to session if not already added
    if (!session.viewers.includes(userId)) {
      session.viewers.push(userId);
    }

    // Join the session room
    socket.join(sessionId);

    // Notify instructor about the new viewer
    io.to(sessionId).emit("viewerJoined", {
      sessionId,
      userId,
      viewerCount: session.viewers.length,
    });
  });

  // End live session
  socket.on("endLiveSession", ({ sessionId }) => {
    console.log("Ending session:", sessionId);
    const session = activeSessions.get(sessionId);
    if (session) {
      // Notify all viewers
      io.to(sessionId).emit("liveSessionEnded", { sessionId });
      // Remove session
      activeSessions.delete(sessionId);
    }
  });

  // Handle Simple-Peer signaling
  socket.on("signal", ({ signal, sessionId, from, initiator }) => {
    console.log(
      `Relaying signal from ${from} for session ${sessionId} (initiator: ${initiator})`
    );

    // Relay the signal to all others in the room except sender
    socket.to(sessionId).emit("signal", {
      signal,
      sessionId,
      from,
      initiator,
    });
  });

  // Get active sessions
  socket.on("getActiveSessions", () => {
    const sessions = Array.from(activeSessions.values());
    console.log("Sending active sessions:", sessions.length);
    socket.emit("activeSessions", { sessions });
  });
};
