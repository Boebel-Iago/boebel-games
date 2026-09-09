package com.boebel.api.repository;

import com.boebel.api.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {

    List<Game> findByAllowedGrades(String grade);

    // This methos will help to list in angular just grade that has at least one game registred, avoiding empty grade.
    @Query("SELECT DISTINCT grade FROM Game g JOIN g.allowedGrades grade")
    List<String> findDistinctGradesWithGames();
}