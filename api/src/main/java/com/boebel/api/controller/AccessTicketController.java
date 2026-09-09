package com.boebel.api.controller;

import com.boebel.api.dto.TicketRequestDTO;
import com.boebel.api.dto.TicketResponseDTO;
import com.boebel.api.model.Teacher;
import com.boebel.api.repository.TeacherRepository;
import com.boebel.api.service.AccessTicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
public class AccessTicketController {

    private final AccessTicketService accessTicketService;
    private final TeacherRepository teacherRepository;

    public AccessTicketController(AccessTicketService accessTicketService, TeacherRepository teacherRepository) {
        this.accessTicketService = accessTicketService;
        this.teacherRepository = teacherRepository;
    }

    // Endpoint to generate a new code
    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody TicketRequestDTO ticketRequestDTO, Principal principal) {
        try {
            //Get email from JWT and extract the Teacher
            String email = principal.getName();
            Teacher teacher = teacherRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));

            TicketResponseDTO ticketResponseDTO = accessTicketService.generateTicket(teacher, ticketRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(ticketResponseDTO);

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint for get activate ticker for a Teacher (chamado no ngOnInit do Angular)
    @GetMapping("/active")
    public ResponseEntity<TicketResponseDTO> getActiveTicket(Principal principal) {
        String email = principal.getName();
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        TicketResponseDTO ticket = accessTicketService.getActiveTicketForTeacher(teacher);

        if (ticket == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(ticket);
    }

    // Public endpoint for children enter in the game

    @PostMapping("/validate")
    public ResponseEntity<?> validateStudentTicket(@RequestBody Map<String, String> payload) {
        try {
            String code = payload.get("code");
            if (code == null || code.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Code not provided."));
            }

            TicketResponseDTO validatedTicket = accessTicketService.validateAndConsumeTicket(code);
            return ResponseEntity.ok(validatedTicket);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint for delete a active ticket
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable UUID id, Principal principal) {
        String email = principal.getName();
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        accessTicketService.deleteTicket(id, teacher);
        return ResponseEntity.noContent().build();
    }
}