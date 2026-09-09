package com.boebel.api.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "games")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Mudou para Long (wrapper) e GenerationType.IDENTITY

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false, unique = true)
    private String route;

    // O JPA criará uma tabela auxiliar oculta chamada "game_allowed_grades"
    @ElementCollection
    @CollectionTable(name = "game_allowed_grades", joinColumns = @JoinColumn(name = "game_id"))
    @Column(name = "grade_name")
    private List<String> allowedGrades;
}