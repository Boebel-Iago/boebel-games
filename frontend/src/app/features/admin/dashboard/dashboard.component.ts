import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TicketService } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {

  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ticketForm = this.fb.group({
    maxUses: [1, [Validators.required, Validators.min(1)]],
    hoursValid: [24, [Validators.required, Validators.min(1)]]
  });

  generatedCode: string | null = null;
  errorMessage: string = '';

  onGenerateTicket() {

    if(this.ticketForm.valid) {
      const payload = {
        maxUses: Number(this.ticketForm.value.maxUses),
        hoursValid: Number(this.ticketForm.value.hoursValid) // ou o nome correspondente no Java
      };
      this.ticketService.generateTicket(payload).subscribe({
        next: (response) => {
          this.generatedCode = response.code || response.codigo || JSON.stringify(response);
          this.errorMessage = '';
        },

        error: (err) => {
          this.errorMessage = 'Sessão expirada ou acesso negado. Faça login novamente.';
          console.error(err);
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }



}
