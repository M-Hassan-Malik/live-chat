// server.js
const express = require('express');
const http = require('http');
const next = require('next');
const { Server: SocketIOServer } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


interface ChatMessage {
  username: string;
  message: string;
}

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new SocketIOServer(httpServer);

  io.on('connection', (socket: any) => {
    console.log('New client connected');

    socket.on('message', (msg:ChatMessage) => {
      console.log('Received message:', msg); // Log received messages
      io.emit('message', msg); // Broadcast message to all clients
    });
   
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  server.all('*', (req: Express.Request, res:Express.Response) => {
    return handle(req, res);
  });

  httpServer.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
  });
});
