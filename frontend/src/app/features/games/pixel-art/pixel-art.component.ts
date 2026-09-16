import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Level {
  id: number;
  title: string;
  instruction: string;
  colors: { [key: number]: string };
  pattern: string[]; 
}

@Component({
  selector: 'app-pixel-art',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pixel-art.component.html',
  styleUrl: './pixel-art.component.scss'
})
export class PixelArtComponent implements OnInit {
  
  masterColors = {
    0: '#FFFFFF', // Branco
    1: '#000000', // Preto
    2: '#EF4444', // Vermelho
    3: '#3B82F6', // Azul
    4: '#10B981', // Verde
    5: '#F59E0B', // Amarelo
    6: '#8B5CF6'  // Roxo
  };

  // --- COORDENADAS (Batalha Naval) ---
  columns: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  rows: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  levels: Level[] = [
    { id: 1, title: 'Fase 1', instruction: 'Pinte o quadrado central.', colors: {0: this.masterColors[0], 1: this.masterColors[1]}, pattern: [
      "0000000000", "0000000000", "0011111100", "0011111100", "0011111100", "0011111100", "0011111100", "0011111100", "0000000000", "0000000000"
    ]},
    { id: 2, title: 'Fase 2', instruction: 'Siga os números 1 para fazer o contorno.', colors: {0: this.masterColors[0], 1: this.masterColors[1]}, pattern: [
      "0000000000", "0111111110", "0100000010", "0100000010", "0100000010", "0100000010", "0100000010", "0100000010", "0111111110", "0000000000"
    ]},
    { id: 3, title: 'Fase 3', instruction: 'Faça um X na tela cruzando os números 1.', colors: {0: this.masterColors[0], 1: this.masterColors[1]}, pattern: [
      "1000000001", "0100000010", "0010000100", "0001001000", "0000110000", "0000110000", "0001001000", "0010000100", "0100000010", "1000000001"
    ]},
    { id: 4, title: 'Fase 4', instruction: 'Preencha apenas o centro exato do mapa.', colors: {0: this.masterColors[0], 1: this.masterColors[1]}, pattern: [
      "0000000000", "0000110000", "0000110000", "0000110000", "0111111110", "0111111110", "0000110000", "0000110000", "0000110000", "0000000000"
    ]},
    { id: 5, title: 'Fase 5', instruction: 'Intercale os números (0 e 1).', colors: {0: this.masterColors[0], 1: this.masterColors[1]}, pattern: [
      "1010101010", "0101010101", "1010101010", "0101010101", "1010101010", "0101010101", "1010101010", "0101010101", "1010101010", "0101010101"
    ]},
    { id: 6, title: 'Fase 6', instruction: 'Desenhe o rosto sorridente.', colors: {0: this.masterColors[0], 1: this.masterColors[1]}, pattern: [
      "0000000000", "0010000100", "0010000100", "0010000100", "0000000000", "0000000000", "1000000001", "0100000010", "0011111100", "0000000000"
    ]},
    { id: 7, title: 'Fase 7', instruction: 'Agora um rosto triste.', colors: {0: this.masterColors[0], 1: this.masterColors[1]}, pattern: [
      "0000000000", "0010000100", "0010000100", "0000000000", "0000000000", "0000000000", "0011111100", "0100000010", "1000000001", "0000000000"
    ]},
    { id: 8, title: 'Fase 8', instruction: 'Construa a casa lendo as linhas.', colors: {0: this.masterColors[0], 1: this.masterColors[1]}, pattern: [
      "0000110000", "0001111000", "0011111100", "0111111110", "1111111111", "0011111100", "0011111100", "0011001100", "0011001100", "0011001100"
    ]},
    { id: 9, title: 'Fase 9', instruction: 'Uma ferramenta para aventuras.', colors: {0: this.masterColors[0], 1: this.masterColors[1]}, pattern: [
      "0000000001", "0000000011", "0000000110", "0000001100", "0000011000", "0011110000", "0001100000", "0110000000", "1100000000", "1000000000"
    ]},
    { id: 10, title: 'Fase 10', instruction: 'Cuidado com os aliens.', colors: {0: this.masterColors[0], 1: this.masterColors[1]}, pattern: [
      "0010000100", "0001001000", "0011111100", "0110110110", "1111111111", "1011111101", "1010000101", "0001111000", "0000000000", "0000000000"
    ]},
    { id: 11, title: 'Fase 11', instruction: 'Agora temos vermelho (2)!', colors: {0: this.masterColors[0], 1: this.masterColors[1], 2: this.masterColors[2]}, pattern: [
      "1111111111", "1000000001", "1022222201", "1020000201", "1020110201", "1020110201", "1020000201", "1022222201", "1000000001", "1111111111"
    ]},
    { id: 12, title: 'Fase 12', instruction: 'Vermelho(2), Amarelo(5) e Verde(4).', colors: {0: this.masterColors[0], 1: this.masterColors[1], 2: this.masterColors[2], 4: this.masterColors[4], 5: this.masterColors[5]}, pattern: [
      "0001111000", "0001221000", "0001221000", "0001111000", "0001551000", "0001551000", "0001111000", "0001441000", "0001441000", "0001111000"
    ]},
    { id: 13, title: 'Fase 13', instruction: 'Pinte o coração de vermelho (2).', colors: {0: this.masterColors[0], 2: this.masterColors[2]}, pattern: [
      "0000000000", "0022002200", "0222222220", "0222222220", "0222222220", "0022222200", "0002222000", "0000220000", "0000000000", "0000000000"
    ]},
    { id: 14, title: 'Fase 14', instruction: 'Um barco (5) no mar azul (3).', colors: {0: this.masterColors[0], 1: this.masterColors[1], 3: this.masterColors[3], 5: this.masterColors[5]}, pattern: [
      "0000000000", "0000010000", "0000110000", "0001110000", "0011110000", "0000010000", "0555555550", "0055555500", "3333333333", "3333333333"
    ]},
    { id: 15, title: 'Fase 15', instruction: 'Uma flor usando várias cores!', colors: {0: this.masterColors[0], 2: this.masterColors[2], 4: this.masterColors[4], 5: this.masterColors[5], 6: this.masterColors[6]}, pattern: [
      "0000000000", "0000220000", "0002552000", "0065555600", "0002552000", "0000220000", "0000440000", "0004440000", "0044444000", "0000440000"
    ]}
  ];

  currentLevelIndex = 0;
  currentLevel!: Level;
  
  studentGrid: number[] = Array(100).fill(0);
  targetGrid: number[] = [];
  
  // Array extra para separar as strings na tela de código perfeitamente
  currentPatternGrid: string[][] = [];

  selectedNumber: number = 1; 
  isLevelCompleted: boolean = false;
  gameFinished: boolean = false;

  ngOnInit() {
    this.loadLevel(0);
  }

  loadLevel(index: number) {
    this.currentLevelIndex = index;
    this.currentLevel = this.levels[index];
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
    if (isCorrect) {
      this.isLevelCompleted = true;
      if (this.currentLevelIndex === this.levels.length - 1) {
        this.gameFinished = true;
      }
    } else {
      alert("Ops! Tem algo diferente. Verifique linha por linha, preste atenção nas letras e números!");
    }
  }

  nextLevel() {
    if (this.currentLevelIndex < this.levels.length - 1) {
      this.loadLevel(this.currentLevelIndex + 1);
    }
  }

  clearGrid() {
    if (!this.isLevelCompleted) {
      this.studentGrid = Array(100).fill(0);
    }
  }
}