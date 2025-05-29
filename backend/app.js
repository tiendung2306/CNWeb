import dotenv from 'dotenv';
import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';

import adminMiddleware from './src/middleware/adminAuth';
import apiMiddleware from './src/middleware/apiAuth';
import errorHandler from './src/middleware/errorHandler';
import adminRoutes from './src/routes/admin';
import apiRoutes from './src/routes/api';
import publicRoutes from './src/routes/public';
const { Message } = require('./src/models/');

dotenv.config();
require('./src/config/sequelize');

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(cors({
  origin: [
    'https://cn-web-mu.vercel.app',
    'https://cn-web-gugj.vercel.app',
    'http://localhost:3000', // Cho development
    'http://localhost:5173'
  ],
  methods: '*',
  allowedHeaders: ['Content-Type', 'Authorization', 'x-token'],
  credentials: true
}));

app.use(bodyParser.json());

const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: [
      'https://cn-web-mu.vercel.app',
      'https://cn-web-gugj.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173'
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Connected to socket.io');

  socket.on('chat message', async (msg) => {
    console.log('message:', msg);
    console.log('sender:', msg.sender.id);

    try {
      await Message.create({
        userId: msg.sender.id,
        content: msg.content,
      });
      console.log('Message saved to database');
    } catch (error) {
      console.error('Error saving message to database:', error);
    }

    socket.broadcast.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket.io');
  });
});

app.post('/send', (req, res) => {
  const message = req.body.message;
  socket.broadcast.emit('chat message', msg);
  res.send('Tin nhắn đã được gửi đến tất cả client');
});


app.get('/health', (req, res) => {
  res.json({ statusCode: 200, body: JSON.stringify({ message: "Server is healthy" }) });
});

app.use('/pub', publicRoutes);
app.use('/api', apiMiddleware, apiRoutes);
app.use('/api/admin', apiMiddleware, adminMiddleware, adminRoutes);
app.use(errorHandler);

module.exports = { app, http };

