import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const ticketGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Se for modo demonstração do professor (tem JWT salvo), libera sem ingresso
  const token = localStorage.getItem('jwt_token');
  
  if (token && state.url.includes('demo=1')) {
    sessionStorage.setItem('isDemoMode', 'true');
    return true;
  }

  // Se o jogo recarregar e perder o demo=1 da URL, mas a sessão ainda estiver marcada como demo
  if (token && sessionStorage.getItem('isDemoMode') === 'true') {
    return true;
  }

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