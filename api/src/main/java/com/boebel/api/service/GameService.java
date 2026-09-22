package com.boebel.api.service;

import com.boebel.api.model.Game;
import com.boebel.api.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço de gerenciamento do catálogo de jogos.
 * Responsável pelas consultas relacionadas aos jogos e às séries (grades) disponíveis.
 */
@Service
public class GameService {

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public List<String> getAvailableGrades() {
        return gameRepository.findDistinctGradesWithGames();
    }

    /**
     * Obtém a lista de jogos disponíveis para uma determinada série.
     * @param grade a série escolar desejada.
     * @return uma lista de jogos permitidos para a série.
     */
    public List<Game> getGamesByGrade(String grade) {
        return gameRepository.findByAllowedGrades(grade);
    }
}