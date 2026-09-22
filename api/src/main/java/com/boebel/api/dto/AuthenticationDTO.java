package com.boebel.api.dto;

/**
 * Objeto de Transferência de Dados (DTO) para credenciais de login do professor.
 */
public record AuthenticationDTO(
        String email,
        String password
) {
}
