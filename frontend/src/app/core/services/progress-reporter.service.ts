import { Injectable } from '@angular/core';
import { GameService } from '../../core/services/game.service'; 

/**
 * Dados de progresso enviados pelo jogo para a camada de abstração de telemetria.
 */
export interface ProgressData {
  levelId: string;
  fase: number;
  result: 'success' | 'failure';
  attempts: number;
  timestamp: string;
  isLastLevel: boolean; // NOVO: O jogo que avisa se ele acabou!
}

@Injectable({ providedIn: 'root' })
export class ProgressReporter {
  
  private mistakesInCurrentLevel: number = 0;

  constructor(private gameService: GameService) {}

  /**
   * Processa eventos de telemetria emitidos por um jogo.
   * Rastreia os erros do aluno localmente e, ao obter sucesso em um nível,
   * despacha os dados consolidados via GameService para o backend.
   * A flag isLastLevel determina se o jogo foi concluído, sem incrementar o nível.
   * O currentStage é atualizado no sessionStorage (onde visualmente soma +1).
   * 
   * @param {ProgressData} data O payload de telemetria emitido pelo jogo.
   */
  report(data: ProgressData): void {
    const sessionId = sessionStorage.getItem('sessionId');
    
    // Se não tem sessão (dev local), só loga e não quebra a aplicação
    if (!sessionId) {
      console.warn('Modo Teste: Progresso não será salvo no BD.', data);
      return;
    }

    if (data.result === 'failure') {
      this.mistakesInCurrentLevel++;
    } 
    else if (data.result === 'success') {
      // Usa a flag genérica que o jogo enviou para saber se é o fim
      const nextStage = data.isLastLevel ? data.fase : data.fase + 1;

      this.gameService.updateGameProgress(sessionId, nextStage, this.mistakesInCurrentLevel, data.isLastLevel)
        .subscribe({
          next: () => {
            this.mistakesInCurrentLevel = 0;
            sessionStorage.setItem('currentStage', nextStage.toString());
          },
          error: (err) => {
            console.error('Falha ao salvar telemetria no servidor', err);
            this.mistakesInCurrentLevel = 0;
            sessionStorage.setItem('currentStage', nextStage.toString());
          }
        });
    }
  }
}