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
import { Router } from '@angular/router';

import { GameEngine } from './engine/game-engine';
import { BlocklyAdapterService } from './blockly/blockly-adapter.service';
import { BLOCK_LABELS } from './blockly/custom-blocks';
import { LevelRepository } from './content/level-repository.service';
import { LevelConfig, BlockType, CellType, NarrativeLine } from './content/level.model';
import { TOTAL_LEVELS } from './content/tiers'; 
import { ProgressReporter } from './progress/progress-reporter.service';

interface InventoryItem {
  type: BlockType;
  label: string;
  max: number;
  used: number;
}

const LEVEL_COMPLETE_MESSAGE = (level: LevelConfig, isLast: boolean): string =>
  isLast
    ? 'Você venceu o desafio final! Mestre dos Algoritmos!'
    : `Fase ${level.fase} concluída: ${level.title}!`;

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

  /** 'briefing' = tela narrada antes da fase; 'playing' = jogo liberado. */
  screen: 'briefing' | 'playing' = 'briefing';
  briefingIndex = 0;

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
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    const sessionId = sessionStorage.getItem('sessionId');
    // CORREÇÃO: Não usamos redirecionamento aqui para não quebrar a visualização em dev
    if (!sessionId) {
      console.warn("Modo Dev: Jogando sem sessão no banco de dados.");
    }
  }

  ngAfterViewInit(): void {
    // CORREÇÃO: O Timeout dá tempo ao Angular para renderizar a div do Blockly
    setTimeout(() => {
      const savedStage = sessionStorage.getItem('currentStage');
      let startStage = 1;

      // CORREÇÃO: Validação rígida para evitar o erro NaN (Not a Number)
      if (savedStage && savedStage !== 'undefined' && savedStage !== 'null') {
        const parsed = parseInt(savedStage, 10);
        if (!isNaN(parsed) && parsed > 0) {
          startStage = parsed;
        }
      }
      
      this.loadStage(startStage);
    }, 50);
  }

  ngOnDestroy(): void {
    this.stopInterval();
    if (this.workspace) {
      this.blockly.dispose(this.workspace);
    }
  }

  loadStage(fase: number): void {
    this.levels.getLevel(fase).subscribe({
      next: (level) => {
        if (!level) {
          console.error(`Fase ${fase} não encontrada! Retornando para Fase 1.`);
          if (fase !== 1) this.loadStage(1);
          return;
        }
        
        this.currentLevel = level;
        this.attempts = 0;
        this.screen = 'briefing';
        this.briefingIndex = 0;

        this.engine.loadLevel(level);
        this.currentGrid = this.engine.getGrid();
        this.playerPos = this.engine.getPlayerPosition();

        if (this.workspace) {
          this.blockly.dispose(this.workspace);
        }
        
        this.workspace = this.blockly.inject(this.blocklyDiv.nativeElement, level);
        this.workspace.addChangeListener(() => this.updateInventory());
        this.updateInventory();
      },
      error: (err) => {
        console.error("Erro crítico ao carregar fase:", err);
      }
    });
  }

  get currentBriefingLine(): NarrativeLine | null {
    return this.currentLevel?.briefing[this.briefingIndex] ?? null;
  }

  get isLastBriefingLine(): boolean {
    return !!this.currentLevel && this.briefingIndex === this.currentLevel.briefing.length - 1;
  }

  nextBriefingLine(): void {
    if (!this.currentLevel) return;
    if (this.isLastBriefingLine) {
      this.screen = 'playing';
    } else {
      this.briefingIndex++;
    }
  }

  skipBriefing(): void {
    this.screen = 'playing';
  }

  executeAlgorithm(): void {
    if (!this.currentLevel || !this.workspace || this.isRunning || this.screen === 'briefing') return;

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
      if (this.currentLevel && this.currentLevel.fase < TOTAL_LEVELS) {
        this.loadStage(this.currentLevel.fase + 1);
      } else {
        this.gameFinished = true;
      }
      return;
    }

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
        this.gameOver('🔥 EMERGÊNCIA! Você pisou no fogo! Use o bloco "SE FOGO".');
        break;
      case 'reached_goal':
        this.stopInterval();
        this.levelComplete();
        break;
      case 'moved':
      case 'extinguished':
        break; 
    }

    this.cdr.detectChanges();
  }

  private gameOver(message: string): void {
    this.isRunning = false;
    this.isSuccess = false;
    this.feedbackText = message;
    this.showFeedbackModal = true;
    this.attempts++;
    
    // Serviço genérico cuida de contar o erro!
    this.reportProgress('failure');
  }

  private levelComplete(): void {
    this.isRunning = false;
    this.isSuccess = true;
    
    const isLast = this.currentLevel!.fase >= TOTAL_LEVELS;
    this.feedbackText = LEVEL_COMPLETE_MESSAGE(this.currentLevel!, isLast);
    this.showFeedbackModal = true;
    
    // Serviço genérico cuida de enviar o POST pro banco
    this.reportProgress('success');
  }

  private reportProgress(result: 'success' | 'failure'): void {
    if (!this.currentLevel) return;
    
    const isLast = this.currentLevel.fase >= TOTAL_LEVELS;

    this.progress.report({
      levelId: this.currentLevel.id,
      fase: this.currentLevel.fase,
      result,
      attempts: this.attempts,
      timestamp: new Date().toISOString(),
      isLastLevel: isLast 
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

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}