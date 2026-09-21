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
      // Se o erro de permissão vier das rotas exclusivas do aluno, não faça nada globalmente.
      // Deixe o Componente do Aluno ou o Guarda do Aluno tratar o erro e jogar para a tela inicial.
      const isStudentEndpoint = req.url.includes('/sessions/') || req.url.includes('/validate');

      if ((error.status === 401 || error.status === 403) && !isStudentEndpoint) {
        authService.logout(); 
        router.navigate(['/login']); // Joga o professor de volta para o login de admin
      }
      return throwError(() => error);
    })
  );
};
