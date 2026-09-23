package com.boebel.api.dto;


import java.util.List;

/**
 * DTO que encapsula os dados enviados quando alunos entram em uma sala de jogo.
 * Inclui o código do bilhete fornecido pelo professor e a lista de nomes dos alunos.
 */
public record JoinGameRequestDTO(
        String ticketCode,
        List<String> studentNames){}