package com.boebel.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO utilizado para enviar os dados da sessão do aluno para exibição no dashboard do professor.
 * Inclui estatísticas como estágio atual e total de erros na sessão.
 */
public record StudentSessionDTO(
        UUID id,
        String studentName,
        String gameRoute,
        int currentStage,
        int totalMistakes,
        boolean completed,
        LocalDateTime startedAt
) {}
