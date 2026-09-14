import { Injectable } from '@angular/core';
import { GameService } from '../../../../core/services/game.service';
import { ProgressReporter, ProgressEvent } from './progress-reporter.service';

@Injectable()
export class ApiProgressReporterService extends ProgressReporter {

  private mistakesInCurrentLevel = 0;

  constructor(private gameService: GameService) {
    super();
  }

  report(event: ProgressEvent): void {
    const sessionId = sessionStorage.getItem('sessionId');

    if (!sessionId) {
      console.warn('Modo Dev: Progresso não será salvo no BD.', event);
      return;
    }

    if (event.result === 'failure') {
      this.mistakesInCurrentLevel++;
    } else if (event.result === 'success') {
      const isLast = event.isLastLevel ?? false;
      const nextStage = isLast ? event.fase : event.fase + 1;

      this.gameService.updateGameProgress(sessionId, nextStage, this.mistakesInCurrentLevel, isLast)
        .subscribe({
          next: () => {
            this.mistakesInCurrentLevel = 0;
            sessionStorage.setItem('currentStage', nextStage.toString());
          },
          error: (err) => {
            console.error('Falha ao salvar progresso no servidor', err);
            this.mistakesInCurrentLevel = 0;
            sessionStorage.setItem('currentStage', nextStage.toString());
          }
        });
    }
  }
}
