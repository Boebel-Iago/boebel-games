package com.boebel.api.dto;

public record TicketRequestDTO(
        Integer maxUses,
        Integer expirationHours,
        String grade,
        Long gameId
) {}