import { BoardDifficulty, BoardStatus } from "@sudoku-angular/common-type"

export type Board = {
  board: number[][],
}

export type BoardSolved = {
  solution: number[][],
  difficulty: BoardDifficulty,
  status: BoardStatus,
}

export type BoardDifficultyResult = {
  difficulty: BoardDifficulty
}

export type BoardStatusResult = {
  status: BoardStatus
}
