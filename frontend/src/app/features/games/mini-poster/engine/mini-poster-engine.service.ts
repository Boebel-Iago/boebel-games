import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface MiniPosterState {
  fase: number;
}

@Injectable({
  providedIn: 'root'
})
export class MiniPosterEngineService {
  private state: MiniPosterState = { fase: 0 };
  state$ = new BehaviorSubject<MiniPosterState>(this.state);

  constructor(private progress: ProgressReporter) {}

  getState() {
    return this.state;
  }

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
      this.updateState();
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

  private updateState() {
    this.state$.next({ ...this.state });
  }
}
