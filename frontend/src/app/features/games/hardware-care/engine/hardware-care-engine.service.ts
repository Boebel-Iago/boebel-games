import { Injectable } from '@angular/core';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface GameState {
  fase: number;
}

@Injectable({
  providedIn: 'root'
})
/**
 * HardwareCareEngineService
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class HardwareCareEngineService {
  state: GameState = { fase: 0 };

  constructor(private progress: ProgressReporter) {}

  completePhase(isLastLevel: boolean) {
    this.progress.report({
      levelId: `fase-${this.state.fase}`,
      fase: this.state.fase,
      result: 'success',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: isLastLevel
    });
    if (!isLastLevel) {
      this.state.fase++;
    }
  }

  reportMistake() {
    this.progress.report({
      levelId: `fase-${this.state.fase}`,
      fase: this.state.fase,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false
    });
  }
}
