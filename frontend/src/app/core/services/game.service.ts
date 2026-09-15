import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Interface que define o pacote de dados que vai pro Java (com nomes iguais ao seu Record Java)
export interface ProgressUpdatePayload {
  nextStage: number;
  mistakesInThisLevel: number;
  gameFinished: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private http = inject(HttpClient);
  
  // URL mapeada exatamente igual ao @RequestMapping + @PutMapping do Spring Boot
  private apiUrl = `${environment.apiBaseUrl}/api/tickets/sessions`; 

  /**
   * Envia o progresso e a quantidade de falhas da fase atual para o Spring Boot.
   * sessionId: O ID salvo no sessionStorage quando o aluno fez login.
   * nextStage: A próxima fase que o aluno vai jogar.
   * mistakes: Quantas vezes a tela de Game Over apareceu nesta fase.
   * isFinished: Se o aluno acabou de passar da última fase.
   */
  updateGameProgress(sessionId: string, nextStage: number, mistakes: number, isFinished: boolean): Observable<any> {
    const payload: ProgressUpdatePayload = {
      nextStage: nextStage,
      mistakesInThisLevel: mistakes,
      gameFinished: isFinished
    };
    
    // Dispara o PUT para: /api/tickets/sessions/{id}/progress
    return this.http.put(`${this.apiUrl}/${sessionId}/progress`, payload);
  }
}