package com.boebel.api.service;

import com.boebel.api.model.Game;
import com.boebel.api.repository.GameRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {

    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public List<String> getAvailableGrades() {
        return gameRepository.findDistinctGradesWithGames();
    }

    public List<Game> getGamesByGrade(String grade) {
        return gameRepository.findByAllowedGrades(grade);
    }
}