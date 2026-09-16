import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('jwt_token');
  
  if (token) {
    return true; // Tem token salvo, pode entrar no painel
  }
  
  // Não tem login, manda pra tela de login
  router.navigate(['/login']);
  return false; 
};
