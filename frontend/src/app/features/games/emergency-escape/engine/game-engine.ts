import { Injectable } from '@angular/core';
import { CellType, LevelConfig } from '../content/level.model';
import { Direction, InterpreterStep, ProgramNode, containsConditional, runProgram } from './block-interpreter';
import { RandomEventService, Position } from './random-event.service';

export type StepOutcome =
  | { type: 'moved'; r: number; c: number }
  | { type: 'blocked_wall' }
  | { type: 'blocked_bounds' }
  | { type: 'caught_fire' }
  | { type: 'extinguished'; cells: Position[] }
  | { type: 'reached_goal' }
  | { type: 'finished_without_goal' };

const DIRECTION_DELTA: Record<Direction, Position> = {
  up: { r: -1, c: 0 },
  down: { r: 1, c: 0 },
  left: { r: 0, c: -1 },
  right: { r: 0, c: 1 }
};

/**
 * Estado e regras do jogo. Não sabe que Blockly existe — recebe um
 * ProgramNode[] já traduzido pelo blockly-adapter.service.ts.
 * Propositalmente NÃO controla tempo (setInterval): quem chama next() em
 * loop decide o ritmo (o componente, pra poder animar).
 */
@Injectable({ providedIn: 'root' })
export class GameEngine {
  private grid: CellType[][] = [];
  private player: Position = { r: 0, c: 0 };
  private level!: LevelConfig;
  private programGenerator: Generator<InterpreterStep, void, void> | null = null;
  private stepCount = 0;

  constructor(private randomEvents: RandomEventService) {}

  loadLevel(level: LevelConfig): void {
    this.level = level;
    this.grid = level.grid.map(row => [...row]);
    this.player = { ...level.startPosition };
    this.stepCount = 0;
    this.programGenerator = null;
  }

  getGrid(): CellType[][] {
    return this.grid;
  }

  getPlayerPosition(): Position {
    return { ...this.player };
  }

  /**
   * Checagem "soft" antes de rodar — nunca bloqueia, só devolve um aviso.
   * Fase 3: alerta se nenhum bloco 'if_fire' foi usado em lugar nenhum do
   * programa (inclusive dentro de repeats).
   */
  validateBeforeRun(program: ProgramNode[]): { ok: true; warning?: string } {
    if (this.level.requireConditional && !containsConditional(program)) {
      return {
        ok: true,
        warning:
          'Você não usou o bloco "SE FOGO" em nenhum lugar. Nessa fase o cenário pode mudar durante a execução. Quer tentar mesmo assim?'
      };
    }
    return { ok: true };
  }

  /** Reseta o grid/jogador e prepara o generator para consumo via next(). */
  startRun(program: ProgramNode[]): void {
    this.grid = this.level.grid.map(row => [...row]);
    this.player = { ...this.level.startPosition };
    this.stepCount = 0;
    this.programGenerator = runProgram(program);
  }

  /**
   * Avança um passo atômico. Retorna null quando o programa terminou
   * (chegou na porta ou simplesmente acabou os comandos).
   * Chame isso a cada tick do seu setInterval/temporizador de animação.
   */
  next(): StepOutcome | null {
    if (!this.programGenerator) {
      throw new Error('Chame startRun(program) antes de next().');
    }

    // O sorteio acontece ANTES de aplicar o próximo passo, simulando o
    // cenário mudando enquanto o algoritmo já está em execução.
    this.maybeIgniteRandomFire();

    const result = this.programGenerator.next();
    if (result.done) {
      this.programGenerator = null;
      return null;
    }

    this.stepCount++;
    return this.applyInstruction(result.value);
  }

  /** True se a posição atual do jogador é a célula-porta (tipo 2). */
  isOnGoal(): boolean {
    return this.grid[this.player.r]?.[this.player.c] === 2;
  }

  private applyInstruction(instruction: InterpreterStep): StepOutcome {
    if (instruction.type === 'check_fire') {
      const extinguished = this.extinguishAdjacentFire();
      return { type: 'extinguished', cells: extinguished };
    }

    const { r, c } = this.nextPosition(instruction.direction);

    if (r < 0 || r > this.grid.length - 1 || c < 0 || c > this.grid[0].length - 1) {
      return { type: 'blocked_bounds' };
    }

    const targetCell = this.grid[r][c];

    if (targetCell === 1) {
      return { type: 'blocked_wall' };
    }
    if (targetCell === 4) {
      return { type: 'caught_fire' };
    }

    this.player = { r, c };

    if (targetCell === 2) {
      return { type: 'reached_goal' };
    }
    return { type: 'moved', r, c };
  }

  private nextPosition(direction: Direction): Position {
    const delta = DIRECTION_DELTA[direction];
    return { r: this.player.r + delta.r, c: this.player.c + delta.c };
  }

  private extinguishAdjacentFire(): Position[] {
    const dirs: Array<[number, number]> = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const extinguished: Position[] = [];
    for (const [dr, dc] of dirs) {
      const r = this.player.r + dr;
      const c = this.player.c + dc;
      if (this.grid[r]?.[c] === 4) {
        this.grid[r][c] = 0;
        extinguished.push({ r, c });
      }
    }
    return extinguished;
  }

  private maybeIgniteRandomFire(): void {
    const config = this.level.randomFire;
    if (!config?.enabled) return;
    if (this.stepCount < (config.minStepsBeforeFirstEvent ?? 0)) return;

    this.randomEvents.tryIgniteRiskCells(this.grid, config, this.player);
  }
}