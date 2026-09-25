import re

# 1. Update TicketService
with open('frontend/src/app/core/services/ticket.service.ts', 'r') as f:
    content = f.read()

new_validate_session = """  checkSessionStatus(sessionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tickets/sessions/${sessionId}/status`);
  }"""
if 'checkSessionStatus' not in content:
    content = content.replace('validateTicket(payload', new_validate_session + '\n\n  validateTicket(payload')

with open('frontend/src/app/core/services/ticket.service.ts', 'w') as f:
    f.write(content)


# 2. Update TicketGuard
guard_content = """import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TicketService } from '../services/ticket.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const ticketGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const ticketService = inject(TicketService);
  
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

  // Pega a rota que foi liberada pelo backend e a sessão
  const allowedRoute = sessionStorage.getItem('activeGameRoute');
  const sessionId = sessionStorage.getItem('sessionId');
  
  if (!allowedRoute || !state.url.includes(`/games/${allowedRoute}`) || !sessionId) {
    router.navigate(['/']);
    return false;
  }

  // NOVA PROTEÇÃO: Pergunta pro servidor se o ticket daquela sessão ainda está vivo (não pausado/expirado)
  return ticketService.checkSessionStatus(sessionId).pipe(
    map(() => true), // Se retornar 200 OK, deixa passar
    catchError(() => {
      // Se retornar 403 Forbidden (Expirado ou Pausado)
      sessionStorage.clear(); // Limpa a memória enganosa
      router.navigate(['/']);
      return of(false); // Bloqueia a porta
    })
  );
};
"""
with open('frontend/src/app/core/guards/ticket.guard.ts', 'w') as f:
    f.write(guard_content)

