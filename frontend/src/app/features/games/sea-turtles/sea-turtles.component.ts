import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseRepository } from './content/phase-repository.service';
import { PhaseConfig, ClassifyPhaseConfig, PatternPhaseConfig, SequenceOrderPhaseConfig, AlgorithmPhaseConfig, IconMessagePhaseConfig, SafetyScenarioPhaseConfig, NarrativeLine } from './content/phase.model';
import { TOTAL_PHASES_IMPLEMENTED } from './content/tiers';
import { ClassifyActivityComponent } from './activities/classify/classify-activity.component';
import { PatternActivityComponent } from './activities/pattern/pattern-activity.component';
import { SequenceOrderActivityComponent } from './activities/sequence-order/sequence-order-activity.component';
import { AlgorithmActivityComponent } from './activities/algorithm/algorithm-activity.component';
import { IconMessageActivityComponent } from './activities/icon-message/icon-message-activity.component';
import { SafetyScenarioActivityComponent } from './activities/safety-scenario/safety-scenario-activity.component';

@Component({
  selector: 'app-sea-turtles',
  standalone: true,
  imports: [
    CommonModule, ClassifyActivityComponent, PatternActivityComponent, SequenceOrderActivityComponent,
    AlgorithmActivityComponent, IconMessageActivityComponent, SafetyScenarioActivityComponent
  ],
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

  constructor(private phases: PhaseRepository) {}

  ngOnInit(): void {
    this.loadPhase(1);
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

  get sequenceOrderPhase(): SequenceOrderPhaseConfig {
    return this.currentPhase as SequenceOrderPhaseConfig;
  }

  get algorithmPhase(): AlgorithmPhaseConfig {
    return this.currentPhase as AlgorithmPhaseConfig;
  }

  get iconMessagePhase(): IconMessagePhaseConfig {
    return this.currentPhase as IconMessagePhaseConfig;
  }

  get safetyScenarioPhase(): SafetyScenarioPhaseConfig {
    return this.currentPhase as SafetyScenarioPhaseConfig;
  }

  onActivityCompleted(success: boolean): void {
    this.isSuccess = success;
    this.feedbackText = success
      ? `Fase ${this.currentPhase?.fase} concluída: ${this.currentPhase?.title}!`
      : 'Não foi dessa vez. Vamos tentar de novo?';
    this.showFeedbackModal = true;
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

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}