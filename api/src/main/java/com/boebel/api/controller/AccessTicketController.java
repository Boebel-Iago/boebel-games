package com.boebel.api.controller;

import com.boebel.api.dto.JoinGameRequestDTO;
import com.boebel.api.dto.ProgressUpdateRequestDTO;
import com.boebel.api.dto.StudentSessionDTO;
import com.boebel.api.dto.TicketRequestDTO;
import com.boebel.api.dto.TicketResponseDTO;
import com.boebel.api.model.AccessTicket;
import com.boebel.api.model.StudentSession;
import com.boebel.api.model.Teacher;
import com.boebel.api.repository.AccessTicketRepository;
import com.boebel.api.repository.StudentSessionRepository;
import com.boebel.api.repository.TeacherRepository;
import com.boebel.api.service.AccessTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class AccessTicketController {

    private final AccessTicketService accessTicketService;
    private final TeacherRepository teacherRepository;
    private final StudentSessionRepository studentSessionRepository;
    private final AccessTicketRepository accessTicketRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // Endpoint to generate a new code
    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody TicketRequestDTO ticketRequestDTO, Principal principal) {
        try {
            String email = principal.getName();
            Teacher teacher = teacherRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));

            TicketResponseDTO ticketResponseDTO = accessTicketService.generateTicket(teacher, ticketRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(ticketResponseDTO);

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint for get active ticket for a Teacher
    // MODIFIED: Get all active tickets for teacher
    @GetMapping("/active")
    public ResponseEntity<List<TicketResponseDTO>> getActiveTickets(Principal principal) {
        String email = principal.getName();
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        List<TicketResponseDTO> tickets = accessTicketService.getActiveTicketsForTeacher(teacher);
        return ResponseEntity.ok(tickets);
    }

    // MODIFIED: Get sessions for a specific ticket code
    @GetMapping("/{ticketCode}/sessions")
    public ResponseEntity<List<StudentSessionDTO>> getSessionsByTicket(@PathVariable String ticketCode, Principal principal) {
        String email = principal.getName();
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Verify if teacher owns this ticket
        AccessTicket ticket = accessTicketRepository.findByCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Ingresso não encontrado"));
                
        if (!ticket.getTeacher().getUuid().equals(teacher.getUuid())) {
             throw new SecurityException("Sem permissão para ver estas sessões.");
        }

        List<StudentSessionDTO> sessions = studentSessionRepository.findByTicketCode(ticket.getCode())
                .stream()
                .map(s -> new StudentSessionDTO(s.getId(), s.getStudentName(), s.getGameRoute(),
                        s.getCurrentStage(), s.getTotalMistakes(), s.isCompleted(), s.getStartedAt()))
                .toList();

        return ResponseEntity.ok(sessions);
    }

    // MODIFIED: Reuse existing session if student re-enters with same name + code
    // Now properly validates ticket (active, not expired, max uses) via service
    @PostMapping("/validate")
    public ResponseEntity<?> validateTicketAndJoin(@RequestBody JoinGameRequestDTO request) {

        AccessTicket ticket = accessTicketRepository.findByCode(request.ticketCode())
                .orElseThrow(() -> new RuntimeException("Código inválido ou não encontrado!"));

        // Check if session already exists for this student + ticket (allows resume)
        StudentSession session = studentSessionRepository
                .findByStudentNameAndTicketCode(request.studentName(), ticket.getCode())
                .orElse(null);

        if (session != null) {
            // Returning student — reuse existing session without consuming a slot
            broadcastSessions(ticket.getCode());

            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", session.getId());
            response.put("gameRoute", session.getGameRoute());
            response.put("currentStage", session.getCurrentStage());
            return ResponseEntity.ok(response);
        }

        // New student — validate ticket constraints (active, expiration, maxUses)
        if (!ticket.getIsActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Este ingresso foi desativado!"));
        }
        if (ticket.getExpirationDate().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Este ingresso expirou!"));
        }
        if (ticket.getCurrentUses() >= ticket.getMaxUses()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "A sala está cheia! Número máximo de alunos atingido."));
        }

        // Consume a slot
        ticket.setCurrentUses(ticket.getCurrentUses() + 1);
        accessTicketRepository.save(ticket);

        // Create new session
        session = new StudentSession();
        session.setStudentName(request.studentName());
        session.setTicketCode(ticket.getCode());
        session.setGameRoute(ticket.getGame().getRoute());
        session = studentSessionRepository.save(session);

        // Broadcast updated sessions via WebSocket
        broadcastSessions(ticket.getCode());

        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", session.getId());
        response.put("gameRoute", session.getGameRoute());
        response.put("currentStage", session.getCurrentStage());

        return ResponseEntity.ok(response);
    }

    // MODIFIED: Also delete all sessions when ticket is deleted
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable UUID id, Principal principal) {
        String email = principal.getName();
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Get the ticket before deleting to clean up sessions
        AccessTicket ticket = accessTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Delete all student sessions associated with this ticket
        studentSessionRepository.deleteByTicketCode(ticket.getCode());

        accessTicketService.deleteTicket(id, teacher);
        return ResponseEntity.noContent().build();
    }

    // NEW: Extend ticket expiration time
    @PutMapping("/{id}/extend")
    public ResponseEntity<?> extendTicket(@PathVariable UUID id,
                                          @RequestBody Map<String, Integer> body,
                                          Principal principal) {
        String email = principal.getName();
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        int additionalHours = body.getOrDefault("additionalHours", 1);
        TicketResponseDTO updated = accessTicketService.extendTicket(id, teacher, additionalHours);
        return ResponseEntity.ok(updated);
    }

    // NEW: Toggle ticket status (Pause/Resume)
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleTicketStatus(@PathVariable UUID id, Principal principal) {
        String email = principal.getName();
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        TicketResponseDTO updated = accessTicketService.toggleTicketStatus(id, teacher);
        return ResponseEntity.ok(updated);
    }

    // MODIFIED: Broadcast via WebSocket after updating progress
    @PutMapping("/sessions/{sessionId}/progress")
    public ResponseEntity<?> updateProgress(
            @PathVariable UUID sessionId,
            @RequestBody ProgressUpdateRequestDTO request) {

        StudentSession session = studentSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada!"));

        session.setCurrentStage(request.nextStage());
        session.setTotalMistakes(session.getTotalMistakes() + request.mistakesInThisLevel());

        if (request.gameFinished()) {
            session.setCompleted(true);
        }

        studentSessionRepository.save(session);

        // Broadcast updated sessions via WebSocket
        broadcastSessions(session.getTicketCode());

        return ResponseEntity.ok().build();
    }

    /**
     * Broadcasts the full list of sessions for a given ticket code to all
     * connected WebSocket clients subscribed to that topic.
     */
    private void broadcastSessions(String ticketCode) {
        List<StudentSessionDTO> sessions = studentSessionRepository.findByTicketCode(ticketCode)
                .stream()
                .map(s -> new StudentSessionDTO(s.getId(), s.getStudentName(), s.getGameRoute(),
                        s.getCurrentStage(), s.getTotalMistakes(), s.isCompleted(), s.getStartedAt()))
                .toList();
        messagingTemplate.convertAndSend("/topic/sessions/" + ticketCode, sessions);
    }
}