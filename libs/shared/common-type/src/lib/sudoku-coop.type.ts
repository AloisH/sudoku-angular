import { BoardCell, BoardCellType, BoardDifficulty, BoardDifficultySchema, BoardStatus, BoardStatusSchema } from "./sudoku.type"

import { z } from "zod";

export const UpdateBoardMessageSchema = z.object({
  x: z.number().min(0).max(8),
  y: z.number().min(0).max(8),
  value: z.number().min(0).max(9)
});
export type UpdateBoardMessage = z.infer<typeof UpdateBoardMessageSchema>

export const UpdateBoardStatusSchema = z.object({
  status: BoardStatusSchema
});
export type UpdateBoardStatus = z.infer<typeof UpdateBoardStatusSchema>

export const BoardInformationSchema = z.object({
  board: z.array(z.array(z.object({
    value: z.number().min(0).max(9),
    type: z.nativeEnum(BoardCellType)
  }))),
  status: BoardStatusSchema,
  difficulty: BoardDifficultySchema
})
export type BoardInformation = z.infer<typeof BoardInformationSchema>;
