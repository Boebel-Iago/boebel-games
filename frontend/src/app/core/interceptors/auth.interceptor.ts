import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      // Se o servidor rejeitar a requisição por token inválido ou expirado (401/403)
      if (error.status === 401 || error.status === 403) {
        authService.logout(); // Limpa o localStorage e remove a sessão "fantasma"
        router.navigate(['/login']); // Joga o usuário de volta para o login
      }
      return throwError(() => error);
    })
  );
};
