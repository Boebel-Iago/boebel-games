package com.boebel.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data // LOMBOK: Cria getters, setters, toString, equals e hashCode
@NoArgsConstructor // LOMBOK: Construtor vazio para o JPA
/**
 * Representa a sessão anônima de um aluno, garantindo o rastreamento do seu progresso
 * seguindo os princípios de Privacy by Design (sem armazenar dados sensíveis PII).
 */
@Entity
@Table(name = "student_sessions")
public class StudentSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String studentName;

    @Column(nullable = false)
    private String ticketCode;

    @Column(nullable = false)
    private String gameRoute;

    /**
     * O estágio atual do aluno no jogo. 
     * Observação: é indexado em 0 no banco de dados, mas exibido como +1 na UI.
     */
    private int currentStage = 0;

    private int totalMistakes = 0;

    private boolean completed = false;

    private LocalDateTime startedAt = LocalDateTime.now();
}