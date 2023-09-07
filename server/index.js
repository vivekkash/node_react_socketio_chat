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
  io.emit('all_active_users', await getActiveUsers());
};

io.on('connection', (socket) => {
  socket.on('ping-active-users', () => emitNewActiveUsers());
  socket.on('fetch-rooms', () => io.to(socket.id).emit('room-list', rooms));

  // chat room joining steps
  socket.on('join_room', ({ room, name }) => {
    socket.join(room);
    socket.to(room).emit('join_message', { message: `${name} has joined` });
    io.to(socket.id).emit('welcome_user', {
      message: `welcome ${name} to Gups`,
    });
  });

  // chatroom typing events
  socket.on('typing', ({ room, name }) => {
    console.log(room, name, 'typing');
    socket.to(room).emit('typing_message', { message: `${name} is typing` });
  });

  socket.on('stop_typing', ({ room }) => {
    socket.to(room).emit('typing_message', { message: `` });
  });

  //chatroom discussion or messagin
  socket.on('in_message', ({ room, name, message }) => {
    io.to(room).emit('out_message', { name, message });
  });

  //chatroom left
  socket.on('left', ({ room, name }) => {
    socket.leave(room);
    socket.to(room).emit('left_room', { message: `${name} left` });
  });

  socket.on('disconnect', () => {
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
