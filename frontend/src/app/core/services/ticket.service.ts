import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:8080/api';

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

  getActiveTicket(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tickets/active`, { headers: this.getHeaders() });
  }

  deleteTicket(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tickets/${id}`, { headers: this.getHeaders() });
  }
}