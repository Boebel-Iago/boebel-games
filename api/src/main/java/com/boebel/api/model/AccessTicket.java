package com.boebel.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Representa um bilhete de acesso (AccessTicket) efêmero para uma sala de aula.
 * O bilhete é criado pelo professor e não armazena dados de identificação pessoal (PII) dos alunos (Privacy by Design).
 * Controla os usos, validade e permite compensação temporal em caso de pausa.
 */
@Entity
@Table(name = "access_tickets")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AccessTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID uuid;

    @Column(nullable = false, unique = true, length = 10)
    private String code;

    @Column(name = "max_uses", nullable = false)
    private Integer maxUses;

    @Column(name = "current_uses", nullable = false)
    @Builder.Default
    private Integer currentUses = 0;

    @Column(name = "expiration_date", nullable = false)
    private LocalDateTime expirationDate;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    /**
     * Armazena o momento exato em que o professor pausa a sala de aula.
     * Utilizado para realizar a compensação temporal da validade do bilhete.
     */
    @Column(name = "paused_at")
    private LocalDateTime pausedAt;

    @Column(name = "grade", nullable = false, length = 50)
    private String grade;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @ManyToOne
    @JoinColumn(name = "teacher_uuid", nullable = false)
    private Teacher teacher;

}