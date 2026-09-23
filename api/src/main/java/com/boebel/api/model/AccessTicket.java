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

    /**
     * Nome personalizado do ingresso dado pelo professor (ex: "Aula de Terça").
     */
    @Column(name = "ticket_name", length = 100)
    private String ticketName;

    /**
     * Observações livres do professor sobre este ingresso.
     */
    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "grade", nullable = false, length = 50)
    private String grade;

    /**
     * Define o número máximo de jogadores que podem compartilhar a mesma sessão simultaneamente no mesmo dispositivo.
     */
    @Column(name = "max_players_per_session", nullable = false)
    @Builder.Default
    private Integer maxPlayersPerSession = 1;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @ManyToOne
    @JoinColumn(name = "teacher_uuid", nullable = false)
    private Teacher teacher;

}