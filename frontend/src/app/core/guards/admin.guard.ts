import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Guarda de rotas responsável por proteger as URLs do painel administrativo do professor.
 * Executa uma verificação simples da presença do JWT (`jwt_token`) no sessionStorage.
 * Não valida a assinatura do token - isso é feito pela API através do authInterceptor.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('jwt_token');
  
  if (token) {
    return true; // Tem token salvo, pode entrar no painel
  }
  
  // Não tem login, manda pra tela de login
  router.navigate(['/login']);
  return false; 
};
