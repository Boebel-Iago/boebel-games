package com.boebel.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record StudentSessionDTO(
        UUID id,
        String studentName,
        String gameRoute,
        int currentStage,
        int totalMistakes,
        boolean completed,
        LocalDateTime startedAt
) {}
