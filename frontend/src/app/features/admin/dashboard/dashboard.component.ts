import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ticketForm = this.fb.group({
    grade: ['', Validators.required],
    gameId: [null, Validators.required],
    maxUses: [1, [Validators.required, Validators.min(1)]],
    expirationHours: [24, [Validators.required, Validators.min(1)]]
  });

  availableGrades: any[] = [];
  availableGames: any[] = [];
  activeTicket: any = null;
  errorMessage: string = '';

  ngOnInit() {
    this.loadActiveTicket();
    this.loadGrades();

    this.ticketForm.get('grade')?.valueChanges.subscribe(grade => {
      if (grade) {
        this.loadGames(grade);
      } else {
        this.availableGames = [];
        this.ticketForm.patchValue({ gameId: null });
      }
    });
  }

  loadActiveTicket() {
    this.ticketService.getActiveTicket().subscribe({
      next: (ticket) => { this.activeTicket = ticket; },
      error: () => { this.activeTicket = null; }
    });
  }

  loadGrades() {
    this.ticketService.getAvailableGrades().subscribe(grades => this.availableGrades = grades);
  }

  loadGames(grade: string) {
    this.ticketService.getGamesByGrade(grade).subscribe(games => this.availableGames = games);
  }

  onGenerateTicket() {
    if (this.ticketForm.valid) {
      const payload = {
        maxUses: Number(this.ticketForm.value.maxUses),
        expirationHours: Number(this.ticketForm.value.expirationHours),
        grade: String(this.ticketForm.value.grade),
        gameId: Number(this.ticketForm.value.gameId)
      };

      this.ticketService.generateTicket(payload).subscribe({
        next: (response) => {
          this.activeTicket = response;
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Erro ao gerar o ingresso.';
        }
      });
    }
  }

  onDeleteTicket(id: string) {
    this.ticketService.deleteTicket(id).subscribe({
      next: () => {
        this.activeTicket = null;
        this.ticketForm.reset({ maxUses: 1, expirationHours: 24, grade: '', gameId: null });
      },
      error: () => { this.errorMessage = 'Erro ao excluir o ingresso.'; }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}