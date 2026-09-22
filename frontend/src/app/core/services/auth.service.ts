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

  /**
   * Autentica o professor no sistema, salvando o JWT no armazenamento local.
   * 
   * Endpoint: POST /api/auth/login
   * Utilizado pelo componente de login da área administrativa.
   * 
   * @param {string} email O email do professor.
   * @param {string} password A senha do professor.
   * @returns {Observable<{ token: string }>} O token JWT retornado pelo servidor.
   */
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password})
      .pipe(
        tap(response => {
          localStorage.setItem('jwt_token', response.token);
        })
      )
  }

  /**
   * Retorna o token JWT atual armazenado.
   * 
   * @returns {string | null} O token JWT ou null se não houver token.
   */
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }
  
  /**
   * Encerra a sessão do professor, removendo o JWT do armazenamento local.
   */
  logout(): void {
    localStorage.removeItem('jwt_token');
  }

  /**
   * Verifica se o professor está autenticado.
   * 
   * @returns {boolean} True se o token JWT existir, false caso contrário.
   */
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

}
