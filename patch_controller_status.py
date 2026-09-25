import re

with open('api/src/main/java/com/boebel/api/controller/AccessTicketController.java', 'r') as f:
    content = f.read()

new_endpoint = """
    // NEW: Verifica se a sessão do aluno ainda é de um ticket ativo e válido (Proteção F5)
    @GetMapping("/sessions/{sessionId}/status")
    public ResponseEntity<?> checkSessionStatus(@PathVariable UUID sessionId) {
        StudentSession session = studentSessionRepository.findById(sessionId).orElse(null);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Sessão não encontrada"));
        }

        AccessTicket ticket = accessTicketRepository.findByCode(session.getTicketCode()).orElse(null);
        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Ticket não encontrado"));
        }

        if (!ticket.getIsActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Sala pausada"));
        }

        if (ticket.getExpirationDate().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Sala expirada"));
        }

        return ResponseEntity.ok(Map.of("status", "valid"));
    }
"""

content = content.replace('public ResponseEntity<?> updateProgress', new_endpoint + '\n    @PutMapping("/sessions/{sessionId}/progress")\n    public ResponseEntity<?> updateProgress')

with open('api/src/main/java/com/boebel/api/controller/AccessTicketController.java', 'w') as f:
    f.write(content)
