import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/api/auth`;

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password})
      .pipe(
        tap(response => {
          localStorage.setItem('jwt_token', response.token);
        })
      )
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
  
  logout(): void {
    localStorage.removeItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

}
