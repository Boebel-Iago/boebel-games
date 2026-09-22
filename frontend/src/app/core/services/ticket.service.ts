import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface JoinGamePayload {
  ticketCode: string;
  studentName: string;
}

export interface JoinGameResponse {
  sessionId: string;
  gameRoute: string;
  currentStage: number;
}

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiBaseUrl}/api`;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders()
      .set('Authorization', `Bearer ${this.authService.getToken()}`)
      .set('Content-Type', 'application/json');
  }

  /**
   * Retorna a lista de anos/séries escolares disponíveis.
   * 
   * Endpoint: GET /api/grades/available
   * Utilizado pelos componentes do Painel do Professor para filtros de criação de ingressos.
   * 
   * @returns {Observable<any[]>} Lista com os anos escolares.
   */
  getAvailableGrades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grades/available`, { headers: this.getHeaders() });
  }

  /**
   * Busca os jogos educacionais filtrados por ano escolar.
   * 
   * Endpoint: GET /api/games?grade={grade}
   * Utilizado no formulário de geração de ingressos para selecionar o jogo.
   * 
   * @param {string} grade O ano escolar para filtrar os jogos.
   * @returns {Observable<any[]>} Lista de jogos aplicáveis ao ano informado.
   */
  getGamesByGrade(grade: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/games?grade=${grade}`, { headers: this.getHeaders() });
  }

  /**
   * Gera um novo ingresso (AccessTicket) efêmero para uma sala de aula.
   * 
   * Endpoint: POST /api/tickets
   * Utilizado pelo Professor para criar um código de acesso aos alunos.
   * 
   * @param {any} data Dados do ingresso (jogo, validade, etc).
   * @returns {Observable<any>} Resposta com o ingresso recém-criado.
   */
  generateTicket(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tickets`, data, { headers: this.getHeaders() });
  }

  /**
   * Lista todos os ingressos atualmente ativos gerados pelo professor logado.
   * 
   * Endpoint: GET /api/tickets/active
   * Utilizado no Dashboard do Professor para gerenciar as salas de aula em andamento.
   * 
   * @returns {Observable<any[]>} Lista de ingressos ativos.
   */
  getActiveTickets(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets/active`, { headers: this.getHeaders() });
  }

  /**
   * Remove/invalida um ingresso antes do seu tempo de expiração natural.
   * 
   * Endpoint: DELETE /api/tickets/{id}
   * Utilizado pelo Professor para encerrar uma atividade prematuramente.
   * 
   * @param {string} id ID do ingresso a ser excluído.
   * @returns {Observable<any>} Confirmação da exclusão.
   */
  deleteTicket(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tickets/${id}`, { headers: this.getHeaders() });
  }

  /**
   * Verifica o status de uma sessão de aluno (se o ingresso pai ainda está ativo).
   * 
   * Endpoint: GET /api/tickets/sessions/{sessionId}/status
   * Utilizado pelo TicketGuard para garantir que a sessão do aluno não foi revogada.
   * 
   * @param {string} sessionId O ID da sessão do aluno.
   * @returns {Observable<any>} Status atual da sessão.
   */
  checkSessionStatus(sessionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tickets/sessions/${sessionId}/status`);
  }

  /**
   * Valida o código do ingresso inserido pelo aluno e cria uma sessão anônima.
   * 
   * Endpoint: POST /api/tickets/validate
   * Utilizado na tela inicial (Home/Login do Aluno) para entrar no jogo.
   * 
   * @param {JoinGamePayload} payload O código do ingresso e o nome (opcional) do aluno.
   * @returns {Observable<JoinGameResponse>} Dados da sessão criada, rota do jogo e estágio.
   */
  validateTicket(payload: JoinGamePayload): Observable<JoinGameResponse> {
    return this.http.post<JoinGameResponse>(`${this.apiUrl}/tickets/validate`, payload);
  }

  /**
   * Busca todas as sessões de alunos atreladas a um ingresso (acompanhamento ao vivo).
   * 
   * Endpoint: GET /api/tickets/{ticketCode}/sessions
   * Utilizado pelo Painel do Professor para monitorar o progresso em tempo real da sala.
   * 
   * @param {string} ticketCode O código de acesso de 6 dígitos.
   * @returns {Observable<StudentSession[]>} Lista de sessões de alunos conectadas.
   */
  getSessionsByTicket(ticketCode: string): Observable<StudentSession[]> {
    return this.http.get<StudentSession[]>(`${this.apiUrl}/tickets/${ticketCode}/sessions`, { headers: this.getHeaders() });
  }

  /**
   * Estende o tempo de validade de um ingresso ativo.
   * 
   * Endpoint: PUT /api/tickets/{id}/extend
   * Utilizado pelo Professor caso a aula precise de mais tempo.
   * 
   * @param {string} id O ID do ingresso.
   * @param {number} additionalHours Quantidade de horas a adicionar.
   * @returns {Observable<any>} Confirmação da extensão.
   */
  extendTicket(id: string, additionalHours: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tickets/${id}/extend`, { additionalHours }, { headers: this.getHeaders() });
  }

  /**
   * Alterna o status do ingresso entre pausado e ativo.
   * 
   * Endpoint: PUT /api/tickets/{id}/toggle-status
   * Utilizado pelo Professor para bloquear temporariamente o acesso aos jogos.
   * 
   * @param {string} id O ID do ingresso.
   * @returns {Observable<any>} Confirmação da alteração de status.
   */
  toggleTicketStatus(id: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tickets/${id}/toggle-status`, {}, { headers: this.getHeaders() });
  }
}

export interface StudentSession {
  id: string;
  studentName: string;
  gameRoute: string;
  currentStage: number;
  totalMistakes: number;
  completed: boolean;
  startedAt: string;
}