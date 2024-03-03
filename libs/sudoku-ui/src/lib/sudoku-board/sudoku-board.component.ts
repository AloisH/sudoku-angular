import { BoardCell, BoardCellType, SudokuEngine } from '@sudoku-angular/sudoku-engine';
import { BoardDifficulty, BoardStatus } from '@sudoku-angular/api-sudoku';
import { Component, HostListener } from '@angular/core';

import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type SelectedCell = {
  colIdx: number;
  rowIdx: number;
  element: HTMLElement;
}

@Component({
  selector: 'sud-board',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, BadgeComponent],
  templateUrl: './sudoku-board.component.html',
  styleUrl: './sudoku-board.component.css',
})
export class SudokuBoardComponent {
  BoardCellType = BoardCellType;

  board: BoardCell[][] = [];
  selectedCell: SelectedCell | null;
  status: BoardStatus;
  difficulty: BoardDifficulty;
  isLoading: boolean;
  roomId: string;

  possibleKey = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

  constructor(private sudokuEngine: SudokuEngine) {
    this.sudokuEngine.board$.subscribe((board) => {
      this.board = board;
    });
    this.sudokuEngine.difficulty$.subscribe((difficulty) => this.difficulty = difficulty);
    this.sudokuEngine.status$.subscribe((status) => this.status = status);
    this.selectedCell = null;
    this.sudokuEngine.setNewBoard("easy");
    this.status = "unsolved";
    this.difficulty = "random";
    this.isLoading = false;
    this.roomId = "";
  }

  async onClickGenerate(difficulty: BoardDifficulty) {
    this.isLoading = true;
    await this.sudokuEngine.setNewBoard(difficulty);
    this.isLoading = false;
  }

  async onClickValidate() {
    this.isLoading = true;
    await this.sudokuEngine.validateBoard();
    this.isLoading = false;
  }

  async onCickSolve() {
    this.isLoading = true;
    await this.sudokuEngine.solveBoard();
    this.isLoading = false;
  }

  onClickBoard($event: Event) {
    const srcElement = $event.target as HTMLElement;
    if (!srcElement) return;
    if (!srcElement.classList.contains("square")) return;

    if (this.selectedCell) {
      this.selectedCell.element.classList.remove("selected");
    }

    this.selectedCell = {
      element: srcElement,
      rowIdx: 0,
      colIdx: 0,
    };
    this.selectedCell.element.classList.add("selected");
    srcElement.classList.forEach((className: string) => {
      if (!this.selectedCell) return;
      if (className.startsWith("col")) {
        this.selectedCell.colIdx = +className.charAt(3);
      }
      if (className.startsWith("row")) {
        this.selectedCell.rowIdx = +className.charAt(3);
      }
    });

    return;
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.setNewValueToSelectedCell(event.key);
  }

  setNewValueToSelectedCell(key: string) {
    if (this.isLoading) return;
    if (!this.selectedCell || this.board[this.selectedCell.colIdx][this.selectedCell.rowIdx].type === BoardCellType.DEFAULT || this.board[this.selectedCell.colIdx][this.selectedCell.rowIdx].type === BoardCellType.SOLVER) return;
    if (this.possibleKey.includes(key)) {
      this.board[this.selectedCell.colIdx][this.selectedCell.rowIdx].value = +key;
      this.sudokuEngine.setValue(this.selectedCell.colIdx, this.selectedCell.rowIdx, +key);
      this.selectedCell.element.classList.add("selected");
    }
    if (key === "0") {
      this.selectedCell.element.classList.remove("selected");
      this.selectedCell = null;
    }
  }

  onClickLogin() {
    this.sudokuEngine.initCoop(this.roomId);
  }
}
