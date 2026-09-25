with open('api/src/main/java/com/boebel/api/controller/AccessTicketController.java', 'r') as f:
    text = f.read()

delete_endpoint = '''
    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<?> kickStudent(@PathVariable java.util.UUID sessionId) {
        StudentSession session = studentSessionRepository.findById(sessionId).orElse(null);
        if (session != null) {
            String ticketCode = session.getTicketCode();
            studentSessionRepository.delete(session);
            broadcastSessions(ticketCode);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
'''

text = text.replace('private void broadcastSessions(String ticketCode) {', delete_endpoint + '\n    private void broadcastSessions(String ticketCode) {')

with open('api/src/main/java/com/boebel/api/controller/AccessTicketController.java', 'w') as f:
    f.write(text)
