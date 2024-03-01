import { Board, BoardDifficulty, BoardDifficultyResult, BoardSolved, BoardStatusResult } from "./api-sudoku.dto";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ApiSudoku {
  private readonly baseUrl: string = "https://sugoku.onrender.com";
  private readonly headersOverride = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  constructor(private readonly http: HttpClient) {
  }

  public getBoard(difficulty: BoardDifficulty): Observable<Board> {
    return this.http.get<Board>(`${this.baseUrl}/board`, { params: { difficulty } })
  }

  public solveBoard(board: Board): Observable<BoardSolved> {
    return this.http.post<BoardSolved>(`${this.baseUrl}/solve`, board, {
      headers: this.headersOverride
    });
  }

  public gradeBoard(board: Board): Observable<BoardDifficultyResult> {
    return this.http.post<BoardDifficultyResult>(`${this.baseUrl}/grade`, board, {
      headers: this.headersOverride
    });

  }

  public validateBoard(board: Board): Observable<BoardStatusResult> {
    return this.http.post<BoardStatusResult>(`${this.baseUrl}/validate`, board, {
      headers: this.headersOverride
    });
  }

}
