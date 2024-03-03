/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Server } from "socket.io";
import express from 'express';

const app = express();

export type Room = {
  roomId: string;
  board: number[][]
}

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to sudoku-coop-backend!' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);


const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  maxHttpBufferSize: 1e8,
}).listen(server);

const rooms: {
  [key: string]: Room
} = {}

io.on('connection', async (socket) => {
  console.log("New user loged in");
  const roomId: string = (socket.request as any)._query["roomId"];
  await socket.join(roomId);


  socket.on('init-board', (msg) => {
    if (rooms[roomId] == null) {
      console.log("override roomID");
      rooms[roomId] = {
        roomId,
        board: msg.board
      }
    }
    io.to(roomId).emit("init-board", { board: rooms[roomId] });
  });


  socket.on('new-board', (msg) => {
    if (!rooms[roomId]) {
      rooms[roomId] = {
        roomId,
        board: msg.board
      }
    }
    io.to(roomId).emit(msg);
  })

  socket.on('update-board', (msg) => {
    console.log(msg);
    io.to(roomId).emit(msg);
  });
  socket.on('update-select', (msg) => {
    console.log(msg);
  });

  socket.on('connect_error', function (err) {
    console.log("client connect_error: ", err);
  });

  socket.on('connect_timeout', function (err) {
    console.log("client connect_timeout: ", err);
  });
});
