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
import java.util.UUID;

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
        // Limpa ticket expirado se existir, para liberar a criação de novo
        cleanupExpiredTicket(teacher);

        if (accessTicketRepository.existsByTeacher(teacher)) {
            throw new IllegalStateException("Você já tem um ingresso ativo! Exclua-o antes de criar outro.");
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

    public TicketResponseDTO getActiveTicketForTeacher(Teacher teacher) {
        AccessTicket ticket = accessTicketRepository.findByTeacher(teacher).orElse(null);
        if (ticket == null) return null;

        // CORREÇÃO: Deleta APENAS se estiver expirado no tempo.
        // Ingressos inativados manualmente (pausados) não são deletados.
        if (ticket.getExpirationDate().isBefore(LocalDateTime.now())) {
            // Auto-cleanup: deleta sessões e o ticket expirado
            studentSessionRepository.deleteByTicketCode(ticket.getCode());
            accessTicketRepository.delete(ticket);
            return null;
        }

        return toDTO(ticket);
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

    // NOVO: Método para pausar e reativar o ingresso
    public TicketResponseDTO toggleTicketStatus(UUID ticketId, Teacher teacher) {
        AccessTicket ticket = accessTicketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ingresso não encontrado!"));

        if (!ticket.getTeacher().getUuid().equals(teacher.getUuid())) {
            throw new SecurityException("Sem permissão para alterar este ingresso.");
        }

        // Inverte o status atual (se true vira false, se false vira true)
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
     * Limpa ticket expirado silenciosamente para que o professor possa criar um novo.
     */
    private void cleanupExpiredTicket(Teacher teacher) {
        AccessTicket ticket = accessTicketRepository.findByTeacher(teacher).orElse(null);
        if (ticket != null && ticket.getExpirationDate().isBefore(LocalDateTime.now())) {
            studentSessionRepository.deleteByTicketCode(ticket.getCode());
            accessTicketRepository.delete(ticket);
        }
    }

    private TicketResponseDTO toDTO(AccessTicket ticket) {
        // CORREÇÃO: Passando ticket.getIsActive() para o DTO resolver o erro de compilação
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