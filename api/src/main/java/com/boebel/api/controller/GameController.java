package com.boebel.api.controller;

import com.boebel.api.model.Game;
import com.boebel.api.service.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controlador responsável por gerenciar o catálogo de jogos educacionais.
 * Permite a consulta dos anos escolares disponíveis e dos jogos por ano.
 */
@RestController
@RequestMapping("/api")
@Tag(name = "Catálogo de Jogos", description = "Consulta de jogos educacionais disponíveis por ano escolar")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    /**
     * Retorna a lista de anos escolares que possuem jogos disponíveis na plataforma.
     *
     * @return Uma lista de objetos contendo o código e o nome amigável do ano escolar.
     */
    @Operation(summary = "Listar anos escolares", description = "Retorna uma lista dos anos escolares que contêm jogos configurados.", tags = {"Catálogo de Jogos"})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Anos escolares retornados com sucesso")
    })
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

    /**
     * Consulta os jogos disponíveis para um determinado ano escolar.
     *
     * @param grade O código do ano escolar (ex: ELEMENTARY_1).
     * @return Uma lista de jogos educacionais para o ano escolar especificado.
     */
    @Operation(summary = "Listar jogos por ano escolar", description = "Retorna todos os jogos educacionais configurados para um determinado ano escolar.", tags = {"Catálogo de Jogos"})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Jogos retornados com sucesso")
    })
    @GetMapping("/games")
    public ResponseEntity<List<Game>> getGamesByGrade(
            @Parameter(description = "Código do ano escolar, ex: ELEMENTARY_1") @RequestParam String grade) {
        List<Game> games = gameService.getGamesByGrade(grade);
        return ResponseEntity.ok(games);
    }

    /**
     * Converte o código interno do ano escolar para um nome de exibição amigável.
     *
     * @param code O código do ano escolar.
     * @return O nome formatado em português.
     */
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