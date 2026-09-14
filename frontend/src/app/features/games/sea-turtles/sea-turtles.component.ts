import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseRepository } from './content/phase-repository.service';
import { PhaseConfig, ClassifyPhaseConfig, PatternPhaseConfig, NarrativeLine } from './content/phase.model';
import { TOTAL_PHASES_IMPLEMENTED } from './content/tiers';
import { ClassifyActivityComponent } from './activities/classify/classify-activity.component';
import { PatternActivityComponent } from './activities/pattern/pattern-activity.component';
import { ProgressReporter } from '../emergency-escape/progress/progress-reporter.service';

@Component({
  selector: 'app-sea-turtles',
  standalone: true,
  imports: [CommonModule, ClassifyActivityComponent, PatternActivityComponent],
  templateUrl: './sea-turtles.component.html'
})
export class SeaTurtlesComponent implements OnInit {
  currentPhase: PhaseConfig | null = null;
  screen: 'briefing' | 'playing' = 'briefing';
  briefingIndex = 0;

  showFeedbackModal = false;
  isSuccess = false;
  feedbackText = '';
  gameFinished = false;

  constructor(
    private phases: PhaseRepository,
    private progress: ProgressReporter
  ) {}

  ngOnInit(): void {
    const savedStage = sessionStorage.getItem('currentStage');
    let startPhase = 1;

    if (savedStage && savedStage !== 'undefined' && savedStage !== 'null') {
      const parsed = parseInt(savedStage, 10);
      if (!isNaN(parsed) && parsed > 0) {
        startPhase = parsed;
        if (startPhase > TOTAL_PHASES_IMPLEMENTED) {
          this.gameFinished = true;
          return;
        }
      }
    }

    this.loadPhase(startPhase);
  }

  loadPhase(fase: number): void {
    this.phases.getPhase(fase).subscribe(phase => {
      this.currentPhase = phase;
      this.screen = 'briefing';
      this.briefingIndex = 0;
    });
  }

  get currentBriefingLine(): NarrativeLine | null {
    return this.currentPhase?.briefing[this.briefingIndex] ?? null;
  }

  get isLastBriefingLine(): boolean {
    return !!this.currentPhase && this.briefingIndex === this.currentPhase.briefing.length - 1;
  }

  nextBriefingLine(): void {
    if (!this.currentPhase) return;
    if (this.isLastBriefingLine) {
      this.screen = 'playing';
    } else {
      this.briefingIndex++;
    }
  }

  skipBriefing(): void {
    this.screen = 'playing';
  }

  /** Getters de tipo, um por mecânica — só o usado pelo activityType atual é lido no template. */
  get classifyPhase(): ClassifyPhaseConfig {
    return this.currentPhase as ClassifyPhaseConfig;
  }

  get patternPhase(): PatternPhaseConfig {
    return this.currentPhase as PatternPhaseConfig;
  }

  onActivityCompleted(success: boolean): void {
    if (!this.currentPhase) return;

    if (!success) {
      // Só contabiliza o erro, NÃO mostra modal (a atividade já deu feedback visual)
      this.progress.report({
        levelId: this.currentPhase.id,
        fase: this.currentPhase.fase,
        result: 'failure',
        attempts: 0,
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Sucesso na fase: mostra modal e reporta progresso
    this.isSuccess = true;
    this.feedbackText = `Fase ${this.currentPhase.fase} concluída: ${this.currentPhase.title}!`;
    this.showFeedbackModal = true;

    const isLast = this.currentPhase.fase >= TOTAL_PHASES_IMPLEMENTED;
    this.progress.report({
      levelId: this.currentPhase.id,
      fase: this.currentPhase.fase,
      result: 'success',
      attempts: 0,
      timestamp: new Date().toISOString(),
      isLastLevel: isLast
    });
  }

  nextStep(): void {
    this.showFeedbackModal = false;
    if (!this.isSuccess || !this.currentPhase) return;

    if (this.currentPhase.fase < TOTAL_PHASES_IMPLEMENTED) {
      this.loadPhase(this.currentPhase.fase + 1);
    } else {
      this.gameFinished = true;
    }
  }
}