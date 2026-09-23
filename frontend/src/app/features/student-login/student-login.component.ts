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
  studentNames: string[] = ['']; // Começa com um campo de nome
  ticketCode: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private ticketService: TicketService, 
    private router: Router
  ) {}

  addPlayer() {
    if (this.studentNames.length < 5) {
      this.studentNames.push('');
    }
  }

  removePlayer(index: number) {
    if (this.studentNames.length > 1) {
      this.studentNames.splice(index, 1);
    }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  onEnterGame() {
    const validNames = this.studentNames
      .map(n => n.trim().toLowerCase())
      .filter(n => n.length > 0);

    if (validNames.length === 0 || !this.ticketCode.trim()) {
      this.errorMessage = "Preencha o nome de pelo menos um aluno e o código do jogo!";
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload: JoinGamePayload = {
      studentNames: validNames,
      ticketCode: this.ticketCode.trim().toUpperCase()
    };

    this.ticketService.validateTicket(payload).subscribe({
      next: (response: JoinGameResponse) => {
        this.isLoading = false;
        
        // Salva a ROTA para o Guarda liberar a porta
        sessionStorage.setItem('activeGameRoute', response.gameRoute);
        sessionStorage.removeItem('isDemoMode'); // Garante que aluno joga o jogo inteiro
        
        // Salva o ID da sessão, os nomes combinados e a fase atual
        sessionStorage.setItem('sessionId', response.sessionId);
        sessionStorage.setItem('studentName', validNames.sort().join(', '));
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