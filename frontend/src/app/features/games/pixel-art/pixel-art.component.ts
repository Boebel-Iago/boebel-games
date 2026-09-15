import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressReporter } from '../../../core/progress/progress-reporter';
import { PixelArtRepository } from './content/pixel-art-repository.service';
import { PixelLevel } from './content/pixel-art.model';

@Component({
  selector: 'app-pixel-art',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pixel-art.component.html',
  styleUrl: './pixel-art.component.scss'
})
export class PixelArtComponent implements OnInit {

  // --- COORDENADAS (Batalha Naval) ---
  columns: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  rows: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  currentLevelIndex = 0;
  currentLevel!: PixelLevel;
  
  studentGrid: number[] = Array(100).fill(0);
  targetGrid: number[] = [];
  
  // Array extra para separar as strings na tela de código perfeitamente
  currentPatternGrid: string[][] = [];

  selectedNumber: number = 1; 
  isLevelCompleted: boolean = false;
  gameFinished: boolean = false;

  get totalLevels(): number {
    return this.repository.getTotalLevels();
  }

  constructor(
    private progressReporter: ProgressReporter,
    private repository: PixelArtRepository
  ) {}

  ngOnInit() {
    const saved = sessionStorage.getItem('currentStage');
    let startLevel = 0;
    
    if (saved && saved !== 'undefined' && saved !== 'null') {
      const stage = parseInt(saved, 10);
      if (!isNaN(stage) && stage > 0 && stage <= this.repository.getTotalLevels()) {
        startLevel = stage - 1; // Ajusta 1-based para 0-based
      } else if (!isNaN(stage) && stage > this.repository.getTotalLevels()) {
        this.gameFinished = true;
        return;
      }
    }
    this.loadLevel(startLevel);
  }

  loadLevel(index: number) {
    const level = this.repository.getLevel(index);
    if (!level) return;

    this.currentLevelIndex = index;
    this.currentLevel = level;
    this.studentGrid = Array(100).fill(0);
    this.isLevelCompleted = false;

    this.targetGrid = this.currentLevel.pattern.join('').split('').map(Number);
    
    // Converte ["010", "111"] em [ ["0","1","0"], ["1","1","1"] ] para alinhar com as coordenadas no HTML
    this.currentPatternGrid = this.currentLevel.pattern.map(row => row.split(''));
    
    const availableNumbers = this.getAvailableColorNumbers();
    const firstDrawColor = availableNumbers.find(n => n !== 0);
    this.selectedNumber = firstDrawColor ?? 1;
  }

  getAvailableColorNumbers(): number[] {
    return Object.keys(this.currentLevel.colors).map(Number);
  }

  selectColor(num: number) {
    this.selectedNumber = num;
  }

  paintCell(index: number) {
    if (this.isLevelCompleted) return;
    this.studentGrid[index] = this.selectedNumber;
  }

  checkAnswer() {
    const isCorrect = JSON.stringify(this.studentGrid) === JSON.stringify(this.targetGrid);
    const absoluteStage = this.currentLevelIndex + 1;

    if (isCorrect) {
      this.isLevelCompleted = true;
      const isLast = this.currentLevelIndex === this.repository.getTotalLevels() - 1;
      
      this.progressReporter.report({
        fase: absoluteStage,
        result: 'success',
        isLastLevel: isLast
      });

      if (isLast) {
        this.gameFinished = true;
      }
    } else {
      this.progressReporter.report({
        fase: absoluteStage,
        result: 'failure'
      });
      alert('Ainda há pixels incorretos! Olhe bem o código e o mapa.');
    }
  }

  nextLevel() {
    if (!this.gameFinished && this.currentLevelIndex < this.repository.getTotalLevels() - 1) {
      this.loadLevel(this.currentLevelIndex + 1);
    }
  }

  clearGrid() {
    if (!this.isLevelCompleted) {
      this.studentGrid = Array(100).fill(0);
    }
  }

  get currentColorHex(): string {
    return this.currentLevel.colors[this.selectedNumber];
  }
}