import { ApiSudoku, BoardDifficulty, BoardStatus } from "@sudoku-angular/api-sudoku";

import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({ providedIn: "root" })
export class SudokuEngine {
  board: number[][];
  private status: BoardStatus;
  private difficulty: BoardDifficulty;

  constructor(private readonly apiSudoku: ApiSudoku) {
    this.board = this.initBoard();
    this.status = "unsolved";
    this.difficulty = "random";
  }

  initBoard(): number[][] {
    const board: number[][] = [];
    for (let i = 0; i < 9; i++) {
      board.push([]);
      for (let j = 0; j < 9; j++) {
        board[i].push(0);
      }
    }

    return board;
  }

  setValue(x: number, y: number, value: number) {
    if (x < 0 || x > 9) {
      throw new Error("X must be between 0 and 9");
    }

    if (y < 0 || y > 9) {
      throw new Error("Y must be between 0 and 9");
    }

    if (value < 0 || value > 9) {
      throw new Error("Value must be between 0 and 9");
    }

    this.board[x][y] = value;
  }

  async setNewBoard(difficulty: BoardDifficulty) {
    const { board } = await firstValueFrom(this.apiSudoku.getBoard(difficulty));
    this.board = board;
    this.difficulty = difficulty;
    this.status = "unsolved";
  }

  async solveBoard() {
    const { board, status, difficulty } = await firstValueFrom(this.apiSudoku.solveBoard({ board: this.board }));
    this.board = board;
    this.difficulty = difficulty;
    this.status = status;
  }

  async validateBoard() {
    const { status } = await firstValueFrom(this.apiSudoku.validateBoard({ board: this.board }));
    this.status = status;
  }


}
