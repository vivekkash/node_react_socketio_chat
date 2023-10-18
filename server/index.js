import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['*'],
    methods: ['GET', 'POST'],
  },
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'client/dist')));

app.use('*', (req, res, next) =>
  res.sendFile(path.join(__dirname, 'client/dist/index.html'))
);

app.get('/check', (req, res) => {
  res.send('Server is healthy');
  res.end();
});

let userObj = [];
let activeCCusers = [];

let rooms = ['General', 'NodeJs', 'Python', 'PHP', 'Java'];

const emitNewActiveUsers = () => {
  io.emit('all_active_users', activeCCusers);
};

const getRoomUsers = (room) => {
  io.to(room).emit(
    'room_users_list',
    userObj.filter((r) => r.room == room)
  );
};

io.on('connection', (socket) => {
  //get socket id
  socket.emit('me', { id: socket.id });

  // Live Concurrent Users
  socket.on('ping-active-users', () => emitNewActiveUsers());
  socket.on('fetch-rooms', () => io.to(socket.id).emit('room-list', rooms));
  socket.on('new_active_user', (user) => {
    user.id = socket.id;
    activeCCusers.push(user);
    //Refresh Live Users
    emitNewActiveUsers();
  });
  // End

  // chat room joining steps
  socket.on('join_room', ({ room, name }) => {
    //users per room
    // all users
    userObj = room && name ? [...userObj, { id: socket.id, name, room }] : [];

    socket.join(room);
    socket.to(room).emit('join_message', {
      name,
      message: `has joined`,
      type: 'notification',
    });
    io.to(socket.id).emit('welcome_user', {
      name,
      message: `welcome to Gups`,
      type: 'notification',
    });

    // emit refresh users list in a room
    io.to(room).emit(
      'room_users_list',
      userObj.filter((r) => r.room == room)
    );
  });

  // chatroom typing events
  socket.on('typing', ({ room, name }) => {
    socket.to(room).emit('typing_message', { message: `${name} is typing...` });
  });

  // clear typing events
  socket.on('stop_typing', ({ room }) => {
    socket.to(room).emit('typing_message', { message: `` });
  });

  //chatroom discussion or messagin
  socket.on('out_message', ({ room, name, message }) => {
    io.to(room).emit('in_message', { name, message, id: socket.id });
  });

  //chatroom left
  socket.on('left', ({ room, name }) => {
    //remove user from userlist
    let userIndex = userObj.findIndex((u) => u.id === socket.id);
    if (userIndex >= 0) {
      userObj.splice(userIndex, 1);
    }

    socket.leave(room);

    socket.to(room).emit('left_room', {
      name,
      message: `has left`,
      type: 'notification',
    });

    // emit refresh users list in a room
    getRoomUsers(room);
  });

  socket.on('disconnect', () => {
    //end video call
    socket.broadcast.emit('callEnded');

    //remove user from userlist
    let userIndex = userObj.findIndex((u) => u.id === socket.id);
    let room, name;
    if (userIndex >= 0) {
      room = userObj[userIndex].room;
      name = userObj[userIndex].name;
      userObj.splice(userIndex, 1);
    }

    if (room && name) {
      socket.to(room).emit('disconnected', {
        name,
        message: `is disconnected`,
        type: 'notification',
      });
    }

    //update concurrent active users
    activeCCusers = activeCCusers.filter((u) => !(u.id === socket.id));

    // emit refresh users list in a room
    getRoomUsers(room);
    //LiveUsers
    emitNewActiveUsers();
  });

  //video call

  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('callUser', {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () =>
  console.log(`Server has started listening on ${PORT}`)
);
