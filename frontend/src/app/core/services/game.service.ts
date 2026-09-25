import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface ProgressUpdatePayload {
  nextStage: number;
  mistakesInThisLevel: number;
  gameFinished: boolean;
  score?: number;
  gameState?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = `${environment.apiBaseUrl}/api/tickets/sessions`; 

  /**
   * Atualiza o progresso da sessão do aluno no servidor, reportando falhas e avanço de fase.
   * Caso o endpoint retorne HTTP 403, significa que o professor pausou ou deletou o ingresso
   * associado a esta sessão. Nesse caso, a sessão local é limpa e o aluno volta à tela inicial.
   * 
   * Endpoint: PUT /api/tickets/sessions/{sessionId}/progress
   * 
   * @param {string} sessionId ID da sessão do aluno.
   * @param {number} nextStage Próximo nível alcançado pelo aluno.
   * @param {number} mistakes Quantidade de erros cometidos durante o último nível.
   * @param {boolean} isFinished Indica se o aluno completou o jogo inteiro.
   * @returns {Observable<any>} Confirmação da atualização de progresso.
   */
  
  fetchSessionStatus(sessionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${sessionId}/status`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          alert('⏸️ Esta sala foi pausada ou encerrada pelo professor!\n\nVocê será redirecionado.');
          sessionStorage.clear();
          this.router.navigate(['/']);
        }
        return throwError(() => error);
      })
    );
  }

  updateGameProgress(sessionId: string, nextStage: number, mistakes: number, isFinished: boolean, score?: number, gameState?: string): Observable<any> {
    const payload: ProgressUpdatePayload = {
      nextStage: nextStage,
      mistakesInThisLevel: mistakes,
      gameFinished: isFinished,
      score: score,
      gameState: gameState
    };
    
    return this.http.put(`${this.apiUrl}/${sessionId}/progress`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          alert('⏸️ Esta sala foi pausada ou encerrada pelo professor!\n\nVocê será redirecionado.');
          sessionStorage.clear();
          this.router.navigate(['/']);
        }
        return throwError(() => error);
      })
    );
  }
}
