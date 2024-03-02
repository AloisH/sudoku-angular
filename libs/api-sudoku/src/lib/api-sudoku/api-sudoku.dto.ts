export type BoardDifficulty = "easy" | "medium" | "hard" | "random";

export type BoardStatus = "solved" | "unsolved" | "broken";

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
