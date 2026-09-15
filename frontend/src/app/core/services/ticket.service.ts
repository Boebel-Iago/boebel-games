import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface JoinGamePayload {
  ticketCode: string;
  studentName: string;
}

export interface JoinGameResponse {
  sessionId: string;
  gameRoute: string;
  currentStage: number;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiBaseUrl}/api`;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.getToken()}`)
      .set('Content-Type', 'application/json');
  }

  getAvailableGrades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grades/available`, { headers: this.getHeaders() });
  }

  getGamesByGrade(grade: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/games?grade=${grade}`, { headers: this.getHeaders() });
  }

  generateTicket(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tickets`, data, { headers: this.getHeaders() });
  }

  getActiveTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets/active`, { headers: this.getHeaders() });
  }

  deleteTicket(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tickets/${id}`, { headers: this.getHeaders() });
  }

  validateTicket(payload: JoinGamePayload): Observable<JoinGameResponse> {
    return this.http.post<JoinGameResponse>(`${this.apiUrl}/tickets/validate`, payload);
  }

  // MODIFIED: Buscar sessões de um ticket específico
  getSessionsByTicket(ticketCode: string): Observable<StudentSession[]> {
    return this.http.get<StudentSession[]>(`${this.apiUrl}/tickets/${ticketCode}/sessions`, { headers: this.getHeaders() });
  }

  // NOVO: Estender tempo do ingresso
  extendTicket(id: string, additionalHours: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tickets/${id}/extend`, { additionalHours }, { headers: this.getHeaders() });
  }

  // NOVO: Pausar/Reativar ingresso
  toggleTicketStatus(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tickets/${id}/toggle-status`, {}, { headers: this.getHeaders() });
  }
}

export interface StudentSession {
  id: string;
  studentName: string;
  gameRoute: string;
  currentStage: number;
  totalMistakes: number;
  completed: boolean;
  startedAt: string;
}