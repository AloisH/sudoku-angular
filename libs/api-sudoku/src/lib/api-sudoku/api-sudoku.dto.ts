export type BoardDifficulty = "easy" | "medium" | "hard" | "random";

export type BoardStatus = "solved" | "unsolved" | "broken";

export type Board = {
  board: number[][],
}

export type BoardSolved = {
  board: number[][],
  difficulty: BoardDifficulty,
  status: BoardStatus,
}

export type BoardDifficultyResult = {
  difficulty: BoardDifficulty
}

export type BoardStatusResult = {
  status: BoardStatus
}
