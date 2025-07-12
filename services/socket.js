const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const connectedUsers = {}

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      socket.join(user._id.toString()); // Join personal room
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on('connection', (socket) => {
    console.log("New client connected:", socket.id);

    // Register user
    connectedUsers[socket.user._id] = socket.id;

    socket.on('sendNotification', ({ receiverId, message }) => {
      io.to(receiverId).emit('getNotification', message);
    });

    socket.on('disconnect', () => {
      console.log("Client disconnected:", socket.id);

      // Remove from connectedUsers
      for (const [userId, sockId] of Object.entries(connectedUsers)) {
        if (sockId === socket.id) {
          delete connectedUsers[userId];
          console.log(`User ${userId} removed from connected users`);
          break;
        }
      }
    });
  });

  return { io, connectedUsers };
};

module.exports = setupSocket;
