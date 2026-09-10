import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const ticketGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Pega a rota que foi liberada pelo backend no momento do login
  const allowedRoute = sessionStorage.getItem('activeGameRoute');
  
  // Verifica se o aluno tem uma rota liberada E se ele está tentando acessar exatamente o jogo dele
  if (allowedRoute && state.url.includes(`/games/${allowedRoute}`)) {
    return true; // Pode entrar!
  }
  
  // Se não tiver ingresso validado ou tentar entrar no jogo de outra turma, manda pro início
  router.navigate(['/']);
  return false; 
};