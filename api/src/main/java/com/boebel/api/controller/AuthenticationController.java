package com.boebel.api.controller;

import com.boebel.api.dto.AuthenticationDTO;
import com.boebel.api.dto.LoginResponseDTO;
import com.boebel.api.model.Teacher;
import com.boebel.api.service.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador responsável pela autenticação dos professores na plataforma.
 * Fornece endpoints para login e emissão de tokens JWT.
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação", description = "Login do professor com JWT")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthenticationController(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    /**
     * Realiza o login do professor no sistema.
     * Recebe as credenciais, valida e retorna um token JWT para acesso às rotas protegidas.
     *
     * @param authenticationDTO Objeto contendo o email e senha do professor.
     * @return O token JWT em caso de sucesso.
     */
    @Operation(summary = "Login do professor", description = "Autentica um professor usando email e senha, retornando um token JWT.", tags = {"Autenticação"})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login bem-sucedido, token retornado"),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Parameter(description = "Credenciais de acesso do professor") @RequestBody AuthenticationDTO authenticationDTO) {

        var usernamePassword = new UsernamePasswordAuthenticationToken(authenticationDTO.email(), authenticationDTO.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((Teacher) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(token));

    }

}
