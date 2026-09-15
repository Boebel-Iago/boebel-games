package com.boebel.api.service;

import com.boebel.api.dto.TicketRequestDTO;
import com.boebel.api.dto.TicketResponseDTO;
import com.boebel.api.model.AccessTicket;
import com.boebel.api.model.Game;
import com.boebel.api.model.Teacher;
import com.boebel.api.repository.AccessTicketRepository;
import com.boebel.api.repository.GameRepository;
import com.boebel.api.repository.StudentSessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AccessTicketService {

    private final AccessTicketRepository accessTicketRepository;
    private final GameRepository gameRepository;
    private final StudentSessionRepository studentSessionRepository;

    public AccessTicketService(AccessTicketRepository accessTicketRepository,
                               GameRepository gameRepository,
                               StudentSessionRepository studentSessionRepository) {
        this.accessTicketRepository = accessTicketRepository;
        this.gameRepository = gameRepository;
        this.studentSessionRepository = studentSessionRepository;
    }

    public TicketResponseDTO generateTicket(Teacher teacher, TicketRequestDTO request) {
        // Limpa tickets expirados para liberar espaço
        cleanupExpiredTickets(teacher);

        if (accessTicketRepository.countByTeacher(teacher) >= 20) {
            throw new IllegalStateException("Limite atingido: você já tem 20 ingressos ativos. Exclua algum antigo ou aguarde expirarem para criar um novo.");
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
                .isActive(true)
                .build();

        AccessTicket savedTicket = accessTicketRepository.save(accessTicket);

        return toDTO(savedTicket);
    }

    public List<TicketResponseDTO> getActiveTicketsForTeacher(Teacher teacher) {
        List<AccessTicket> tickets = accessTicketRepository.findAllByTeacher(teacher);
        
        // Separa os válidos dos expirados
        List<AccessTicket> validTickets = tickets.stream()
                .filter(t -> !t.getExpirationDate().isBefore(LocalDateTime.now()))
                .collect(Collectors.toList());

        List<AccessTicket> expiredTickets = tickets.stream()
                .filter(t -> t.getExpirationDate().isBefore(LocalDateTime.now()))
                .collect(Collectors.toList());

        // Deleta os expirados
        for (AccessTicket expired : expiredTickets) {
            studentSessionRepository.deleteByTicketCode(expired.getCode());
            accessTicketRepository.delete(expired);
        }

        // Retorna DTOs dos válidos ordenados
        return validTickets.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TicketResponseDTO extendTicket(UUID ticketId, Teacher teacher, int additionalHours) {
        AccessTicket ticket = accessTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ingresso não encontrado!"));

        if (!ticket.getTeacher().getUuid().equals(teacher.getUuid())) {
            throw new SecurityException("Sem permissão para alterar este ingresso.");
        }

        // Estende a expiração a partir de agora (ou do vencimento original, o que for maior)
        LocalDateTime baseTime = ticket.getExpirationDate().isAfter(LocalDateTime.now())
                ? ticket.getExpirationDate()
                : LocalDateTime.now();

        ticket.setExpirationDate(baseTime.plusHours(additionalHours));
        ticket.setIsActive(true); // Reativa se estava expirado ou pausado
        accessTicketRepository.save(ticket);

        return toDTO(ticket);
    }

    public TicketResponseDTO toggleTicketStatus(UUID ticketId, Teacher teacher) {
        AccessTicket ticket = accessTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ingresso não encontrado!"));

        if (!ticket.getTeacher().getUuid().equals(teacher.getUuid())) {
            throw new SecurityException("Sem permissão para alterar este ingresso.");
        }

        // Inverte o status atual
        ticket.setIsActive(!ticket.getIsActive());
        accessTicketRepository.save(ticket);

        return toDTO(ticket);
    }

    public void deleteTicket(UUID id, Teacher teacher) {
        AccessTicket ticket = accessTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!ticket.getTeacher().getUuid().equals(teacher.getUuid())) {
            throw new SecurityException("Unauthorized to delete this ticket");
        }

        accessTicketRepository.delete(ticket);
    }

    /**
     * Limpa tickets expirados silenciosamente.
     */
    private void cleanupExpiredTickets(Teacher teacher) {
        List<AccessTicket> tickets = accessTicketRepository.findAllByTeacher(teacher);
        for (AccessTicket ticket : tickets) {
            if (ticket.getExpirationDate().isBefore(LocalDateTime.now())) {
                studentSessionRepository.deleteByTicketCode(ticket.getCode());
                accessTicketRepository.delete(ticket);
            }
        }
    }

    private TicketResponseDTO toDTO(AccessTicket ticket) {
        return new TicketResponseDTO(
                ticket.getUuid(),
                ticket.getCode(),
                ticket.getGrade(),
                ticket.getGame().getTitle(),
                ticket.getGame().getRoute(),
                ticket.getMaxUses(),
                ticket.getMaxUses() - ticket.getCurrentUses(),
                null,
                ticket.getExpirationDate().toString(),
                ticket.getIsActive()
        );
    }

    private String generateRandomCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}