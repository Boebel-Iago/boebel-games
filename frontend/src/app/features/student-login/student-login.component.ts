import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../../core/services/ticket.service';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-login.component.html',
  styleUrl: './student-login.component.scss'
})
export class StudentLoginComponent {
  ticketCode: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  private ticketService = inject(TicketService);
  private router = inject(Router);

  onEnterGame() {
    // Validação básica do tamanho
    if (!this.ticketCode || this.ticketCode.trim().length < 6) {
      this.errorMessage = 'O código precisa ter 6 letras ou números.';
      return;
    }



    this.isLoading = true;
    this.errorMessage = '';

    // Envia o código maiúsculo para o backend
    this.ticketService.validateTicket(this.ticketCode.trim().toUpperCase()).subscribe({
      next: (response) => {
        this.isLoading = false;
        sessionStorage.setItem('activeGameRoute', response.gameRoute);
        // Redireciona o aluno direto para a rota do jogo! (Ex: /games/pixel-art)
        this.router.navigate([`/games/${response.gameRoute}`]);
      },
      error: (err) => {
        this.isLoading = false;
        // Pega a mensagem de erro que mandamos do Spring Boot (Ex: "Este ingresso já expirou")
        this.errorMessage = err.error?.error || 'Erro ao entrar. Tente novamente.';
      }
    });
  }
}