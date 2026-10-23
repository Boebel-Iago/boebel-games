import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export type TaskType = 'color' | 'pattern' | 'symmetry' | 'grid' | 'painter' | 'drawing';

export interface DrawingTemplate {
  emoji: string;
  name: string;
  grid: (string | null)[];
  palette: string[];
}

export interface GameTask {
  id: number;
  type: TaskType;
  emoji?: string;
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

const CM: Record<string, string> = {
  'R': '#ef4444', 'B': '#3b82f6', 'G': '#22c55e', 'Y': '#eab308',
  'P': '#a855f7', 'O': '#f97316', 'K': '#ec4899', 'N': '#92400e',
  'A': '#9ca3af', 'X': '#1f2937', 'W': '#fef3c7',
};

function parseGrid(rows: string[]): (string | null)[] {
  const grid: (string | null)[] = [];
  for (const row of rows) {
    for (const char of row) {
      grid.push(char === '.' ? null : (CM[char] ?? null));
    }
  }
  return grid;
}

export const DRAWING_TEMPLATES: DrawingTemplate[] = [
  {
    emoji: '❤️', name: 'Coração',
    grid: parseGrid(['.RR..RR...', 'RRRRRRRR..', 'RRRRRRRRRR', 'RRRRRRRRRR', '.RRRRRRRR.', '..RRRRRR..', '...RRRR...', '....RR....', '..........', '..........']),
    palette: ['#ef4444'],
  },
  {
    emoji: '⭐', name: 'Estrela',
    grid: parseGrid(['....Y.....', '...YYY....', '..YYYYY...', '.YYYYYYY..', 'YYYYYYYYYY', '.YYYYYYY..', '..YYYYY...', '...YYY....', '....Y.....', '..........']),
    palette: ['#eab308'],
  },
  {
    emoji: '🏠', name: 'Casa',
    grid: parseGrid(['....RR....', '...RRRR...', '..RRRRRR..', '.RRRRRRRR.', 'RRRRRRRRRR', '.BBBBBBBB.', '.B..BB..B.', '.B..BB..B.', '.BBBBBBBB.', '..........']),
    palette: ['#ef4444', '#3b82f6'],
  },
  {
    emoji: '☀️', name: 'Sol',
    grid: parseGrid(['.Y......Y.', '..Y.YY.Y..', '...YYYYY..', 'Y.YYYYYYY.', '.YYYYYYYYY', 'Y.YYYYYYY.', '...YYYYY..', '..Y.YY.Y..', '.Y......Y.', '..........']),
    palette: ['#eab308'],
  },
  {
    emoji: '🌳', name: 'Árvore',
    grid: parseGrid(['....G.....', '...GGG....', '..GGGGG...', '.GGGGGGG..', 'GGGGGGGGGG', '.GGGGGGG..', '..GGGGG...', '....N.....', '....N.....', '..........']),
    palette: ['#22c55e', '#92400e'],
  },
  {
    emoji: '🐟', name: 'Peixe',
    grid: parseGrid(['..........', 'B.....BBB.', 'BBBBBBBBBB', 'B.....BBB.', '..........', '..........', '..........', '..........', '..........', '..........']),
    palette: ['#3b82f6'],
  },
  {
    emoji: '🌸', name: 'Flor',
    grid: parseGrid(['....K.....', '...KKK....', '..KKKKK...', '.KKKYKKK..', '..KKKKK...', '...KKK....', '....G.....', '....G.....', '....G.....', '..........']),
    palette: ['#ec4899', '#eab308', '#22c55e'],
  },
  {
    emoji: '☁️', name: 'Nuvem',
    grid: parseGrid(['..........', '...AAAA...', '.AAAAAAAA.', 'AAAAAAAAAA', '.AAAAAAAA.', '..........', '..........', '..........', '..........', '..........']),
    palette: ['#9ca3af'],
  },
  {
    emoji: '🚀', name: 'Foguete',
    grid: parseGrid(['....R.....', '...RRR....', '..RRRRR...', '.RRRRRRR..', '.RRRRRRR..', '.RRRRRRR..', '.RRRRRRR..', 'RRR...RRR.', 'R.......R.', '..........']),
    palette: ['#ef4444'],
  },
  {
    emoji: '🍦', name: 'Sorvete',
    grid: parseGrid(['...KKKK...', '..KKKKKKK.', '.KKKKKKKKK', '..KKKKKKK.', '...NNNNN..', '....NNN...', '.....N....', '..........', '..........', '..........']),
    palette: ['#ec4899', '#92400e'],
  },
  {
    emoji: '🍎', name: 'Maçã',
    grid: parseGrid(['....GG....', '....G.....', '..RRRRRR..', '.RRRRRRRR.', 'RRRRRRRRRR', 'RRRRRRRRRR', '.RRRRRRRR.', '..RRRRRR..', '..........', '..........']),
    palette: ['#ef4444', '#22c55e'],
  },
  {
    emoji: '🍄', name: 'Cogumelo',
    grid: parseGrid(['...RRRRR..', '.RRRRRRRRR', 'RRRWWWRRRR', 'RRRWWWRRRR', '.RRRRRRRR.', '..WWWWWW..', '..WWWWWW..', '...WWWW...', '..........', '..........']),
    palette: ['#ef4444', '#fef3c7'],
  },
  {
    emoji: '🌈', name: 'Arco-íris',
    grid: parseGrid(['RRRRRRRRRR', 'YYYYYYYYYY', 'GGGGGGGGGG', 'BBBBBBBBBB', '..........', '..........', '..........', '..........', '..........', '..........']),
    palette: ['#ef4444', '#eab308', '#22c55e', '#3b82f6'],
  },
  {
    emoji: '🐱', name: 'Gatinho',
    grid: parseGrid(['OO......OO', 'OOOO..OOOO', '.OOOOOOOO.', '.OOOOOOOO.', '.OO.XX.OO.', '.OOOOOOOO.', '..O.KK.O..', '...OOOOOO.', '..........', '..........']),
    palette: ['#f97316', '#1f2937', '#ec4899'],
  },
  {
    emoji: '🦆', name: 'Patinho',
    grid: parseGrid(['.....YY...', '....YYYY..', '...YYYYYY.', '..YYYYYY..', '.YYYYYYYY.', 'YYYYYYYYYY', '.YYYYYY...', '..OOOO....', '..........', '..........']),
    palette: ['#eab308', '#f97316'],
  },
];

@Injectable({ providedIn: 'root' })
export class PixelArtEngineService {
  private _state: PixelArtState = { module: 0, taskIndex: 0, hearts: 3, completed: false, deathCount: 0 };
  public state$ = new BehaviorSubject<PixelArtState>({ ...this._state });
  public tasks: GameTask[][] = [];

