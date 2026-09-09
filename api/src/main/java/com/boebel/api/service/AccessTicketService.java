package com.boebel.api.service;

import com.boebel.api.dto.TicketRequestDTO;
import com.boebel.api.dto.TicketResponseDTO;
import com.boebel.api.model.AccessTicket;
import com.boebel.api.model.Game;
import com.boebel.api.model.Teacher;
import com.boebel.api.repository.AccessTicketRepository;
import com.boebel.api.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AccessTicketService {

    private final AccessTicketRepository accessTicketRepository;
    private final GameRepository gameRepository;

    public AccessTicketService(AccessTicketRepository accessTicketRepository, GameRepository gameRepository) {
        this.accessTicketRepository = accessTicketRepository;
        this.gameRepository = gameRepository;
    }

    public TicketResponseDTO generateTicket(Teacher teacher, TicketRequestDTO request) {
        if (accessTicketRepository.existsByTeacher(teacher)) {
            throw new IllegalStateException("Teacher already has an active ticket.");
        }

        Game game = gameRepository.findById(request.gameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));

        AccessTicket accessTicket = AccessTicket.builder()
                .teacher(teacher)
                .code(generateRandomCode())
                .maxUses(request.maxUses())
                .grade(request.grade())
                .game(game)
                .expirationDate(LocalDateTime.now().plusHours(request.expirationHours()))
                .build();

        AccessTicket savedTicket = accessTicketRepository.save(accessTicket);

        return new TicketResponseDTO(
                savedTicket.getUuid(),
                savedTicket.getCode(),
                savedTicket.getGrade(),
                game.getTitle(),
                game.getRoute(),
                savedTicket.getMaxUses(),
                savedTicket.getMaxUses() - savedTicket.getCurrentUses(),
                request.expirationHours()
        );
    }

    public TicketResponseDTO getActiveTicketForTeacher(Teacher teacher) {
        AccessTicket ticket = accessTicketRepository.findByTeacher(teacher).orElse(null);
        if (ticket == null) return null;

        return new TicketResponseDTO(
                ticket.getUuid(),
                ticket.getCode(),
                ticket.getGrade(),
                ticket.getGame().getTitle(),
                ticket.getGame().getRoute(),
                ticket.getMaxUses(),
                ticket.getMaxUses() - ticket.getCurrentUses(),
                null
        );
    }

    public void deleteTicket(UUID id, Teacher teacher) {
        AccessTicket ticket = accessTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!ticket.getTeacher().getUuid().equals(teacher.getUuid())) {
            throw new SecurityException("Unauthorized to delete this ticket");
        }

        accessTicketRepository.delete(ticket);
    }

    public TicketResponseDTO validateAndConsumeTicket(String code) {
        AccessTicket ticket = accessTicketRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid ticket!"));

        if (!ticket.getIsActive()) {
            throw new IllegalArgumentException("This ticket is disable");
        }

        if (ticket.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("This ticket expires");
        }

        if (ticket.getCurrentUses() >= ticket.getMaxUses()) {
            throw new IllegalArgumentException("This room is full");
        }

        // Increment the people that uses this ticket
        ticket.setCurrentUses(ticket.getCurrentUses() + 1);
        accessTicketRepository.save(ticket);

        return new TicketResponseDTO(
                ticket.getUuid(),
                ticket.getCode(),
                ticket.getGrade(),
                ticket.getGame().getTitle(),
                ticket.getGame().getRoute(), // CRITIC: Frontend need this to redirect to game
                ticket.getMaxUses(),
                ticket.getMaxUses() - ticket.getCurrentUses(),
                null
        );
    }

    private String generateRandomCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}