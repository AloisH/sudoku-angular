import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SudokuBoardComponent } from "@sudoku-angular/sudoku-ui"

@Component({
  standalone: true,
  imports: [RouterModule, SudokuBoardComponent],
  selector: 'sudoku-angular-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'sudoku-angular';
}
