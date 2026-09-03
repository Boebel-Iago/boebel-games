package com.boebel.api.dto;

public record AuthenticationDTO(
        String email,
        String password
) {
}
