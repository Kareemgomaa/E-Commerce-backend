import jwt from "jsonwebtoken";
import userModel from "./database/model/user.model.js";

export const initNotificationSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        socket.on("authenticate", async (token) => {
            try {
                if (!token) return socket.emit("error", "Token required");
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'NTI');
                const user = await userModel.findById(decoded._id);
                if (!user) return socket.emit("error", "User not found");
                socket.user = user;
                const roleStatus = user.role === 'admin' ? "Admin" : "User";
                socket.emit("authenticated", { message: `Welcome ${user.name} (${roleStatus})` });
                console.log(`User ${user.name} authenticated`);
            } catch (err) {
                socket.emit("error", "Invalid Token");
            }
        });

        socket.on("admin:send-offer", (data) => {
            console.log(`Event 'admin:send-offer' received from SID: ${socket.id}`);
            
            let payload = data;
            if (typeof data === 'string') {
                try { payload = JSON.parse(data); } catch (e) { return socket.emit("error", "Invalid JSON format"); }
            }
            
            if (!socket.user || socket.user.role !== 'admin') {
                console.log(`[Block] Unauthorized attempt from SID: ${socket.id}. User: ${socket.user?.name || 'Guest'}, Role: ${socket.user?.role || 'None'}`);
                return socket.emit("error", "Unauthorized: Only admins can send offers");
            }

            const offerMessage = {
                type: payload.type || 'offer',
                title: payload.title,
                message: payload.message,
                discountCode: payload.discountCode,
                expiresAt: payload.expiresAt,
                createdAt: new Date()
            };

            io.emit("user:receive-offer", offerMessage);
            console.log(`[Success] Offer "${payload.title}" broadcasted to all users by Admin: ${socket.user.name}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};