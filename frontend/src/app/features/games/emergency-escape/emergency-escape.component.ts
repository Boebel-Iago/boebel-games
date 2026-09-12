import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { WorkspaceSvg } from 'blockly';

import { GameEngine } from './engine/game-engine';
import { BlocklyAdapterService } from './blockly/blockly-adapter.service';
import { BLOCK_LABELS } from './blockly/custom-blocks';
import { LevelRepository } from './content/level-repository.service';
import { LevelConfig, BlockType, CellType } from './content/level.model';
import { ProgressReporter } from './progress/progress-reporter.service';

interface InventoryItem {
  type: BlockType;
  label: string;
  max: number;
  used: number;
}

const LEVEL_COMPLETE_MESSAGES: Record<1 | 2 | 3, string> = {
  1: 'Algoritmo completo! Você chegou até a porta.',
  2: 'Ótimo planejamento de rota — e sem desperdiçar blocos!',
  3: 'Lógica condicional na medida certa para sobreviver ao imprevisto. Mestre dos Algoritmos!'
};

@Component({
  selector: 'app-emergency-escape',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emergency-escape.component.html',
  styleUrl: './emergency-escape.component.scss'
})
export class EmergencyEscapeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('blocklyDiv', { static: false }) blocklyDiv!: ElementRef<HTMLElement>;

  currentLevel: LevelConfig | null = null;
  currentGrid: CellType[][] = [];
  playerPos = { r: 0, c: 0 };
  inventory: InventoryItem[] = [];

  isRunning = false;
  showFeedbackModal = false;
  isSuccess = false;
  feedbackText = '';
  gameFinished = false;

  private workspace: WorkspaceSvg | null = null;
  private runInterval: ReturnType<typeof setInterval> | null = null;
  private attempts = 0;

  constructor(
    private engine: GameEngine,
    private blockly: BlocklyAdapterService,
    private levels: LevelRepository,
    private progress: ProgressReporter,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // A injeção do Blockly precisa do #blocklyDiv já renderizado,
    // então o carregamento real da fase acontece em ngAfterViewInit.
  }

  ngAfterViewInit(): void {
    this.loadStage(1);
  }

  ngOnDestroy(): void {
    this.stopInterval();
    if (this.workspace) {
      this.blockly.dispose(this.workspace);
    }
  }

  loadStage(fase: 1 | 2 | 3): void {
    this.levels.getLevel(fase).subscribe(level => {
      this.currentLevel = level;
      this.attempts = 0;

      this.engine.loadLevel(level);
      this.currentGrid = this.engine.getGrid();
      this.playerPos = this.engine.getPlayerPosition();

      if (this.workspace) {
        this.blockly.dispose(this.workspace);
      }
      this.workspace = this.blockly.inject(this.blocklyDiv.nativeElement, level);
      this.workspace.addChangeListener(() => this.updateInventory());
      this.updateInventory();
    });
  }

  executeAlgorithm(): void {
    if (!this.currentLevel || !this.workspace || this.isRunning) return;

    const { program, error } = this.blockly.extractProgram(this.workspace);
    if (error) {
      alert(error);
      return;
    }

    const validation = this.engine.validateBeforeRun(program);
    if (validation.warning && !confirm(validation.warning)) {
      return;
    }

    this.isRunning = true;
    this.engine.startRun(program);
    this.currentGrid = this.engine.getGrid();
    this.playerPos = this.engine.getPlayerPosition();

    this.runInterval = setInterval(() => this.tick(), 350);
  }

  nextStep(): void {
    this.showFeedbackModal = false;

    if (this.isSuccess) {
      if (this.currentLevel && this.currentLevel.fase < 3) {
        this.loadStage((this.currentLevel.fase + 1) as 1 | 2 | 3);
      } else {
        this.gameFinished = true;
      }
      return;
    }

    // Falhou: deixa tentar de novo a mesma fase.
    if (this.currentLevel) {
      this.engine.loadLevel(this.currentLevel);
      this.currentGrid = this.engine.getGrid();
      this.playerPos = this.engine.getPlayerPosition();
    }
  }

  private tick(): void {
    const outcome = this.engine.next();
    this.playerPos = this.engine.getPlayerPosition();

    if (outcome === null) {
      this.stopInterval();
      if (this.engine.isOnGoal()) {
        this.levelComplete();
      } else {
        this.gameOver('Fim do código. Você parou no meio do caminho!');
      }
      return;
    }

    switch (outcome.type) {
      case 'blocked_wall':
        this.stopInterval();
        this.gameOver('Você trombou nos escombros!');
        break;
      case 'blocked_bounds':
        this.stopInterval();
        this.gameOver('Você bateu na parede!');
        break;
      case 'caught_fire':
        this.stopInterval();
        this.gameOver('🔥 EMERGÊNCIA! Você pisou no fogo! Use o bloco "SE FOGO" antes de entrar na zona de risco.');
        break;
      case 'reached_goal':
        this.stopInterval();
        this.levelComplete();
        break;
      case 'moved':
      case 'extinguished':
        break; // segue rodando; currentGrid já é a mesma referência mutada pelo engine
    }

    this.cdr.detectChanges();
  }

  private gameOver(message: string): void {
    this.isRunning = false;
    this.isSuccess = false;
    this.feedbackText = message;
    this.showFeedbackModal = true;
    this.attempts++;
    this.reportProgress('failure');
  }

  private levelComplete(): void {
    this.isRunning = false;
    this.isSuccess = true;
    this.feedbackText = LEVEL_COMPLETE_MESSAGES[this.currentLevel!.fase];
    this.showFeedbackModal = true;
    this.reportProgress('success');
  }

  private reportProgress(result: 'success' | 'failure'): void {
    if (!this.currentLevel) return;
    this.progress.report({
      levelId: this.currentLevel.id,
      fase: this.currentLevel.fase,
      result,
      attempts: this.attempts,
      timestamp: new Date().toISOString()
    });
  }

  private updateInventory(): void {
    if (!this.workspace || !this.currentLevel?.blockLimits?.length) {
      this.inventory = [];
      return;
    }

    const counts = this.blockly.countBlocksByType(this.workspace);
    this.inventory = this.currentLevel.blockLimits.map(limit => ({
      type: limit.type,
      label: BLOCK_LABELS[limit.type] ?? limit.type,
      max: limit.max,
      used: counts[limit.type] ?? 0
    }));
    this.cdr.detectChanges();
  }

  private stopInterval(): void {
    if (this.runInterval) {
      clearInterval(this.runInterval);
      this.runInterval = null;
    }
    this.isRunning = false;
  }
}