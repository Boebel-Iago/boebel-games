package com.boebel.api.dto;

import java.util.UUID;

/**
 * DTO de resposta contendo as informações de um bilhete de acesso (AccessTicket).
 * Fornece dados formatados para a visão do professor, incluindo usos restantes e status.
 */
public record TicketResponseDTO(
        UUID id,
        String code,
        String ticketName,
        String notes,
        String grade,
        String gameTitle,
        String gameRoute,
        Integer maxUses,
        Integer remainingUses,
        Integer expirationHours,
        String expirationDate,
        Boolean isActive
) {}