import { z } from "zod";

export const BoardDifficultySchema = z.enum(["easy", "medium", "hard", "random"]);
export type BoardDifficulty = z.infer<typeof BoardDifficultySchema>;

export const BoardStatusSchema = z.enum(["solved", "unsolved", "broken"]);
export type BoardStatus = z.infer<typeof BoardStatusSchema>;

export enum BoardCellType {
  USER_INPUT,
  SOLVER,
  DEFAULT,
}

export type BoardCell = {
  value: number;
  type: BoardCellType;
}
