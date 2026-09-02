package com.boebel.api.dto;

public record TicketRequestDTO(
        Integer maxUses,
        Integer hoursValid
) {}
