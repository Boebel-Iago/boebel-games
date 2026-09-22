package com.boebel.api.dto;


/**
 * DTO que encapsula os dados enviados quando um aluno entra em uma sala de jogo.
 * Inclui o código do bilhete fornecido pelo professor e o nome do aluno.
 */
public record JoinGameRequestDTO(
        String ticketCode,
        String studentName){}