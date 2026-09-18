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
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = `${environment.apiBaseUrl}/api/tickets/sessions`; 

  updateGameProgress(sessionId: string, nextStage: number, mistakes: number, isFinished: boolean): Observable<any> {
    const payload: ProgressUpdatePayload = {
      nextStage: nextStage,
      mistakesInThisLevel: mistakes,
      gameFinished: isFinished
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
