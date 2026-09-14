package com.boebel.api.dto;

public record ProgressUpdateRequestDTO(
        int nextStage,
        int mistakesInThisLevel,
        boolean gameFinished)
{}
