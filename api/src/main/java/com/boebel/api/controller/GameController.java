package com.boebel.api.controller;

import com.boebel.api.model.Game;
import com.boebel.api.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/grades/available")
    public ResponseEntity<List<Map<String, String>>> getAvailableGrades() {
        List<String> rawGrades = gameService.getAvailableGrades();

        List<Map<String, String>> formattedGrades = rawGrades.stream()
                .map(grade -> Map.of(
                        "code", grade,
                        "name", formatGradeName(grade)
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(formattedGrades);
    }

    @GetMapping("/games")
    public ResponseEntity<List<Game>> getGamesByGrade(@RequestParam String grade) {
        List<Game> games = gameService.getGamesByGrade(grade);
        return ResponseEntity.ok(games);
    }

    private String formatGradeName(String code) {
        return switch (code) {
            case "ELEMENTARY_1" -> "1º Ano (Fundamental I)";
            case "ELEMENTARY_2" -> "2º Ano (Fundamental I)";
            case "ELEMENTARY_3" -> "3º Ano (Fundamental I)";
            case "ELEMENTARY_4" -> "4º Ano (Fundamental I)";
            case "ELEMENTARY_5" -> "5º Ano (Fundamental I)";
            case "ELEMENTARY_6" -> "6º Ano (Fundamental II)";
            case "ELEMENTARY_7" -> "7º Ano (Fundamental II)";
            case "ELEMENTARY_8" -> "8º Ano (Fundamental II)";
            case "ELEMENTARY_9" -> "9º Ano (Fundamental II)";
            case "HIGH_SCHOOL_1" -> "1º Ano (Ensino Médio)";
            case "HIGH_SCHOOL_2" -> "2º Ano (Ensino Médio)";
            case "HIGH_SCHOOL_3" -> "3º Ano (Ensino Médio)";
            default -> code; //
        };
    }
}