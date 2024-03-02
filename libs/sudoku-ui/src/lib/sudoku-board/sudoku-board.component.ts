import { BoardDifficulty, BoardStatus } from '@sudoku-angular/api-sudoku';
import { Component, HostListener } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SudokuEngine } from '@sudoku-angular/sudoku-engine';

type SelectedCell = {
  colIdx: number;
  rowIdx: number;
  element: HTMLElement;
}

type BoardCell = {
  value: number;
  hasDefaultValue: boolean;
}

@Component({
  selector: 'sudoku-angular-sudoku-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sudoku-board.component.html',
  styleUrl: './sudoku-board.component.css',
})
export class SudokuBoardComponent {
  board: BoardCell[][] = [];
  selectedCell: SelectedCell | null;
  status: BoardStatus;
  difficulty: BoardDifficulty;

  possibleKey = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

  constructor(private sudokuEngine: SudokuEngine) {
    this.sudokuEngine.board$.subscribe((board) => {
      this.board = board.map((col) => col.map((row): BoardCell => ({ value: row, hasDefaultValue: row !== 0 })));
    });
    this.sudokuEngine.difficulty$.subscribe((difficulty) => this.difficulty = difficulty);
    this.sudokuEngine.status$.subscribe((status) => this.status = status);
    this.selectedCell = null;
    this.sudokuEngine.setNewBoard("easy");
    this.status = "unsolved";
    this.difficulty = "random";
  }

  onClickGenerate(difficulty: BoardDifficulty) {
    this.sudokuEngine.setNewBoard(difficulty);
  }

  onClickValidate() {
    console.log("OnClickValide");
    this.sudokuEngine.validateBoard();
  }

  onCickSolve() {
    this.sudokuEngine.solveBoard();
  }

  onClickBoard($event: Event) {
    console.log("Clicked");
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
    if (!this.selectedCell || this.board[this.selectedCell.colIdx][this.selectedCell.rowIdx].hasDefaultValue) return;
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
}
