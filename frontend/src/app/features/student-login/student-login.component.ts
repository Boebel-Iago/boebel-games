import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService, JoinGamePayload, JoinGameResponse } from '../../core/services/ticket.service';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-login.component.html',
  styleUrl: './student-login.component.scss'
})
export class StudentLoginComponent {
  studentName: string = '';
  ticketCode: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private ticketService: TicketService, 
    private router: Router
  ) {}

  onEnterGame() {
    if (!this.studentName.trim() || !this.ticketCode.trim()) {
      this.errorMessage = "Preencha seu nome e o código do jogo!";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload: JoinGamePayload = {
      studentName: this.studentName.trim().toLowerCase(),
      ticketCode: this.ticketCode.trim().toUpperCase()
    };

    this.ticketService.validateTicket(payload).subscribe({
      next: (response: JoinGameResponse) => {
        this.isLoading = false;
        
        // Salva a ROTA para o Guarda liberar a porta
        sessionStorage.setItem('activeGameRoute', response.gameRoute);
        sessionStorage.removeItem('isDemoMode'); // Garante que aluno joga o jogo inteiro
        
        // Salva o ID da sessão, nome normalizado e a fase atual
        sessionStorage.setItem('sessionId', response.sessionId);
        sessionStorage.setItem('studentName', this.studentName.trim().toLowerCase());
        sessionStorage.setItem('currentStage', response.currentStage.toString());
        
        this.router.navigate([`/games/${response.gameRoute}`]);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = "Código incorreto ou indisponível. Chame o professor!";
        }
      }
    });
  }
}