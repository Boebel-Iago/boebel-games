import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:8080/api/tickets';

  generateTicket(data: { maxUses: number; hoursValid: number}): Observable<any> {
    
    const token = this.authService.getToken();
    
    // Merge the Bearer Token in header for SecurityFilter in Spring
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', `application/json`);

    return this.http.post<any>(this.apiUrl, data, { headers });
  }
}