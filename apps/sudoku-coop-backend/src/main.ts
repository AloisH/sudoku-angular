/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { BoardCell, UpdateBoardMessage, UpdateBoardStatus } from "@sudoku-angular/common-type";

import { Server } from "socket.io";
import express from 'express';

const app = express();

export type Room = {
  roomId: string;
  board: BoardCell[][]
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


  socket.on('init-board', (board: BoardCell[][]) => {
    if (rooms[roomId] == null) {
      rooms[roomId] = {
        roomId,
        board
      }
    }
    io.to(roomId).emit("init-board", rooms[roomId].board);
  });


  socket.on('new-board', (board: BoardCell[][]) => {
    if (!rooms[roomId]) {
      rooms[roomId] = {
        roomId,
        board
      }
    }
    io.to(roomId).emit('new-board', board);
  })

  socket.on('update-board', (msg: UpdateBoardMessage) => {
    if (!rooms[roomId]) {
      rooms[roomId].board[msg.x][msg.y].value = msg.value;
    }
    io.to(roomId).emit('update-board', msg);
  });

  socket.on('update-status', (msg: UpdateBoardStatus) => {
    io.to(roomId).emit('update-status', msg);
  });
});
