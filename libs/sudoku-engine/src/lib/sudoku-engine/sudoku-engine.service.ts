import { ApiSudoku, BoardDifficulty, BoardStatus } from "@sudoku-angular/api-sudoku";
import { BehaviorSubject, firstValueFrom } from "rxjs";

import { Injectable } from "@angular/core";
import { SudokuCoop } from "./sudoku-coop.service";

export enum BoardCellType {
  USER_INPUT,
  SOLVER,
  DEFAULT,
}

export type BoardCell = {
  value: number;
  type: BoardCellType;
}

@Injectable({ providedIn: "root" })
export class SudokuEngine {
  board$: BehaviorSubject<BoardCell[][]>;
  private board: BoardCell[][];
  private status: BoardStatus;
  status$: BehaviorSubject<BoardStatus>;
  private difficulty: BoardDifficulty;
  difficulty$: BehaviorSubject<BoardDifficulty>;

  constructor(private readonly apiSudoku: ApiSudoku, private readonly sudokuCoop: SudokuCoop) {
    this.board = this.initBoard();
    this.board$ = new BehaviorSubject(this.board);
    this.status = "unsolved";
    this.status$ = new BehaviorSubject<BoardStatus>(this.status);
    this.difficulty = "random";
    this.difficulty$ = new BehaviorSubject<BoardDifficulty>(this.difficulty);

    this.sudokuCoop.initBoard$.subscribe((boardCoop: BoardCell[][] | null) => {
      if (!boardCoop) return;
      this.board = boardCoop;
      this.board$.next(this.board);
    })
  }

  initBoard(): BoardCell[][] {
    const board: BoardCell[][] = [];
    for (let i = 0; i < 9; i++) {
      board.push([]);
      for (let j = 0; j < 9; j++) {
        board[i].push({
          type: BoardCellType.USER_INPUT,
          value: 0
        });
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

    this.sudokuCoop.emitUpdateBoard({ x, y, value });
    this.board[x][y] = { value, type: BoardCellType.USER_INPUT };
  }

  async setNewBoard(difficulty: BoardDifficulty) {
    const { board } = await firstValueFrom(this.apiSudoku.getBoard(difficulty));
    this.board = board.map((col) => col.map((value): BoardCell => {
      return {
        value: value,
        type: value === 0 ? BoardCellType.USER_INPUT : BoardCellType.DEFAULT
      }
    }))
    this.board$.next(this.board);
    this.difficulty = difficulty;
    this.difficulty$.next(this.difficulty);
    this.status = "unsolved";
    this.status$.next(this.status);
  }

  async solveBoard() {
    const { solution, status, difficulty } = await firstValueFrom(this.apiSudoku.solveBoard({ board: this.board.map((col) => col.map((value => value.type === BoardCellType.DEFAULT ? value.value : 0))) }));
    this.board = solution.map((col, colIdx) => col.map((value, rowIdx): BoardCell => ({
      value,
      type: this.board[colIdx][rowIdx].type === BoardCellType.USER_INPUT ? BoardCellType.SOLVER : BoardCellType.DEFAULT,
    })));

    this.board$.next(this.board);
    this.difficulty = difficulty;
    this.difficulty$.next(this.difficulty);
    this.status = status;
    this.status$.next(this.status);
  }

  async validateBoard() {
    const { status } = await firstValueFrom(this.apiSudoku.validateBoard({ board: this.board.map((col) => col.map(value => value.value)) }));
    this.status = status;
    this.status$.next(this.status);
  }

  initCoop(roomId: string) {
    this.sudokuCoop.init(roomId, this.board);
  }
}
