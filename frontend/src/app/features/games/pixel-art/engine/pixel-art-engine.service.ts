import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface GameTask {
  id: number;
  type: 'color' | 'pattern' | 'symmetry' | 'coordinates' | 'painter';
  question: string;
  data: any;
}

export interface PixelArtState {
  module: number;
  taskIndex: number;
  hearts: number;
  completed: boolean;
  deathCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PixelArtEngineService {
  private state: PixelArtState = { module: 0, taskIndex: 0, hearts: 3, completed: false, deathCount: 0 };
  public state$ = new BehaviorSubject<PixelArtState>(this.state);
  
  public tasks: GameTask[][] = [];

  constructor(private progress: ProgressReporter) {
    this.generateTasks();
    this.progress.fetchSessionState()?.subscribe(stateStr => {
      if (stateStr) {
        try {
          this.state = JSON.parse(stateStr);
          this.state$.next(this.state);
        } catch (e) {}
      }
    });
  }

  get score(): number {
    return Math.max(0, (this.state.module * 200) + (this.state.taskIndex * 20) - (this.state.deathCount * 20));
  }

  public saveState() {
    this.state$.next(this.state);
  }

  public resetModule() {
    this.state.taskIndex = 0;
    this.state.hearts = 3;
    this.saveState();
  }

  public resetGame() {
    this.state = { module: 0, taskIndex: 0, hearts: 3, completed: false, deathCount: 0 };
    this.saveState();
  }

  public getState() {
    return this.state;
  }

  public getCurrentTask(): GameTask | null {
    if (this.state.completed || this.state.module >= 5) return null;
    return this.tasks[this.state.module][this.state.taskIndex];
  }

  public advanceTask() {
    this.state.taskIndex++;
    if (this.state.taskIndex >= 10) {
      this.state.module++;
      this.state.taskIndex = 0;
      if (this.state.module >= 5) {
        this.state.completed = true;
      }
    }
    this.saveState();
  }

  public loseHeart(): boolean {
    this.state.hearts--;
    if (this.state.hearts <= 0) {
      this.state.deathCount++;
      this.resetModule();
      return true; // module restarted
    }
    this.saveState();
    return false; // still alive
  }

  private generateTasks() {
    this.tasks = [
      this.generateColorTasks(),
      this.generatePatternTasks(),
      this.generateSymmetryTasks(),
      this.generateCoordinateTasks(),
      this.generatePainterTasks()
    ];
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

  // 1: Qual é a Cor? (Tap)
  private generateColorTasks(): GameTask[] {
    const colors = [
      { name: 'vermelho', code: '#ef4444' },
      { name: 'azul', code: '#3b82f6' },
      { name: 'verde', code: '#22c55e' },
      { name: 'amarelo', code: '#eab308' },
      { name: 'roxo', code: '#a855f7' },
      { name: 'laranja', code: '#f97316' },
      { name: 'rosa', code: '#ec4899' },
      { name: 'preto', code: '#000000' },
      { name: 'branco', code: '#ffffff' },
      { name: 'marrom', code: '#8b4513' }
    ];
    let tasks: GameTask[] = [];
    for (let i = 0; i < 10; i++) {
      let target = colors[i % colors.length];
      let options = this.shuffle([...colors]).slice(0, 4);
      if (!options.find(o => o.name === target.name)) {
        options[0] = target;
        this.shuffle(options);
      }
      tasks.push({
        id: i,
        type: 'color',
        question: `Toque no pixel ${target.name}`,
        data: { target, options }
      });
    }
    return this.shuffle(tasks);
  }

  // 2: Completar o Padrão (Tap)
  private generatePatternTasks(): GameTask[] {
    const tasks: GameTask[] = [];
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308'];
    for(let i=0; i<10; i++) {
        let pattern = [colors[i%4], colors[(i+1)%4], colors[i%4], colors[(i+1)%4]];
        let target = pattern[3];
        let options = this.shuffle([...colors]);
        tasks.push({
            id: i,
            type: 'pattern',
            question: 'Complete o padrão',
            data: { pattern: [pattern[0], pattern[1], pattern[2], null], target, options }
        });
    }
    return this.shuffle(tasks);
  }

  // 3: Simetria (Drag)
  private generateSymmetryTasks(): GameTask[] {
    const tasks: GameTask[] = [];
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];
    for(let i=0; i<10; i++) {
        let grid = Array(9).fill(null);
        let color1 = colors[i%colors.length];
        let color2 = colors[(i+1)%colors.length];
        
        // Left side
        grid[0] = color1;
        grid[3] = color2;
        
        // Right side mirror
        grid[2] = grid[0];
        // missing grid[5] which should be grid[3]
        
        tasks.push({
            id: i,
            type: 'symmetry',
            question: 'Arraste o bloco para completar a simetria',
            data: { 
                grid: grid,
                targetIndex: 5,
                dragColor: color2
            }
        });
    }
    return this.shuffle(tasks);
  }

  // 4: Coordenadas (Tap)
  private generateCoordinateTasks(): GameTask[] {
    const tasks: GameTask[] = [];
    for(let i=0; i<10; i++) {
        let row = Math.floor(Math.random() * 3);
        let col = Math.floor(Math.random() * 3);
        tasks.push({
            id: i,
            type: 'coordinates',
            question: `Toque no pixel da Linha ${row + 1}, Coluna ${col + 1}`,
            data: { targetRow: row, targetCol: col, gridSize: 3 }
        });
    }
    return this.shuffle(tasks);
  }

  // 5: Pintor Digital (Drag 3 zones)
  private generatePainterTasks(): GameTask[] {
    const tasks: GameTask[] = [];
    for(let i=0; i<10; i++) {
        tasks.push({
            id: i,
            type: 'painter',
            question: 'Arraste as cores para os seus nomes corretos',
            data: {
                zones: this.shuffle([
                    { name: 'Red', color: '#ef4444', id: 'red' },
                    { name: 'Green', color: '#22c55e', id: 'green' },
                    { name: 'Blue', color: '#3b82f6', id: 'blue' }
                ]),
                draggables: this.shuffle([
                    { color: '#ef4444', id: 'red' },
                    { color: '#22c55e', id: 'green' },
                    { color: '#3b82f6', id: 'blue' }
                ])
            }
        });
    }
    return tasks;
  }
}
