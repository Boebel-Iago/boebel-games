package com.boebel.api.controller;

import com.boebel.api.dto.JoinGameRequestDTO;
import com.boebel.api.dto.ProgressUpdateRequestDTO;
import com.boebel.api.dto.StudentSessionDTO;
import com.boebel.api.dto.TicketRequestDTO;
import com.boebel.api.dto.TicketResponseDTO;
import com.boebel.api.model.AccessTicket;
import com.boebel.api.model.StudentSession;
import com.boebel.api.model.Teacher;
import com.boebel.api.repository.AccessTicketRepository;
import com.boebel.api.repository.StudentSessionRepository;
import com.boebel.api.repository.TeacherRepository;
import com.boebel.api.service.AccessTicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Controlador principal responsável pela gestão de ingressos de acesso e sessões de alunos.
 * Engloba rotas protegidas para professores (criação, edição e exclusão de ingressos) 
 * e rotas públicas para os alunos (acesso ao jogo e atualização de progresso).
 */
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
@Tags({
    @Tag(name = "Ingressos - Professor", description = "Endpoints protegidos por JWT para gestão de ingressos de turma"),
    @Tag(name = "Sessões - Aluno", description = "Endpoints públicos (sem JWT) para acesso e progresso dos alunos")
})
public class AccessTicketController {

