    @PutMapping("/sessions/{sessionId}/progress")
    public ResponseEntity<?> updateProgress(
            @PathVariable UUID sessionId,
            @RequestBody ProgressUpdateRequestDTO request) {

        StudentSession session = studentSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada!"));

        // Check if ticket is still active
        AccessTicket ticket = accessTicketRepository.findByCode(session.getTicketCode())
                .orElseThrow(() -> new RuntimeException("Ingresso não encontrado!"));

        if (!ticket.getIsActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Esta sala está pausada pelo professor!"));
        }
        if (ticket.getExpirationDate().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Este ingresso expirou!"));
        }

        session.setCurrentStage(request.nextStage());
        session.setTotalMistakes(session.getTotalMistakes() + request.mistakesInThisLevel());

        if (request.gameFinished()) {
            session.setCompleted(true);
        }

        studentSessionRepository.save(session);
        broadcastSessions(session.getTicketCode());

        return ResponseEntity.ok().build();
    }
