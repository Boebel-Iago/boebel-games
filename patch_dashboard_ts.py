with open('frontend/src/app/features/admin/dashboard/dashboard.component.ts', 'r') as f:
    text = f.read()

text = text.replace(
    '  isDemoFullscreen = false;\n  demoUrl = \'\';',
    '  isDemoFullscreen = false;\n  demoUrl = \'\';\n  showCreateModal = false;\n  sortOrder: "newest" | "oldest" | "active" = "active";'
)

kick_student = '''
  get sortedTickets() {
    if (!this.tickets) return [];
    return this.tickets.slice().sort((a, b) => {
      if (this.sortOrder === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (this.sortOrder === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (this.sortOrder === 'active') return (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0);
      return 0;
    });
  }

  kickStudent(sessionId: string, studentName: string) {
    if (confirm(`Tem certeza que deseja expulsar o aluno ${studentName}? Ele perderá todo o progresso.`)) {
      // Direct HTTP delete as it is a quick endpoint
      this.ticketService.deleteSession(sessionId).subscribe({
        next: () => console.log('Aluno expulso com sucesso!'),
        error: (err) => alert('Erro ao expulsar aluno.')
      });
    }
  }

  openCreateModal() {
    this.showCreateModal = true;
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.ticketForm.reset({ maxUses: 1, expirationHours: 24, maxPlayersPerSession: 1, grade: '', gameId: null });
  }
'''
text = text.replace('  onGenerateTicket() {', kick_student + '\n  onGenerateTicket() {')

text = text.replace('this.loadTickets(); // Atualiza a lista', 'this.loadTickets();\n          this.closeCreateModal();')

with open('frontend/src/app/features/admin/dashboard/dashboard.component.ts', 'w') as f:
    f.write(text)
