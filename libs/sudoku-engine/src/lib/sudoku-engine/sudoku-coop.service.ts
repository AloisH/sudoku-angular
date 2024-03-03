import { Socket, io } from 'socket.io-client';

import { BehaviorSubject } from 'rxjs';
import { BoardCell } from './sudoku-engine.service';
import { Injectable } from "@angular/core";

export type UpdateBoardMessage = {
  x: number,
  y: number,
  value: number
}


@Injectable({ providedIn: "root" })
export class SudokuCoop {
  private socket: Socket | null = null;
  initBoard$ = new BehaviorSubject<BoardCell[][] | null>(null);

  constructor() { return; }

  public init(roomId: string, board: BoardCell[][]) {
    this.socket = io("http://localhost:3333", { query: { roomId } });
    this.socket.on("connect", () => {
      this.emitBoardInit(board);
    });

    this.socket.on("init-board", (board: BoardCell[][]) => {
      this.initBoard$.next(board);
    })
  }

  isConnected() {
    return this.socket?.connected;
  }

  emitUpdateBoard(msg: UpdateBoardMessage) {
    if (!this.socket) return;
    this.socket.emit("update-board", msg)
  }

  emitBoardInit(board: BoardCell[][]) {
    if (!this.socket) return;
    this.socket.emit("init-board", board);
  }

  emitNewBoard(board: BoardCell[][]) {
    if (!this.socket) return;
    this.socket.emit("new-board", board);
  }

}
