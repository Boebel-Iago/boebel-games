package com.boebel.api.dto;

import java.util.UUID;

public record TicketResponseDTO(
        UUID id,
        String code,
        String grade,
        String gameTitle,
        String gameRoute,
        Integer maxUses,
        Integer remainingUses,
        Integer expirationHours
) {}