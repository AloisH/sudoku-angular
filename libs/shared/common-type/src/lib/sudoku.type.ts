export type BoardDifficulty = "easy" | "medium" | "hard" | "random";

export type BoardStatus = "solved" | "unsolved" | "broken";

export enum BoardCellType {
  USER_INPUT,
  SOLVER,
  DEFAULT,
}

export type BoardCell = {
  value: number;
  type: BoardCellType;
}
