package com.boebel.api.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.boebel.api.model.Teacher;
import org.hibernate.dialect.function.DB2SubstringFunction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

/**
 * Serviço encarregado da geração e validação de tokens JWT para autenticação dos professores.
 * Utiliza o algoritmo HMAC256 para assinar o token.
 */
@Service
public class TokenService {

    @Value("${app.security.token.secret}")
    private String secret;

    /**
     * Gera um novo token JWT para o professor autenticado.
     * O token possui validade de 2 horas e utiliza o ZoneOffset -03:00 (Brasil).
     * @param teacher o professor para o qual o token será gerado.
     * @return a string representando o token JWT gerado.
     * @throws RuntimeException caso ocorra um erro (JWTCreationException) durante a criação.
     */
    public String generateToken(Teacher teacher) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("boebel-games-api")
                    .withSubject(teacher.getEmail())
                    .withExpiresAt(genExpirationDate())
                    .sign(algorithm);
        } catch (JWTCreationException creationException) {
            throw new RuntimeException("Erro ao gerar token jwt", creationException);
        }
    }
    private Instant genExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }

}
