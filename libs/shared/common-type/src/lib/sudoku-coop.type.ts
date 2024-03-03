import { BoardCell, BoardDifficulty, BoardStatus } from "./sudoku.type"

export type UpdateBoardMessage = {
  x: number,
  y: number,
  value: number
}

export type UpdateBoardStatus = {
  status: BoardStatus
}

export type BoardInformation = {
  board: BoardCell[][],
  status: BoardStatus,
  difficulty: BoardDifficulty,
}
