package com.boebel.api.config;

import com.boebel.api.filter.SecurityFilter;
import com.boebel.api.service.AuthorizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuração central de segurança da aplicação Boebel Games.
 *
 * <p>Define a cadeia de filtros HTTP, políticas de CORS, gerenciamento de sessão stateless
 * e as regras de autorização para cada grupo de endpoints.</p>
 *
 * <h3>Modelo de Segurança</h3>
 * <ul>
 *   <li><b>Professor</b>: Autenticação via JWT (Bearer Token) com BCrypt para senhas.</li>
 *   <li><b>Aluno</b>: Sem autenticação — acesso via ticket efêmero (Privacy by Design / LGPD Art. 14).</li>
 * </ul>
 *
 * <h3>Rotas Públicas (sem JWT)</h3>
 * <ul>
 *   <li>{@code POST /api/auth/login} — Login do professor</li>
 *   <li>{@code POST /api/tickets/validate} — Aluno entra na sala com código</li>
 *   <li>{@code /api/tickets/sessions/**} — Progresso e status da sessão do aluno</li>
 *   <li>{@code /ws/**} — WebSocket STOMP para telemetria em tempo real</li>
 *   <li>{@code /v3/api-docs/**, /swagger-ui/**} — Documentação OpenAPI / Swagger UI</li>
 * </ul>
 *
 * <h3>ATENÇÃO para desenvolvedores e agentes de IA</h3>
 * <p>Novos endpoints acessados por alunos (sem JWT) DEVEM ficar sob {@code /api/tickets/sessions/}.
 * Rotas fora desse prefixo exigirão JWT e retornarão 403 para o aluno.</p>
 *
 * @see SecurityFilter Filtro que intercepta e valida o Bearer Token JWT
 * @see AuthorizationService Serviço que carrega os dados do professor para autenticação
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AuthorizationService authorizationService;

    @Autowired
    private SecurityFilter securityFilter;

    public SecurityConfig(AuthorizationService authorizationService) {
        this.authorizationService = authorizationService;
    }

    /**
     * Configura a cadeia de filtros de segurança HTTP.
     *
     * <p>Ordem de processamento:</p>
     * <ol>
     *   <li>CORS — Permite origens do Angular dev server e da EC2 de produção</li>
     *   <li>CSRF desabilitado — API é stateless, sem cookies de sessão</li>
     *   <li>Sessão HTTP Stateless — Não armazena estado no servidor</li>
     *   <li>Regras de autorização — Rotas públicas vs autenticadas</li>
     *   <li>{@link SecurityFilter} — Intercepta Bearer Token antes do filtro padrão do Spring</li>
     * </ol>
     *
     * @param http Objeto de configuração do Spring Security
     * @return A cadeia de filtros configurada
     * @throws Exception Se houver erro na configuração
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors-> cors.configurationSource(request -> {
                    var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(java.util.List.of("http://localhost:4200", "http://13.58.205.20"));
                    corsConfiguration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(java.util.List.of("*"));
                    return corsConfiguration;
                }))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tickets/validate/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/tickets/validate").permitAll()
                        .requestMatchers("/api/tickets/sessions/**").permitAll()
                        .requestMatchers("/ws/**").permitAll()
                        // Swagger UI e OpenAPI docs — acesso público para documentação interativa
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .authenticationProvider(authenticationProvider());

        return http.build();
    }

    /**
     * Bean de codificação de senhas usando BCrypt.
     * Usado para hash das senhas dos professores no banco de dados.
     *
     * @return Encoder BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Bean do gerenciador de autenticação do Spring Security.
     *
     * @param authenticationConfiguration Configuração injetada automaticamente
     * @return O gerenciador de autenticação configurado
     * @throws Exception Se houver erro na configuração
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * Provedor de autenticação DAO que usa {@link AuthorizationService} para
     * carregar os dados do professor pelo email e {@link BCryptPasswordEncoder}
     * para verificar a senha.
     *
     * @return Provedor de autenticação configurado
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(authorizationService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }
}
