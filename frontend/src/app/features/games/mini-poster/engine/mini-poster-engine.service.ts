import { Injectable } from '@angular/core';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface MiniPosterState {
  modulo: number;
  taskIndex: number;
  hearts: number;
  tasks: any[];
}

@Injectable({ providedIn: 'root' })
export class MiniPosterEngineService {
  public state: MiniPosterState = {
    modulo: 0,
    taskIndex: 0,
    hearts: 3,
    tasks: []
  };

  private readonly STORAGE_KEY = 'boebel_mini_poster_state';

  constructor(private progress: ProgressReporter) {
    this.loadState();
  }

  private shuffleArray(array: any[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  private loadState() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.state = JSON.parse(saved);
    } else {
      this.initModulo(0);
    }
  }

  private saveState() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  }

  private clearState() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  public initModulo(moduloIndex: number) {
    this.state.modulo = moduloIndex;
    this.state.taskIndex = 0;
    this.state.hearts = 3;

    let baseTasks: any[] = [];
    if (moduloIndex === 0) {
      baseTasks = Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        imageIcon: ['fa-dog', 'fa-cat', 'fa-car', 'fa-house', 'fa-tree', 'fa-star', 'fa-heart', 'fa-plane', 'fa-apple-alt', 'fa-book'][i],
        correctArea: 'image'
      }));
    } else if (moduloIndex === 1) {
      const items = [
        { img: 'fa-dog', correct: 'Cachorro Perdido', wrong: ['Vende-se Carro', 'Festa na Escola'] },
        { img: 'fa-car', correct: 'Vende-se Carro', wrong: ['Cachorro Perdido', 'Casa à Venda'] },
        { img: 'fa-birthday-cake', correct: 'Festa de Aniversário', wrong: ['Vende-se Carro', 'Doa-se Gato'] },
        { img: 'fa-cat', correct: 'Doa-se Gato', wrong: ['Festa na Escola', 'Cachorro Perdido'] },
        { img: 'fa-house', correct: 'Casa à Venda', wrong: ['Bazar da Escola', 'Campeonato de Futebol'] },
        { img: 'fa-store', correct: 'Bazar da Escola', wrong: ['Vende-se Carro', 'Doa-se Gato'] },
        { img: 'fa-futbol', correct: 'Campeonato de Futebol', wrong: ['Festa na Escola', 'Casa à Venda'] },
        { img: 'fa-book', correct: 'Feira de Livros', wrong: ['Cachorro Perdido', 'Vende-se Carro'] },
        { img: 'fa-music', correct: 'Aulas de Música', wrong: ['Festa de Aniversário', 'Campeonato de Futebol'] },
        { img: 'fa-paint-brush', correct: 'Oficina de Artes', wrong: ['Bazar da Escola', 'Feira de Livros'] }
      ];
      baseTasks = items.map(item => ({
        ...item,
        options: this.shuffleArray([item.correct, ...item.wrong])
      }));
    } else if (moduloIndex === 2) {
      const alignments = ['left', 'center', 'right'];
      const ptAligns = { 'left': 'ESQUERDA', 'center': 'CENTRO', 'right': 'DIREITA' };
      baseTasks = Array.from({ length: 10 }).map((_, i) => {
        const align = alignments[i % 3];
        return {
          id: i,
          target: align,
          prompt: ptAligns[align as keyof typeof ptAligns]
        };
      });
    } else if (moduloIndex === 3) {
      const items = [
        { title: 'Campeonato de Futebol', correct: 'fa-futbol', wrong: ['fa-laptop', 'fa-pizza-slice'] },
        { title: 'Festa da Pizza', correct: 'fa-pizza-slice', wrong: ['fa-car', 'fa-book'] },
        { title: 'Curso de Informática', correct: 'fa-laptop', wrong: ['fa-tree', 'fa-futbol'] },
        { title: 'Clube de Leitura', correct: 'fa-book', wrong: ['fa-paint-brush', 'fa-pizza-slice'] },
        { title: 'Exposição de Arte', correct: 'fa-paint-brush', wrong: ['fa-music', 'fa-car'] },
        { title: 'Aulas de Piano', correct: 'fa-music', wrong: ['fa-futbol', 'fa-laptop'] },
        { title: 'Passeio no Parque', correct: 'fa-tree', wrong: ['fa-book', 'fa-pizza-slice'] },
        { title: 'Corrida de Carros', correct: 'fa-car', wrong: ['fa-music', 'fa-paint-brush'] },
        { title: 'Show de Mágica', correct: 'fa-magic', wrong: ['fa-laptop', 'fa-tree'] },
        { title: 'Adote um Pet', correct: 'fa-paw', wrong: ['fa-car', 'fa-magic'] }
      ];
      baseTasks = items.map(item => ({
        ...item,
        options: this.shuffleArray([item.correct, ...item.wrong])
      }));
    } else if (moduloIndex === 4) {
      const items = [
        { title: 'Adote', img: 'fa-paw' },
        { title: 'Festa', img: 'fa-birthday-cake' },
        { title: 'Futebol', img: 'fa-futbol' },
        { title: 'Música', img: 'fa-music' },
        { title: 'Vende-se', img: 'fa-car' },
        { title: 'Arte', img: 'fa-paint-brush' },
        { title: 'Bazar', img: 'fa-store' },
        { title: 'Teatro', img: 'fa-masks-theater' },
        { title: 'Livros', img: 'fa-book' },
        { title: 'Doação', img: 'fa-heart' }
      ];
      baseTasks = items.map((item, i) => ({
        id: i,
        ...item
      }));
    }

    this.state.tasks = this.shuffleArray(baseTasks);
    this.saveState();
  }

  public reportMistake() {
    this.state.hearts--;
    const globalFase = this.state.modulo * 10 + this.state.taskIndex;
    
    this.progress.report({
      levelId: `fase-${globalFase}`,
      fase: globalFase,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false
    });

    if (this.state.hearts <= 0) {
      this.initModulo(this.state.modulo);
    } else {
      this.saveState();
    }
  }

  public completeTask() {
    const globalFase = this.state.modulo * 10 + this.state.taskIndex;
    const isLastTask = this.state.modulo === 4 && this.state.taskIndex === 9;
    
    this.progress.report({
      levelId: `fase-${globalFase}`,
      fase: globalFase,
      result: 'success',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: isLastTask
    });

    if (isLastTask) {
      this.clearState();
      this.state.taskIndex++;
    } else {
      if (this.state.taskIndex === 9) {
        this.initModulo(this.state.modulo + 1);
      } else {
        this.state.taskIndex++;
        this.saveState();
      }
    }
  }
}
