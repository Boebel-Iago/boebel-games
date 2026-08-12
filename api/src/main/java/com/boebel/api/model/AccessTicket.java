package com.boebel.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

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
    private String code; //Start and control of access for a session

    @Column(name = "max_uses", nullable = false)
    private Integer maxUses; //Number of students in the same session

    @Column(name = "current_uses", nullable = false)
    @Builder.Default
    private Integer currentUses = 0; //Number of user online at the moment, always starts in zero

    @Column(name = "local_date_time", nullable = false)
    private LocalDateTime expirationDate;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true; //For need to desactive the token
}
