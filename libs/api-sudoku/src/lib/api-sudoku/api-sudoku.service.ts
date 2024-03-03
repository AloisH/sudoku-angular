import { Board, BoardDifficultyResult, BoardSolved, BoardStatusResult } from "./api-sudoku.dto";

import { BoardDifficulty } from "@sudoku-angular/common-type";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ApiSudoku {
  private readonly baseUrl: string = "https://sugoku.onrender.com";
  private readonly headersOverride = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  private encodeBoard(board: any) {
    return board.reduce((result: any, row: any, i: any) => result + `%5B${encodeURIComponent(row)}%5D${i === board.length - 1 ? '' : '%2C'}`, '');
  }

  private encodeParams(params: any) {
    return Object.keys(params)
      .map(key => key + '=' + `%5B${this.encodeBoard(params[key])}%5D`)
      .join('&');
  }

  constructor(private readonly http: HttpClient) {
  }

  public getBoard(difficulty: BoardDifficulty): Observable<Board> {
    return this.http.get<Board>(`${this.baseUrl}/board`, { params: { difficulty } })
  }

  public solveBoard(board: Board): Observable<BoardSolved> {
    return this.http.post<BoardSolved>(`${this.baseUrl}/solve`, this.encodeParams(board), {
      headers: this.headersOverride
    });
  }

  public gradeBoard(board: Board): Observable<BoardDifficultyResult> {
    return this.http.post<BoardDifficultyResult>(`${this.baseUrl}/grade`, this.encodeParams(board), {
      headers: this.headersOverride
    });

  }

  public validateBoard(board: Board): Observable<BoardStatusResult> {
    return this.http.post<BoardStatusResult>(`${this.baseUrl}/validate`, this.encodeParams(board), {
      headers: this.headersOverride
    });
  }

}