  constructor(private progress: ProgressReporter) {
    this.generateTasks();
    this.progress.fetchSessionState()?.subscribe((session: any) => {
      if (session && session.gameState && session.gameState !== '{}') {
        try {
          const parsed = JSON.parse(session.gameState);
          this._state = parsed;
          this.state$.next({ ...this._state });
        } catch (e) {}
      }
    });
  }

  get score(): number {
    return Math.max(0, (this._state.module * 200) + (this._state.taskIndex * 20) - (this._state.deathCount * 20));
  }

  public saveState() { this.state$.next({ ...this._state }); }

  public resetModule() {
    this._state.taskIndex = 0;
    this._state.hearts = 3;
    this.saveState();
  }

  public resetGame() {
    this._state = { module: 0, taskIndex: 0, hearts: 3, completed: false, deathCount: 0 };
    this.generateTasks();
    this.saveState();
  }

  public getState() { return this._state; }

  public getCurrentTask(): GameTask | null {
    if (this._state.completed || this._state.module >= this.tasks.length) return null;
    return this.tasks[this._state.module]?.[this._state.taskIndex] ?? null;
  }

  public advanceTask() {
    this._state.taskIndex++;
    const maxTasks = this._state.module === 5 ? 15 : 10;
    if (this._state.taskIndex >= maxTasks) {
      this._state.module++;
      this._state.taskIndex = 0;
      if (this._state.module >= 6) {
        this._state.completed = true;
      }
    }
    this.saveState();
  }

  public loseHeart(): boolean {
    this._state.hearts--;
    if (this._state.hearts <= 0) {
      this._state.deathCount++;
      this.resetModule();
      return true;
    }
    this.saveState();
    return false;
  }

  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  private generateTasks() {
    this.tasks = [
      this.generateColorTasks(),
      this.generatePatternTasks(),
      this.generateSymmetryTasks(),
      this.generateGridTasks(),
      this.generatePainterTasks(),
      this.generateDrawingTasks(),
    ];
  }

  /** Módulo 0 — Toque na cor certa (visual: emoji da cor) */
  private generateColorTasks(): GameTask[] {
    const colors = [
      { emoji: '🔴', code: '#ef4444' },
      { emoji: '🔵', code: '#3b82f6' },
      { emoji: '🟢', code: '#22c55e' },
      { emoji: '🟡', code: '#eab308' },
      { emoji: '🟣', code: '#a855f7' },
      { emoji: '🟠', code: '#f97316' },
      { emoji: '💗', code: '#ec4899' },
      { emoji: '⚫', code: '#1f2937' },
      { emoji: '🟤', code: '#92400e' },
      { emoji: '⬜', code: '#e5e7eb' },
    ];
    return colors.map((target, i) => {
      let options = this.shuffle([...colors]).slice(0, 4);
      if (!options.find(o => o.code === target.code)) {
        options[0] = target;
        options = this.shuffle(options);
      }
      return { id: i, type: 'color' as TaskType, emoji: target.emoji, question: '', data: { target, options } };
    });
  }

