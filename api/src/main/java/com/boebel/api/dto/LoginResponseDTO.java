package com.boebel.api.dto;

/**
 * DTO de resposta que encapsula o token JWT gerado após o login bem-sucedido do professor.
 */
public record LoginResponseDTO(String token) {
}
