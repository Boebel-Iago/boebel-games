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

/**
 * Serviço responsável por gerenciar o ciclo de vida dos bilhetes de acesso (AccessTicket).
 * Inclui geração, extensão de validade, exclusão e o controle de status (pausado/ativo)
 * que implementa um algoritmo de compensação temporal.
 */
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
                .ticketName(request.ticketName())
                .notes(request.notes())
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
                .filter(t -> {
                    LocalDateTime effectiveExp = t.getExpirationDate();
                    if (!t.getIsActive() && t.getPausedAt() != null) {
                        effectiveExp = effectiveExp.plus(java.time.Duration.between(t.getPausedAt(), LocalDateTime.now()));
                    }
                    return !effectiveExp.isBefore(LocalDateTime.now());
                })
                .collect(Collectors.toList());

        List<AccessTicket> expiredTickets = tickets.stream()
                .filter(t -> {
                    LocalDateTime effectiveExp = t.getExpirationDate();
                    if (!t.getIsActive() && t.getPausedAt() != null) {
                        effectiveExp = effectiveExp.plus(java.time.Duration.between(t.getPausedAt(), LocalDateTime.now()));
                    }
                    return effectiveExp.isBefore(LocalDateTime.now());
                })
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

    /**
     * Alterna o status do bilhete entre ativo e pausado.
     * Implementa um algoritmo de compensação temporal: se o bilhete for pausado, salva o momento exato;
     * ao ser reativado, calcula a duração da pausa (utilizando Duration.between) e estende a data de
     * expiração original, compensando o tempo em que o bilhete ficou congelado.
     * @param ticketId o UUID do bilhete a ser alternado.
     * @param teacher o professor que está alterando o status (deve ser o proprietário).
     * @return o DTO do bilhete atualizado.
     * @throws RuntimeException se o bilhete não for encontrado.
     * @throws SecurityException se o professor não for o proprietário do bilhete.
     */
    public TicketResponseDTO toggleTicketStatus(UUID ticketId, Teacher teacher) {
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
            LocalDateTime effectiveExp = ticket.getExpirationDate();
            if (!ticket.getIsActive() && ticket.getPausedAt() != null) {
                effectiveExp = effectiveExp.plus(java.time.Duration.between(ticket.getPausedAt(), LocalDateTime.now()));
            }
            if (effectiveExp.isBefore(LocalDateTime.now())) {
                studentSessionRepository.deleteByTicketCode(ticket.getCode());
                accessTicketRepository.delete(ticket);
            }
        }
    }

    private TicketResponseDTO toDTO(AccessTicket ticket) {
        LocalDateTime effectiveExp = ticket.getExpirationDate();
        // Se estiver pausado, projeta a expiração para compensar o tempo já passado desde o pause,
        // assim o tempo restante enviado ao frontend fica "congelado".
        if (!ticket.getIsActive() && ticket.getPausedAt() != null) {
            java.time.Duration pausedDuration = java.time.Duration.between(ticket.getPausedAt(), java.time.LocalDateTime.now());
            effectiveExp = effectiveExp.plus(pausedDuration);
        }

        return new TicketResponseDTO(
                ticket.getUuid(),
                ticket.getCode(),
                ticket.getTicketName(),
                ticket.getNotes(),
                ticket.getGrade(),
                ticket.getGame().getTitle(),
                ticket.getGame().getRoute(),
                ticket.getMaxUses(),
                ticket.getMaxUses() - ticket.getCurrentUses(),
                null,
                effectiveExp.toString(),
                ticket.getIsActive()
        );
    }

    private String generateRandomCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}