    private final AccessTicketService accessTicketService;
    private final TeacherRepository teacherRepository;
    private final StudentSessionRepository studentSessionRepository;
    private final AccessTicketRepository accessTicketRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Cria um novo ingresso (sala) para um jogo.
     * Gera um código de 6 dígitos único para que os alunos possam acessar.
     *
     * @param ticketRequestDTO Dados necessários para a criação do ingresso, como o ID do jogo e configurações.
     * @param principal O usuário (professor) autenticado que está realizando a requisição.
     * @return Os dados do ingresso criado, incluindo o código gerado.
     */
    @Operation(summary = "Criar novo ingresso", description = "Gera um ingresso (sala) com um código de acesso para os alunos.", tags = {"Ingressos - Professor"})
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Ingresso criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou erro de negócio")
    })
    @PostMapping
    public ResponseEntity<?> createTicket(
            @Parameter(description = "Dados do novo ingresso a ser criado") @RequestBody TicketRequestDTO ticketRequestDTO, 
            @Parameter(hidden = true) Principal principal) {
        try {
            String email = principal.getName();
            Teacher teacher = teacherRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Teacher not found"));

            TicketResponseDTO ticketResponseDTO = accessTicketService.generateTicket(teacher, ticketRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(ticketResponseDTO);

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Retorna a lista de ingressos ativos de um professor.
     *
     * @param principal O usuário (professor) autenticado que está realizando a requisição.
     * @return Lista com os dados resumidos dos ingressos atualmente ativos para o professor.
     */
    @Operation(summary = "Listar ingressos ativos", description = "Busca todos os ingressos atualmente ativos pertencentes ao professor logado.", tags = {"Ingressos - Professor"})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de ingressos retornada com sucesso")
    })
    @GetMapping("/active")
    public ResponseEntity<List<TicketResponseDTO>> getActiveTickets(@Parameter(hidden = true) Principal principal) {
        String email = principal.getName();
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        List<TicketResponseDTO> tickets = accessTicketService.getActiveTicketsForTeacher(teacher);
        return ResponseEntity.ok(tickets);
    }

    /**
     * Retorna as sessões de alunos atreladas a um ingresso específico.
     * O professor deve ser o dono do ingresso para ter permissão.
     *
     * @param ticketCode Código do ingresso a ser consultado.
     * @param principal O usuário (professor) autenticado.
     * @return Uma lista de sessões de alunos contendo o progresso no jogo.
     */
    @Operation(summary = "Listar sessões de um ingresso", description = "Recupera todas as sessões e progressos dos alunos logados em um determinado ingresso/sala.", tags = {"Ingressos - Professor"})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sessões retornadas com sucesso"),
            @ApiResponse(responseCode = "403", description = "Sem permissão para ver estas sessões"),
            @ApiResponse(responseCode = "404", description = "Ingresso não encontrado")
    })
    @GetMapping("/{ticketCode}/sessions")
    public ResponseEntity<List<StudentSessionDTO>> getSessionsByTicket(
            @Parameter(description = "O código de acesso do ingresso") @PathVariable String ticketCode, 
            @Parameter(hidden = true) Principal principal) {
        String email = principal.getName();
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Verify if teacher owns this ticket
        AccessTicket ticket = accessTicketRepository.findByCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Ingresso não encontrado"));
                
        if (!ticket.getTeacher().getUuid().equals(teacher.getUuid())) {
             throw new SecurityException("Sem permissão para ver estas sessões.");
        }

        List<StudentSessionDTO> sessions = studentSessionRepository.findByTicketCode(ticket.getCode())
                .stream()
                .map(s -> new StudentSessionDTO(s.getId(), s.getStudentName(), s.getGameRoute(),
                        s.getCurrentStage(), s.getTotalMistakes(), s.isCompleted(), s.getStartedAt()))
                .toList();

        return ResponseEntity.ok(sessions);
    }

    /**
     * Valida um código de ingresso e permite a entrada de um aluno.
     * Retorna a sessão criada ou recuperada para que o aluno possa (re)iniciar de onde parou.
     *
     * @param request Dados enviados pelo aluno, contendo o nome e o código de ingresso.
     * @return Os dados da sessão, como ID, rota do jogo e fase atual.
     */
    @Operation(summary = "Validar ingresso e ingressar no jogo", description = "Valida o código informado pelo aluno. Se válido e com vagas, cria uma nova sessão anônima, ou retoma uma já existente com o mesmo nome. Além disso, transmite via WebSocket a atualização de status para o professor.", tags = {"Sessões - Aluno"})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Acesso concedido e sessão retornada"),
            @ApiResponse(responseCode = "403", description = "Acesso negado (sala pausada, expirada, cheia ou código inválido)")
    })
    @PostMapping("/validate")
    public ResponseEntity<?> validateTicketAndJoin(@Parameter(description = "Requisição contendo nome do aluno e código do ingresso") @RequestBody JoinGameRequestDTO request) {

        AccessTicket ticket = accessTicketRepository.findByCode(request.ticketCode())
                .orElseThrow(() -> new RuntimeException("Código inválido ou não encontrado!"));

        // SECURITY: Check if ticket is paused or expired BEFORE allowing any access (even for returning students)
        if (!ticket.getIsActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Esta sala está pausada pelo professor! Aguarde a reativação."));
        }
        if (ticket.getExpirationDate().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Este ingresso já expirou!"));
        }

        // Normaliza o nome para evitar problemas de maiúsculas/minúsculas na busca
        String normalizedName = request.studentName().trim().toUpperCase();

        // Check if session already exists for this student + ticket (allows resume)
        StudentSession session = studentSessionRepository
                .findByStudentNameAndTicketCode(normalizedName, ticket.getCode())
                .orElse(null);

        if (session != null) {
            // Returning student — reuse existing session without consuming a slot
            broadcastSessions(ticket.getCode());

            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", session.getId());
            response.put("gameRoute", session.getGameRoute());
            response.put("currentStage", session.getCurrentStage());
            return ResponseEntity.ok(response);
        }

        // New student — validate slot limit
        if (ticket.getCurrentUses() >= ticket.getMaxUses()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "A sala está cheia! Número máximo de alunos atingido."));
        }

        // Consume a slot
        ticket.setCurrentUses(ticket.getCurrentUses() + 1);
        accessTicketRepository.save(ticket);

        // Create new session
        session = new StudentSession();
        session.setStudentName(normalizedName);
        session.setTicketCode(ticket.getCode());
        session.setGameRoute(ticket.getGame().getRoute());
        session = studentSessionRepository.save(session);

        // Broadcast updated sessions via WebSocket
        broadcastSessions(ticket.getCode());

        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", session.getId());
        response.put("gameRoute", session.getGameRoute());
        response.put("currentStage", session.getCurrentStage());

        return ResponseEntity.ok(response);
    }

    /**
     * Exclui um ingresso e todas as sessões de alunos a ele vinculadas.
     * 
     * @param id O identificador do ingresso a ser deletado.
     * @param principal O usuário (professor) logado.
     * @return Resposta sem conteúdo (204) em caso de sucesso.
     */
    @Operation(summary = "Excluir ingresso", description = "Deleta fisicamente um ingresso de turma e todas as sessões de alunos relacionadas. Apenas o professor dono do ingresso pode realizar esta ação.", tags = {"Ingressos - Professor"})
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Ingresso excluído com sucesso"),
            @ApiResponse(responseCode = "404", description = "Ingresso não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(
            @Parameter(description = "ID do ingresso") @PathVariable UUID id, 
            @Parameter(hidden = true) Principal principal) {
        String email = principal.getName();
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Get the ticket before deleting to clean up sessions
        AccessTicket ticket = accessTicketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Delete all student sessions associated with this ticket
        studentSessionRepository.deleteByTicketCode(ticket.getCode());

        accessTicketService.deleteTicket(id, teacher);
        return ResponseEntity.noContent().build();
    }

    /**
     * Estende a validade de um ingresso ativo adicionando horas extras.
     *
     * @param id O identificador do ingresso.
     * @param body Mapa contendo a chave 'additionalHours' com a quantidade de horas a serem adicionadas.
     * @param principal O usuário (professor) logado.
     * @return O ingresso atualizado com a nova data de expiração.
     */
    @Operation(summary = "Estender duração do ingresso", description = "Adiciona mais horas à validade do ingresso (padrão: 1 hora a mais). Apenas o dono pode fazer isso.", tags = {"Ingressos - Professor"})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Ingresso estendido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Ingresso não encontrado")
    })
    @PutMapping("/{id}/extend")
    public ResponseEntity<?> extendTicket(
            @Parameter(description = "ID do ingresso") @PathVariable UUID id,
            @Parameter(description = "Objeto JSON contendo 'additionalHours'") @RequestBody Map<String, Integer> body,
            @Parameter(hidden = true) Principal principal) {
        String email = principal.getName();
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        int additionalHours = body.getOrDefault("additionalHours", 1);
        TicketResponseDTO updated = accessTicketService.extendTicket(id, teacher, additionalHours);
        return ResponseEntity.ok(updated);
    }

    /**
     * Alterna o status (ativo/pausado) de um ingresso.
     *
     * @param id O identificador do ingresso.
     * @param principal O usuário (professor) logado.
     * @return O ingresso com o status atualizado.
     */
    @Operation(summary = "Pausar/Retomar ingresso", description = "Ativa ou pausa a entrada de alunos na sala (ingresso). Salas pausadas negam novos logins ou o progresso de sessões existentes.", tags = {"Ingressos - Professor"})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status do ingresso alterado com sucesso")
    })
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleTicketStatus(
            @Parameter(description = "ID do ingresso") @PathVariable UUID id, 
            @Parameter(hidden = true) Principal principal) {
        String email = principal.getName();
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        TicketResponseDTO updated = accessTicketService.toggleTicketStatus(id, teacher);
        return ResponseEntity.ok(updated);
    }

    // MODIFIED: Broadcast via WebSocket after updating progress
    
    /**
     * Verifica se a sessão do aluno ainda é de um ingresso ativo e válido.
     * Útil para proteções contra reload da página (F5) pelo aluno.
     *
     * @param sessionId O identificador da sessão anônima do aluno.
     * @return Confirmação de status válido ou uma mensagem de erro caso expirado/pausado.
     */
    @Operation(summary = "Checar status da sessão", description = "Verifica se a sessão do aluno ainda é permitida para continuar, conferindo a validade e status do ingresso pai.", tags = {"Sessões - Aluno"})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Sessão válida"),
            @ApiResponse(responseCode = "403", description = "Sessão ou ingresso inválido/pausado/expirado")
    })
    @GetMapping("/sessions/{sessionId}/status")
    public ResponseEntity<?> checkSessionStatus(
            @Parameter(description = "ID da sessão do aluno") @PathVariable UUID sessionId) {
        StudentSession session = studentSessionRepository.findById(sessionId).orElse(null);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Sessão não encontrada"));
        }

        AccessTicket ticket = accessTicketRepository.findByCode(session.getTicketCode()).orElse(null);
        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Ticket não encontrado"));
        }

        if (!ticket.getIsActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Sala pausada"));
        }

        if (ticket.getExpirationDate().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Sala expirada"));
        }

        return ResponseEntity.ok(Map.of("status", "valid"));
    }

    /**
     * Atualiza o progresso da sessão do aluno de acordo com o desempenho na fase do jogo.
     * Notifica os professores via WebSocket em tempo real.
     *
     * @param sessionId O ID da sessão do aluno.
     * @param request Dados contendo a fase atual e erros cometidos pelo aluno.
     * @return Resposta indicando sucesso sem conteúdo adicional.
     */
    @Operation(summary = "Atualizar progresso da sessão", description = "Salva o progresso de uma sessão do aluno (fase alcançada, número de erros cometidos) e dispara evento WebSocket para o dashboard do professor. O currentStage salva é 0-indexado.", tags = {"Sessões - Aluno"})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Progresso atualizado com sucesso e notificação disparada"),
            @ApiResponse(responseCode = "403", description = "Sessão inválida, pausada ou expirada")
    })
    @PutMapping("/sessions/{sessionId}/progress")
    public ResponseEntity<?> updateProgress(
            @Parameter(description = "ID da sessão do aluno") @PathVariable UUID sessionId,
            @Parameter(description = "Objeto contendo a próxima fase e erros cometidos no nível anterior") @RequestBody ProgressUpdateRequestDTO request) {

        StudentSession session = studentSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada!"));

        // Check if ticket is still active
        AccessTicket ticket = accessTicketRepository.findByCode(session.getTicketCode())
                .orElseThrow(() -> new RuntimeException("Ingresso não encontrado!"));

        if (!ticket.getIsActive()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Esta sala está pausada pelo professor!"));
        }
        if (ticket.getExpirationDate().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Este ingresso expirou!"));
        }

        session.setCurrentStage(request.nextStage());
        session.setTotalMistakes(session.getTotalMistakes() + request.mistakesInThisLevel());

        if (request.gameFinished()) {
            session.setCompleted(true);
        }

        studentSessionRepository.save(session);
        broadcastSessions(session.getTicketCode());

        return ResponseEntity.ok().build();
    }

    /**
     * Broadcasts the full list of sessions for a given ticket code to all
     * connected WebSocket clients subscribed to that topic.
     */
    private void broadcastSessions(String ticketCode) {
        List<StudentSessionDTO> sessions = studentSessionRepository.findByTicketCode(ticketCode)
                .stream()
                .map(s -> new StudentSessionDTO(s.getId(), s.getStudentName(), s.getGameRoute(),
                        s.getCurrentStage(), s.getTotalMistakes(), s.isCompleted(), s.getStartedAt()))
                .toList();
        messagingTemplate.convertAndSend("/topic/sessions/" + ticketCode, sessions);
    }
}