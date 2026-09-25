import re

with open('api/src/main/java/com/boebel/api/service/AccessTicketService.java', 'r') as f:
    content = f.read()

new_logic = """    public TicketResponseDTO toggleTicketStatus(UUID ticketId, Teacher teacher) {
        AccessTicket ticket = accessTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ingresso não encontrado!"));

        if (!ticket.getTeacher().getUuid().equals(teacher.getUuid())) {
            throw new SecurityException("Sem permissão para alterar este ingresso.");
        }

        // Inverte o status atual
        boolean newStatus = !ticket.getIsActive();
        ticket.setIsActive(newStatus);
        
        if (!newStatus) {
            // A sala foi PAUSADA: grava o momento exato
            ticket.setPausedAt(java.time.LocalDateTime.now());
        } else {
            // A sala foi REATIVADA: calcula o tempo que ficou pausada e estende a validade
            if (ticket.getPausedAt() != null) {
                java.time.Duration pausedDuration = java.time.Duration.between(ticket.getPausedAt(), java.time.LocalDateTime.now());
                ticket.setExpirationDate(ticket.getExpirationDate().plus(pausedDuration));
                ticket.setPausedAt(null);
            }
        }
        
        accessTicketRepository.save(ticket);

        return toDTO(ticket);
    }"""

content = re.sub(r'    public TicketResponseDTO toggleTicketStatus\(UUID ticketId, Teacher teacher\) \{.*?\n    \}', new_logic, content, flags=re.DOTALL)

with open('api/src/main/java/com/boebel/api/service/AccessTicketService.java', 'w') as f:
    f.write(content)
