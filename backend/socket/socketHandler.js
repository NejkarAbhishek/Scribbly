import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";

const initSocket = (httpServer) => {
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "*",
            methods: ["GET", "POST"]
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (err) {
            next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {

        socket.on("joinMeeting", (meetingId) => {
            socket.join(meetingId);
            io.to(meetingId).emit("userJoined", socket.id);
        });

        socket.on("leaveMeeting", (meetingId) => {
            socket.leave(meetingId);
            io.to(meetingId).emit("userLeft", socket.id);
        });

        socket.on("signal", ({ meetingId, data }) => {
            socket.to(meetingId).emit("signal", { from: socket.id, data });
        });

        // Broadcast chat messages to all users in the meeting room
        socket.on("chat", (data) => {
            // Find the meeting room(s) this socket is in (excluding its own id room)
            const rooms = Array.from(socket.rooms).filter(r => r !== socket.id);
            rooms.forEach(room => {
                io.to(room).emit("chat", { user: socket.id, name: data.name, message: data.message });
            });
        });

        socket.on("disconnect", () => {
        });
    });

    return io;
};

export default initSocket;
