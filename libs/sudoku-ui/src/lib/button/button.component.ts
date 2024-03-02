import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'sudoku-angular-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent { }
