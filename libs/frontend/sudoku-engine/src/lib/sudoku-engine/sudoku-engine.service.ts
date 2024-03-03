import { BehaviorSubject, firstValueFrom } from 'rxjs';
import {
  BoardCell,
  BoardCellType,
  BoardDifficulty,
  BoardInformation,
  BoardStatus,
  UpdateBoardMessage,
} from '@sudoku-angular/common-type';

import { ApiSudoku } from '@sudoku-angular/api-sudoku';
import { Injectable } from '@angular/core';
import { SudokuCoop } from './sudoku-coop.service';

@Injectable({ providedIn: 'root' })
export class SudokuEngine {
  private board: BoardCell[][];
  board$: BehaviorSubject<BoardCell[][]>;
  private status: BoardStatus;
  status$: BehaviorSubject<BoardStatus>;
  private difficulty: BoardDifficulty;
  difficulty$: BehaviorSubject<BoardDifficulty>;

  constructor(
    private readonly apiSudoku: ApiSudoku,
    private readonly sudokuCoop: SudokuCoop
  ) {
    this.board = this.initBoard();
    this.board$ = new BehaviorSubject(this.board);
    this.status = 'unsolved';
    this.status$ = new BehaviorSubject<BoardStatus>(this.status);
    this.difficulty = 'random';
    this.difficulty$ = new BehaviorSubject<BoardDifficulty>(this.difficulty);

    this.sudokuCoop.coopBoard$.subscribe(
      (boardCoop: BoardInformation | null) => {
        if (!boardCoop) return;
        this.board = boardCoop.board;
        this.board$.next(this.board);
        this.status = boardCoop.status;
        this.status$.next(boardCoop.status);
        this.difficulty = boardCoop.difficulty;
        this.difficulty$.next(this.difficulty);
      }
    );

    this.sudokuCoop.newValue$.subscribe(
      (newValue: UpdateBoardMessage | null) => {
        if (!newValue) return;
        this.setValue(newValue.x, newValue.y, newValue.value, false);
      }
    );

    this.sudokuCoop.newStatus$.subscribe((newStatus) => {
      if (!newStatus) return;
      this.status = newStatus.status;
      this.status$.next(this.status);
    });
  }

  initBoard(): BoardCell[][] {
    const board: BoardCell[][] = [];
    for (let i = 0; i < 9; i++) {
      board.push([]);
      for (let j = 0; j < 9; j++) {
        board[i].push({
          type: BoardCellType.USER_INPUT,
          value: 0,
        });
      }
    }

    return board;
  }

  setValue(x: number, y: number, value: number, shouldEmit = true) {
    if (x < 0 || x > 9) {
      throw new Error('X must be between 0 and 9');
    }

    if (y < 0 || y > 9) {
      throw new Error('Y must be between 0 and 9');
    }

    if (value < 0 || value > 9) {
      throw new Error('Value must be between 0 and 9');
    }

    this.board[x][y] = { value, type: BoardCellType.USER_INPUT };
    if (shouldEmit) this.sudokuCoop.emitUpdateBoard({ x, y, value });
  }

  async setNewBoard(difficulty: BoardDifficulty) {
    const { board } = await firstValueFrom(this.apiSudoku.getBoard(difficulty));
    this.board = board.map((col) =>
      col.map((value): BoardCell => {
        return {
          value: value,
          type: value === 0 ? BoardCellType.USER_INPUT : BoardCellType.DEFAULT,
        };
      })
    );
    this.board$.next(this.board);
    this.difficulty = difficulty;
    this.difficulty$.next(this.difficulty);
    this.status = 'unsolved';
    this.status$.next(this.status);
    this.sudokuCoop.emitNewBoard({
      board: this.board,
      status: this.status,
      difficulty: this.difficulty,
    });
  }

  async solveBoard() {
    const { solution, status, difficulty } = await firstValueFrom(
      this.apiSudoku.solveBoard({
        board: this.board.map((col) =>
          col.map((value) =>
            value.type === BoardCellType.DEFAULT ? value.value : 0
          )
        ),
      })
    );
    this.board = solution.map((col, colIdx) =>
      col.map(
        (value, rowIdx): BoardCell => ({
          value,
          type:
            this.board[colIdx][rowIdx].type === BoardCellType.USER_INPUT
              ? BoardCellType.SOLVER
              : BoardCellType.DEFAULT,
        })
      )
    );

    this.board$.next(this.board);
    this.difficulty = difficulty;
    this.difficulty$.next(this.difficulty);
    this.status = status;
    this.status$.next(this.status);
    this.sudokuCoop.emitNewBoard({
      board: this.board,
      difficulty: this.difficulty,
      status: this.status,
    });
  }

  async validateBoard() {
    const { status } = await firstValueFrom(
      this.apiSudoku.validateBoard({
        board: this.board.map((col) => col.map((value) => value.value)),
      })
    );
    this.status = status;
    this.status$.next(this.status);
    this.sudokuCoop.emitNewStatus({ status: this.status });
  }

  initCoop(roomId: string) {
    this.sudokuCoop.init(roomId, {
      board: this.board,
      difficulty: this.difficulty,
      status: this.status,
    });
  }

  disconnectCoop() {
    this.sudokuCoop.disconnect();
  }
}
