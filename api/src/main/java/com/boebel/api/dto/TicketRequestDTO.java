package com.boebel.api.dto;

/**
 * DTO de requisição para a criação de um novo bilhete de acesso (AccessTicket) pelo professor.
 * Especifica limites de uso, expiração em horas, série (grade) e o ID do jogo.
 */
public record TicketRequestDTO(
        Integer maxUses,
        Integer expirationHours,
        String grade,
        Long gameId
) {}