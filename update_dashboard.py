import re

with open('frontend/src/app/features/admin/dashboard/dashboard.component.ts', 'r') as f:
    content = f.read()

# Modify loadTickets
new_load = """  loadTickets() {
    this.ticketService.getActiveTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        // Restaurar ticket se F5 for pressionado
        const savedTicketCode = sessionStorage.getItem('adminSelectedTicket');
        if (savedTicketCode && !this.selectedTicket) {
          const found = this.tickets.find(t => t.code === savedTicketCode);
          if (found) {
            this.openTicketMonitor(found);
          }
        }
      },
      error: () => { this.tickets = []; }
    });
  }"""
content = re.sub(r'  loadTickets\(\) \{.*?\n  \}', new_load, content, flags=re.DOTALL)

# Modify openTicketMonitor
new_open = """  openTicketMonitor(ticket: any) {
    this.selectedTicket = ticket;
    this.activeTab = 'monitor';
    sessionStorage.setItem('adminSelectedTicket', ticket.code);
    this.loadSessions();
    this.connectWebSocket(ticket.code);
  }"""
content = re.sub(r'  openTicketMonitor\(ticket: any\) \{.*?\n  \}', new_open, content, flags=re.DOTALL)

# Modify closeTicketMonitor
new_close = """  closeTicketMonitor() {
    this.selectedTicket = null;
    this.sessions = [];
    sessionStorage.removeItem('adminSelectedTicket');
    this.disconnectWebSocket();
    this.loadTickets(); // Recarrega a lista para pegar possíveis status atualizados
  }"""
content = re.sub(r'  closeTicketMonitor\(\) \{.*?\n  \}', new_close, content, flags=re.DOTALL)

with open('frontend/src/app/features/admin/dashboard/dashboard.component.ts', 'w') as f:
    f.write(content)
