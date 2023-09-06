import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

let rooms = ['General', 'NodeJs', 'Python', 'PHP', 'Java'];

const getActiveUsers = async () => {
  const users = (await io.fetchSockets()).map((s) => s.user);
  return users;
};

const emitNewActiveUsers = async () => {
  console.log(await getActiveUsers());
  io.emit('all_active_users', await getActiveUsers());
};

io.on('connection', (socket) => {
  console.log('user connected ', socket.id);
  socket.on('ping-active-users', () => emitNewActiveUsers());
  socket.on('fetch-rooms', () => io.to(socket.id).emit('room-list', rooms));

  socket.on('join_room', ({ room, name }) => {
    socket.join(room);
    socket.to(room).emit('join_message', { message: `${name} joined` });
    io.in(room)
      .to(socket.id)
      .emit('welcome_user', { message: `welcome ${name} to Gups` });
  });

  socket.on('typing', ({ room, name }) => {
    socket.to(room).emit('typing_message', { message: `${name} is typing` });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected ', socket.id);

    //LiveUsers
    emitNewActiveUsers();
  });
  socket.on('new_active_user', (user) => {
    socket.user = user;

    //LiveUsers
    emitNewActiveUsers();
  });
});

httpServer.listen(5000, () => console.log('Server has started listening'));
