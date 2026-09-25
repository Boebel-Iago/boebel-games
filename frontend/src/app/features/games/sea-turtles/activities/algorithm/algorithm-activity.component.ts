import {
    Component,
    AfterViewInit,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    ViewChild,
    ElementRef,
    Input,
    Output,
    EventEmitter
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import type { WorkspaceSvg } from 'blockly';
  import { AlgorithmPhaseConfig, AlgorithmCellType } from '../../content/phase.model';
  import { AlgorithmEngine, Position } from '../../engine/algorithm-engine';
  import { AlgorithmBlocklyAdapterService } from '../../blockly/algorithm-blockly-adapter.service';
  
  @Component({
    selector: 'app-algorithm-activity',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './algorithm-activity.component.html'
  })
  export class AlgorithmActivityComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input({ required: true }) phase!: AlgorithmPhaseConfig;
    @Output() completed = new EventEmitter<boolean>();
  
    @ViewChild('blocklyDiv', { static: false }) blocklyDiv!: ElementRef<HTMLElement>;
  
    grid: AlgorithmCellType[][] = [];
    playerPos: Position = { r: 0, c: 0 };
    isRunning = false;
  
    private workspace: WorkspaceSvg | null = null;
    private runInterval: ReturnType<typeof setInterval> | null = null;
    private viewReady = false;
  
    constructor(
      private engine: AlgorithmEngine,
      private blockly: AlgorithmBlocklyAdapterService
    ) {}
  
    ngAfterViewInit(): void {
      this.viewReady = true;
      this.setupPhase();
    }
  
    ngOnChanges(changes: SimpleChanges): void {
      // Só reage a trocas de fase DEPOIS que a view já existe (senão #blocklyDiv
      // ainda não foi criado — mesma armadilha de ViewChild + timing de antes).
      if (changes['phase'] && this.viewReady) {
        this.setupPhase();
      }
    }
  
    ngOnDestroy(): void {
      this.stopInterval();
      if (this.workspace) {
        this.blockly.dispose(this.workspace);
      }
    }
  
    private setupPhase(): void {
      this.resetGridAndPlayer();
  
      if (this.workspace) {
        this.blockly.dispose(this.workspace);
      }
      this.workspace = this.blockly.inject(this.blocklyDiv.nativeElement, this.phase);
    }
  
    private resetGridAndPlayer(): void {
      this.engine.loadPhase(this.phase.grid, this.phase.startPosition);
      this.grid = this.engine.getGrid();
      this.playerPos = this.engine.getPlayerPosition();
    }
  
    run(): void {
      if (this.isRunning || !this.workspace) return;
  
      const { moves, error } = this.blockly.extractProgram(this.workspace);
      if (error) {
        alert(error);
        return;
      }
  
      this.isRunning = true;
      this.resetGridAndPlayer();
  
      let step = 0;
      this.runInterval = setInterval(() => {
        if (step >= moves.length) {
          this.stopInterval();
          if (!this.engine.isOnGoal()) {
            this.resetGridAndPlayer(); // não chegou na porta: deixa tentar de novo
          }
          return;
        }
  
        const outcome = this.engine.applyMove(moves[step]);
        this.playerPos = this.engine.getPlayerPosition();
  
        if (outcome.type === 'blocked_wall' || outcome.type === 'blocked_bounds') {
          this.stopInterval();
          setTimeout(() => this.resetGridAndPlayer(), 400);
          return;
        }
  
        if (outcome.type === 'reached_goal') {
          this.stopInterval();
          setTimeout(() => this.completed.emit(true), 400);
          return;
        }
  
        step++;
      }, 350);
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