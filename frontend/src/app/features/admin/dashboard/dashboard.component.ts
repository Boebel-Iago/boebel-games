import { Component, OnInit, OnDestroy, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TicketService, StudentSession } from '../../../core/services/ticket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Client } from '@stomp/stompjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SafeUrlPipe } from '../../../core/pipes/safe-url.pipe';
import { environment } from '../../../../environments/environment';
import { UnpluggedActivityComponent } from './unplugged-activity/unplugged-activity.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SafeUrlPipe, UnpluggedActivityComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  ticketForm = this.fb.group({
    grade: ['', Validators.required],
    gameId: [null, Validators.required],
    maxUses: [1, [Validators.required, Validators.min(1)]],
    expirationHours: [24, [Validators.required, Validators.min(1)]]
  });

  availableGrades: any[] = [];
  availableGames: any[] = [];
  
  // Lista de ingressos (master) e ingresso selecionado (detail)
  tickets: any[] = [];
  selectedTicket: any = null;
  
  errorMessage: string = '';

  // Monitoring state
  sessions: StudentSession[] = [];
  private stompClient: Client | null = null;

  // Tabs: 'monitor' | 'demo' | 'unplugged'
  activeTab: 'monitor' | 'demo' | 'unplugged' = 'monitor';

  // Demo mode
  isDemoFullscreen = false;

  get playingCount(): number {
    return this.sessions.filter(s => !s.completed).length;
  }

  get completedCount(): number {
    return this.sessions.filter(s => s.completed).length;
  }

  get totalMistakesCount(): number {
    return this.sessions.reduce((sum, s) => sum + s.totalMistakes, 0);
  }

  get demoUrl(): string {
    if (!this.selectedTicket) return '';
    return `/games/${this.selectedTicket.gameRoute}?demo=1`;
  }

  ngOnInit() {
    this.loadTickets();
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

  ngOnDestroy() {
    this.disconnectWebSocket();
  }

  loadTickets() {
    this.ticketService.getActiveTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets || [];
        
        // Se houver um ingresso selecionado e a lista atualizar, atualizar os dados dele
        if (this.selectedTicket) {
          const updated = this.tickets.find(t => t.id === this.selectedTicket.id);
          if (updated) {
            this.selectedTicket = updated;
          } else {
            // Se o ingresso foi deletado/expirou no backend, voltar para a lista
            this.closeTicketMonitor();
          }
        }
      },
      error: () => { this.tickets = []; }
    });
  }

  // ==== Navegação Master-Detail ====
  openTicketMonitor(ticket: any) {
    this.selectedTicket = ticket;
    this.activeTab = 'monitor';
    this.loadSessions();
    this.connectWebSocket(ticket.code);
  }

  closeTicketMonitor() {
    this.selectedTicket = null;
    this.sessions = [];
    this.disconnectWebSocket();
    this.loadTickets(); // Recarrega a lista para pegar possíveis status atualizados
  }

  // ==== Restante da Lógica ====
  loadSessions() {
    if (!this.selectedTicket) return;
    this.ticketService.getSessionsByTicket(this.selectedTicket.code).subscribe({
      next: (sessions) => { this.sessions = sessions; },
      error: () => { this.sessions = []; }
    });
  }

  connectWebSocket(ticketCode: string) {
    this.disconnectWebSocket();

    const wsBase = environment.apiBaseUrl
      ? environment.apiBaseUrl.replace(/^http/, 'ws')
      : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;

    this.stompClient = new Client({
      brokerURL: `${wsBase}/ws`,
      reconnectDelay: 5000,
      onConnect: () => {
        this.stompClient!.subscribe(`/topic/sessions/${ticketCode}`, (message) => {
          this.ngZone.run(() => {
            this.sessions = JSON.parse(message.body);
          });
        });
      },
      onStompError: (frame) => {
        console.error('WebSocket STOMP error:', frame);
      }
    });
    this.stompClient.activate();
  }

  disconnectWebSocket() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
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
          this.errorMessage = '';
          this.ticketForm.reset({ maxUses: 1, expirationHours: 24, grade: '', gameId: null });
          this.loadTickets(); // Atualiza a lista
        },
        error: (err) => {
          this.errorMessage = err.error?.error || err.error?.message || 'Erro ao gerar o ingresso.';
        }
      });
    }
  }

  onExtendTicket(id: string, hours: number) {
    this.ticketService.extendTicket(id, hours).subscribe({
      next: (updated) => {
        this.selectedTicket = updated;
        this.errorMessage = '';
        this.loadTickets(); // Atualiza no background
      },
      error: () => { this.errorMessage = 'Erro ao estender o ingresso.'; }
    });
  }

  onToggleTicketStatus(id: string) {
    this.ticketService.toggleTicketStatus(id).subscribe({
      next: (updated) => {
        this.selectedTicket = updated;
        this.errorMessage = '';
        this.loadTickets(); // Atualiza no background
      },
      error: () => { this.errorMessage = 'Erro ao alterar status do ingresso.'; }
    });
  }

  getTimeRemaining(ticket: any): string {
    if (!ticket?.expirationDate) return '';
    const exp = new Date(ticket.expirationDate);
    const now = new Date();
    const diff = exp.getTime() - now.getTime();
    if (diff <= 0) return 'Expirado';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${minutes}min restantes`;
    return `${minutes}min restantes`;
  }

  onDeleteTicket(id: string) {
    if (this.sessions.length > 0 && !confirm('Atenção! Ao excluir o ingresso, todas as sessões dos alunos serão apagadas do banco de dados. Já exportou o relatório em PDF?')) {
      return;
    }

    this.ticketService.deleteTicket(id).subscribe({
      next: () => {
        this.closeTicketMonitor();
      },
      error: () => { this.errorMessage = 'Erro ao excluir o ingresso.'; }
    });
  }

  exportPdf() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório - Boebel Games', 14, 20);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Jogo: ${this.selectedTicket.gameTitle}`, 14, 32);
    doc.text(`Turma: ${this.formatGrade(this.selectedTicket.grade)}`, 14, 39);
    doc.text(`Código do Ingresso: ${this.selectedTicket.code}`, 14, 46);
    doc.text(`Data do Relatório: ${new Date().toLocaleDateString('pt-BR')}`, 14, 53);

    autoTable(doc, {
      startY: 63,
      head: [['Nome do Aluno', 'Fase Atual', 'Total de Erros', 'Status', 'Hora de Início']],
      body: this.sessions.map(s => [
        s.studentName,
        s.currentStage.toString(),
        s.totalMistakes.toString(),
        s.completed ? 'Finalizado' : 'Jogando',
        new Date(s.startedAt).toLocaleString('pt-BR')
      ]),
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [15, 46, 33] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo da Sessão', 14, finalY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Total de Alunos: ${this.sessions.length}`, 14, finalY + 10);
    doc.text(`Alunos Jogando: ${this.playingCount}`, 14, finalY + 17);
    doc.text(`Alunos Finalizados: ${this.completedCount}`, 14, finalY + 24);
    doc.text(`Total de Erros da Turma: ${this.totalMistakesCount}`, 14, finalY + 31);

    const fileName = `relatorio-${this.selectedTicket.code}-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  }

  // Demo Mode
  openDemoFullscreen() {
    this.isDemoFullscreen = true;
  }

  closeDemoFullscreen() {
    this.isDemoFullscreen = false;
  }

  openDemoNewWindow() {
    window.open(this.demoUrl, '_blank', 'width=1280,height=720');
  }

  formatGrade(code: string): string {
    const grades: Record<string, string> = {
      'ELEMENTARY_1': '1º Ano (Fundamental I)',
      'ELEMENTARY_2': '2º Ano (Fundamental I)',
      'ELEMENTARY_3': '3º Ano (Fundamental I)',
      'ELEMENTARY_4': '4º Ano (Fundamental I)',
      'ELEMENTARY_5': '5º Ano (Fundamental I)',
      'ELEMENTARY_6': '6º Ano (Fundamental II)',
      'ELEMENTARY_7': '7º Ano (Fundamental II)',
      'ELEMENTARY_8': '8º Ano (Fundamental II)',
      'ELEMENTARY_9': '9º Ano (Fundamental II)',
      'HIGH_SCHOOL_1': '1º Ano (Ensino Médio)',
      'HIGH_SCHOOL_2': '2º Ano (Ensino Médio)',
      'HIGH_SCHOOL_3': '3º Ano (Ensino Médio)'
    };
    return grades[code] || code;
  }

  logout() {
    this.authService.logout();
    this.disconnectWebSocket();
    this.router.navigate(['/login']);
  }
}