import { Injectable } from '@angular/core';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface GameState {
  modulo: number; // 1 to 5
  fase: number;   // 0 to 9
  vidas: number;  // starts at 3
  completed: boolean;
  deathCount: number;
}

export interface TaskConfig {
  type: 'input' | 'color' | 'format' | 'shape' | 'combination';
  prompt: string;
  word?: string;
  expectedWord?: string; // for type 'input'
  options?: any[];       // for other types
  expectedCorrectOption?: any;
}

@Injectable({ providedIn: 'root' })
export class TextShapesEngineService {
  state: GameState = { modulo: 1, fase: 0, vidas: 3, completed: false, deathCount: 0 };
  currentTask: TaskConfig | null = null;

  private m1Words = ['Computador', 'Mouse', 'Teclado', 'Tela', 'Livro', 'Lápis', 'Borracha', 'Mochila', 'Escola', 'Caderno', 'Caneta', 'Papel', 'Amigo', 'Brincar', 'Estudar'];
  private m2Colors = [
    { label: 'Vermelho', class: 'bg-red-500' },
    { label: 'Azul', class: 'bg-blue-500' },
    { label: 'Verde', class: 'bg-green-500' },
    { label: 'Amarelo', class: 'bg-yellow-500' }
  ];
  private m2Words = ['Maçã', 'Céu', 'Grama', 'Sol', 'Carro', 'Bola', 'Flor', 'Pássaro', 'Casa', 'Árvore'];
  private m3Formats = [
    { label: 'NEGRITO', value: 'bold', style: 'font-weight: bold;' },
    { label: 'ITÁLICO', value: 'italic', style: 'font-style: italic;' },
    { label: 'SUBLINHADO', value: 'underline', style: 'text-decoration: underline;' }
  ];
  private m3Words = ['Gato', 'Cachorro', 'Peixe', 'Pássaro', 'Coelho', 'Tartaruga', 'Rato', 'Cavalo', 'Vaca', 'Porco'];
  private m4Shapes = [
    { label: 'CÍRCULO', icon: 'fa-circle' },
    { label: 'QUADRADO', icon: 'fa-square' },
    { label: 'TRIÂNGULO', icon: 'fa-play' } // using play as triangle or something similar
  ];
  private m5Combinations = [
    { label: 'Círculo Vermelho', icon: 'fa-circle', class: 'text-red-500', shape: 'Círculo', color: 'Vermelho' },
    { label: 'Quadrado Azul', icon: 'fa-square', class: 'text-blue-500', shape: 'Quadrado', color: 'Azul' },
    { label: 'Triângulo Verde', icon: 'fa-play', class: 'text-green-500', shape: 'Triângulo', color: 'Verde' },
    { label: 'Círculo Amarelo', icon: 'fa-circle', class: 'text-yellow-500', shape: 'Círculo', color: 'Amarelo' },
    { label: 'Quadrado Verde', icon: 'fa-square', class: 'text-green-500', shape: 'Quadrado', color: 'Verde' },
    { label: 'Triângulo Azul', icon: 'fa-play', class: 'text-blue-500', shape: 'Triângulo', color: 'Azul' }
  ];

  get score(): number {
    return Math.max(0, (this.state.modulo * 200) + (this.state.fase * 20) - (this.state.deathCount * 20));
  }

  constructor(private progress: ProgressReporter) {
    this.progress.fetchSessionState()?.subscribe((saved: string | null) => {
      if (saved) {
        try {
          this.state = JSON.parse(saved);
        } catch (e) {
          this.resetState();
        }
      } else {
        this.resetState();
      }
      if (!this.state.completed) {
        this.generateTask();
      }
    });
  }

  resetState() {
    this.state = { modulo: 1, fase: 0, vidas: 3, completed: false, deathCount: 0 };
  }

  restartModule() {
    this.state.fase = 0;
    this.state.vidas = 3;
    this.generateTask();
  }

  private shuffle(array: any[]) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  generateTask() {
    const m = this.state.modulo;
    if (m === 1) {
      const word = this.m1Words[Math.floor(Math.random() * this.m1Words.length)];
      this.currentTask = {
        type: 'input',
        prompt: `Digite a palavra exatamente como está:`,
        word: word,
        expectedWord: word.toLowerCase()
      };
    } else if (m === 2) {
      const color = this.m2Colors[Math.floor(Math.random() * this.m2Colors.length)];
      const word = this.m2Words[Math.floor(Math.random() * this.m2Words.length)];
      let options = [...this.m2Colors];
      this.currentTask = {
        type: 'color',
        prompt: `Pinte esta palavra de ${color.label.toUpperCase()}`,
        word: word,
        options: this.shuffle(options),
        expectedCorrectOption: color
      };
    } else if (m === 3) {
      const format = this.m3Formats[Math.floor(Math.random() * this.m3Formats.length)];
      const word = this.m3Words[Math.floor(Math.random() * this.m3Words.length)];
      let options = [...this.m3Formats];
      this.currentTask = {
        type: 'format',
        prompt: `Deixe a palavra em ${format.label}`,
        word: word,
        options: this.shuffle(options),
        expectedCorrectOption: format
      };
    } else if (m === 4) {
      const shape = this.m4Shapes[Math.floor(Math.random() * this.m4Shapes.length)];
      let options = [...this.m4Shapes];
      this.currentTask = {
        type: 'shape',
        prompt: `Adicione um ${shape.label} na tela`,
        options: this.shuffle(options),
        expectedCorrectOption: shape
      };
    } else if (m === 5) {
      const combo = this.m5Combinations[Math.floor(Math.random() * this.m5Combinations.length)];
      let options = [...this.m5Combinations];
      this.currentTask = {
        type: 'combination',
        prompt: `Precisamos de um ${combo.label.toUpperCase()}`,
        options: this.shuffle(options),
        expectedCorrectOption: combo
      };
    }
  }

  checkAnswer(answer: any) {
    let isCorrect = false;
    if (this.currentTask?.type === 'input') {
      isCorrect = (answer || '').trim().toLowerCase() === this.currentTask.expectedWord;
    } else {
      isCorrect = answer === this.currentTask?.expectedCorrectOption;
    }

    if (isCorrect) {
      this.progress.report({
        levelId: `text_shapes_m${this.state.modulo}_f${this.state.fase}`,
        fase: this.state.modulo * 10 + this.state.fase,
        result: 'success',
        attempts: 1,
        timestamp: new Date().toISOString(),
        isLastLevel: this.state.modulo === 5 && this.state.fase === 9,
        score: this.score,
        gameState: JSON.stringify(this.state)
      });

      this.state.fase++;
      if (this.state.fase >= 10) {
        this.state.modulo++;
        this.state.fase = 0;
        this.state.vidas = 3;
        if (this.state.modulo > 5) {
          this.state.completed = true;
        }
      }
      if (!this.state.completed) {
        this.generateTask();
      }
    } else {
      this.progress.report({
        levelId: `text_shapes_m${this.state.modulo}_f${this.state.fase}`,
        fase: this.state.modulo * 10 + this.state.fase,
        result: 'failure',
        attempts: 1,
        timestamp: new Date().toISOString(),
        isLastLevel: false,
        score: this.score,
        gameState: JSON.stringify(this.state)
      });
      this.state.vidas--;
      if (this.state.vidas <= 0) {
        this.state.deathCount++;
        // game over for this module, restart module handled by component or here
      }
    }
    return isCorrect;
  }
}
