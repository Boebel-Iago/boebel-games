package com.boebel.api.dto;

/**
 * DTO para atualização do progresso do aluno no jogo.
 * Recebe o próximo estágio (0-indexed), os erros cometidos na fase atual e o status de conclusão.
 */
public record ProgressUpdateRequestDTO(
        int nextStage,
        int mistakesInThisLevel,
        boolean gameFinished,
        Integer score,
        String gameState)
{}
