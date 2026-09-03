import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password})
      .pipe(
        tap(response => {
          localStorage.setItem('jwt_token', response.token);
        })
      )
  }

}