  /** Módulo 1 — Complete a sequência de cores */
  private generatePatternTasks(): GameTask[] {
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#f97316'];
    return Array.from({ length: 10 }, (_, i) => {
      const c1 = colors[i % colors.length];
      const c2 = colors[(i + 2) % colors.length];
      const pattern = [c1, c2, c1, c2, c1, null];
      const target = c2;
      const distractors = colors.filter(c => c !== c1 && c !== c2).slice(0, 2);
      const options = this.shuffle([target, c1, ...distractors]);
      return { id: i, type: 'pattern' as TaskType, question: '', data: { pattern, target, options } };
    });
  }

  /** Módulo 2 — Arraste para completar a simetria */
  private generateSymmetryTasks(): GameTask[] {
    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];
    return Array.from({ length: 10 }, (_, i) => {
      const grid: (string | null)[] = Array(9).fill(null);
      const color1 = colors[i % colors.length];
      const color2 = colors[(i + 1) % colors.length];
      grid[0] = color1; grid[3] = color2; grid[6] = color1;
      grid[2] = color1; grid[8] = color1;
      // grid[5] = missing (should be color2)
      return {
        id: i, type: 'symmetry' as TaskType, question: '',
        data: { grid, targetIndex: 5, dragColor: color2 }
      };
    });
  }

  /** Módulo 3 — Qual cor completa a grade? (visual 3x3) */
  private generateGridTasks(): GameTask[] {
    const colorSets: [string, string, string][] = [
      ['#ef4444', '#3b82f6', '#22c55e'],
      ['#eab308', '#a855f7', '#f97316'],
      ['#ec4899', '#3b82f6', '#ef4444'],
      ['#22c55e', '#eab308', '#a855f7'],
      ['#f97316', '#ef4444', '#22c55e'],
      ['#3b82f6', '#ec4899', '#eab308'],
      ['#ef4444', '#22c55e', '#a855f7'],
      ['#eab308', '#3b82f6', '#f97316'],
      ['#ec4899', '#ef4444', '#3b82f6'],
      ['#22c55e', '#f97316', '#eab308'],
    ];
    const missingPositions = [2, 4, 7, 0, 5, 6, 1, 3, 8, 4];
    return colorSets.map(([c1, c2, c3], i) => {
      const fullGrid: string[] = [c1, c1, c1, c2, c2, c2, c3, c3, c3];
      const missingIdx = missingPositions[i];
      const target = fullGrid[missingIdx];
      const visibleGrid: (string | null)[] = [...fullGrid] as (string | null)[];
      visibleGrid[missingIdx] = null;
      const distractors = [c1, c2, c3].filter(c => c !== target);
      const extra = ['#f97316', '#ec4899'].find(c => c !== c1 && c !== c2 && c !== c3) || '#9ca3af';
      const options = this.shuffle([target, ...distractors, extra]).slice(0, 4);
      return {
        id: i, type: 'grid' as TaskType, question: '',
        data: { grid: visibleGrid, targetIdx: missingIdx, target, options }
      };
    });
  }

  /** Módulo 4 — Arraste os blocos para a zona de cor correta (visual puro) */
  private generatePainterTasks(): GameTask[] {
    const colorSets = [
      ['#ef4444', '#3b82f6', '#22c55e'],
      ['#eab308', '#a855f7', '#f97316'],
      ['#ec4899', '#3b82f6', '#ef4444'],
      ['#22c55e', '#eab308', '#a855f7'],
      ['#f97316', '#ef4444', '#22c55e'],
      ['#3b82f6', '#ec4899', '#eab308'],
      ['#ef4444', '#22c55e', '#a855f7'],
      ['#eab308', '#3b82f6', '#f97316'],
      ['#ec4899', '#ef4444', '#3b82f6'],
      ['#22c55e', '#f97316', '#eab308'],
    ];
    return colorSets.map((colors, i) => ({
      id: i, type: 'painter' as TaskType, question: '',
      data: {
        zones: this.shuffle(colors.map(c => ({ id: c, color: c }))),
        draggables: this.shuffle(colors.map(c => ({ id: c, color: c }))),
      }
    }));
  }

  /** Módulo 5 — Pintar os 15 pixel arts */
  private generateDrawingTasks(): GameTask[] {
    return DRAWING_TEMPLATES.map((template, i) => ({
      id: i, type: 'drawing' as TaskType, emoji: template.emoji, question: '',
      data: { template }
    }));
  }
}
