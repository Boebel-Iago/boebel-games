import { Injectable } from '@angular/core';
import { AlgorithmCellType } from '../content/phase.model';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  r: number;
  c: number;
}

export type StepOutcome =
  | { type: 'moved'; r: number; c: number }
  | { type: 'blocked_wall' }
  | { type: 'blocked_bounds' }
  | { type: 'reached_goal' };

const DIRECTION_DELTA: Record<Direction, Position> = {
  up: { r: -1, c: 0 },
  down: { r: 1, c: 0 },
  left: { r: 0, c: -1 },
  right: { r: 0, c: 1 }
};

/**
 * Motor bem mais simples que o do emergency-escape: só movimento livre,
 * sem loop, sem condicional, sem fogo aleatório. É a primeira introdução
 * ao conceito de algoritmo (EF01CO03), não precisa da complexidade toda.
 */
@Injectable({ providedIn: 'root' })
export class AlgorithmEngine {
  private grid: AlgorithmCellType[][] = [];
  private player: Position = { r: 0, c: 0 };

  loadPhase(grid: AlgorithmCellType[][], start: Position): void {
    this.grid = grid.map(row => [...row]);
    this.player = { ...start };
  }

  getGrid(): AlgorithmCellType[][] {
    return this.grid;
  }

  getPlayerPosition(): Position {
    return { ...this.player };
  }

  isOnGoal(): boolean {
    return this.grid[this.player.r]?.[this.player.c] === 2;
  }

  applyMove(direction: Direction): StepOutcome {
    const delta = DIRECTION_DELTA[direction];
    const r = this.player.r + delta.r;
    const c = this.player.c + delta.c;

    if (r < 0 || r >= this.grid.length || c < 0 || c >= this.grid[0].length) {
      return { type: 'blocked_bounds' };
    }

    const cell = this.grid[r][c];
    if (cell === 1) {
      return { type: 'blocked_wall' };
    }

    this.player = { r, c };
    if (cell === 2) {
      return { type: 'reached_goal' };
    }
    return { type: 'moved', r, c };
  }
}