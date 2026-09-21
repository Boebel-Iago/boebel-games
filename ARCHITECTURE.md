# 🏗️ Boebel Games — Documentação de Arquitetura Técnica

> **Público-alvo**: Agentes de IA, desenvolvedores e mantenedores do projeto.
> **Última atualização**: 2026-09-21
> **Mantido por**: Iago (Boebel-Iago)

---

## Índice

1. [Visão Geral do Projeto](#1-visão-geral-do-projeto)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Estrutura de Diretórios](#3-estrutura-de-diretórios)
4. [Arquitetura de Alto Nível](#4-arquitetura-de-alto-nível)
5. [Backend (Java / Spring Boot)](#5-backend-java--spring-boot)
6. [Frontend (Angular)](#6-frontend-angular)
7. [Modelo de Segurança e Autenticação](#7-modelo-de-segurança-e-autenticação)
8. [WebSocket e Telemetria em Tempo Real](#8-websocket-e-telemetria-em-tempo-real)
9. [Banco de Dados](#9-banco-de-dados)
10. [Infraestrutura e Deploy (Docker + AWS EC2)](#10-infraestrutura-e-deploy-docker--aws-ec2)
11. [Convenções de Código e Git](#11-convenções-de-código-e-git)
12. [Regras Críticas para Agentes de IA](#12-regras-críticas-para-agentes-de-ia)
13. [Catálogo de Jogos Educacionais](#13-catálogo-de-jogos-educacionais)
14. [Erros Conhecidos e Lições Aprendidas](#14-erros-conhecidos-e-lições-aprendidas)

---

## 1. Visão Geral do Projeto

**Boebel Games** é uma plataforma web gamificada de **Cidadania e Alfabetização Digital** para a Educação Básica pública (1º ao 5º ano do Ensino Fundamental), alinhada à BNCC (Base Nacional Comum Curricular).

### Problema que resolve
- Falta de ferramentas de cultura digital acessíveis para escolas públicas
- Jogos educacionais com baixa retenção (alunos finalizam em 10 minutos)
- Plataformas que coletam dados sensíveis de crianças violando a LGPD

### Diferenciais
- **Privacy by Design**: Zero PII (Personally Identifiable Information). Nenhum e-mail, CPF ou senha de estudante é armazenado. O acesso é via Tickets Efêmeros (UUID temporário)
- **Jogos Narrativos de Longa Duração**: Cada jogo foi projetado para durar entre 1h e 1h30, com trilha narrativa, mentores virtuais e dificuldade escalonada
- **Arquitetura Híbrida de Custo**: REST stateless para alunos + WebSocket exclusivo para o professor, minimizando custos em EC2
- **Licença**: MIT (Copyright 2026 Boebel-Iago)

---

## 2. Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| **Backend** | Java (Eclipse Temurin) | 21 |
| **Framework Backend** | Spring Boot | 4.1.0 |
| **ORM** | Hibernate ORM | 7.4.1.Final |
| **Servidor Embarcado** | Apache Tomcat | 11.0.22 |
| **Banco de Dados** | PostgreSQL | 16 (prod) / 15 (local) |
| **Frontend** | Angular (Standalone Components) | 17.3.0 |
| **CSS** | Tailwind CSS | 3.4.19 |
| **Linguagem Frontend** | TypeScript | ~5.4.2 |
| **Node.js** | Node (Alpine) | 20 |
| **Programação Visual** | Blockly | 13.3.0 |
| **PDF** | jsPDF + jspdf-autotable | 2.5.2 / 3.8.4 |
| **WebSocket Client** | @stomp/stompjs | 7.0.0 |
| **JWT** | com.auth0:java-jwt | 4.4.0 |
| **Build Backend** | Maven | 3.9 |
| **Reverse Proxy** | Nginx (Alpine) | latest |
| **Containerização** | Docker + Docker Compose | 3.8 |
| **Cloud** | AWS EC2 | Ubuntu AMI |

---

## 3. Estrutura de Diretórios

```
boebel-games/
├── api/                              # Backend Spring Boot
│   ├── Dockerfile                    # Multi-stage: Maven build → JRE runtime
│   ├── pom.xml                       # Dependências Maven
│   └── src/main/java/com/boebel/api/
│       ├── ApiApplication.java       # Entry point (@SpringBootApplication)
│       ├── config/
│       │   ├── SecurityConfig.java   # Spring Security (CORS, JWT filter, rotas públicas)
│       │   └── WebSocketConfig.java  # STOMP/SockJS sobre WebSocket
│       ├── controller/
│       │   ├── AccessTicketController.java  # Tickets, Sessões, Progresso
│       │   ├── AuthenticationController.java # Login JWT
│       │   └── GameController.java          # Catálogo de jogos por ano
│       ├── dto/                      # Data Transfer Objects (Records)
│       │   ├── AuthenticationDTO.java
│       │   ├── JoinGameRequestDTO.java
│       │   ├── LoginResponseDTO.java
│       │   ├── ProgressUpdateRequestDTO.java
│       │   ├── StudentSessionDTO.java
│       │   ├── TicketRequestDTO.java
│       │   └── TicketResponseDTO.java
│       ├── filter/
│       │   └── SecurityFilter.java   # Intercepta requests, valida Bearer JWT
│       ├── model/
│       │   ├── AccessTicket.java     # Ingresso da turma (UUID, código, validade)
│       │   ├── Game.java             # Jogo cadastrado (rota, anos permitidos)
│       │   ├── StudentSession.java   # Sessão anônima do aluno
│       │   └── Teacher.java          # Professor (implements UserDetails)
│       ├── repository/               # Spring Data JPA Interfaces
│       │   ├── AccessTicketRepository.java
│       │   ├── GameRepository.java
│       │   ├── StudentSessionRepository.java
│       │   └── TeacherRepository.java
│       ├── seeder/
│       │   └── DatabaseSeeder.java   # Seed do admin e catálogo de jogos
│       └── service/
│           ├── AccessTicketService.java   # Lógica de negócio dos tickets
│           ├── AuthorizationService.java  # UserDetailsService (carrega Teacher)
│           ├── GameService.java           # Consulta jogos por ano
│           └── TokenService.java          # Geração/validação JWT HMAC256
│
├── frontend/                         # Frontend Angular 17
│   ├── Dockerfile                    # Multi-stage: Node build → Nginx runtime
│   ├── package.json
│   ├── angular.json
│   └── src/app/
│       ├── app.routes.ts             # Todas as rotas (públicas, protegidas, admin)
│       ├── app.config.ts             # Providers globais (interceptor, HttpClient)
│       ├── core/
│       │   ├── guards/
│       │   │   ├── admin.guard.ts    # Verifica JWT no localStorage
│       │   │   └── ticket.guard.ts   # Valida sessão do aluno via API
│       │   ├── interceptors/
│       │   │   └── auth.interceptor.ts # Intercepta 401/403 (ignora rotas do aluno)
│       │   ├── pipes/
│       │   │   └── safe-url.pipe.ts
│       │   └── services/
│       │       ├── auth.service.ts           # Login/logout do professor
│       │       ├── game.service.ts           # Atualiza progresso do aluno
│       │       ├── progress-reporter.service.ts # Abstração de telemetria
│       │       └── ticket.service.ts         # CRUD de tickets + validação
│       └── features/
│           ├── admin/dashboard/      # Painel do professor (WebSocket, PDF, gestão)
│           ├── auth/login/           # Login do professor (JWT)
│           ├── student-login/        # Tela inicial do aluno (nome + código)
│           ├── public/free-games/    # Jogos gratuitos (sem banco de dados)
│           └── games/                # 7 jogos educacionais
│               ├── browser-search/   # Cyber Exploradores (3º ano)
│               ├── creators-vs-copiers/ # Criadores vs Copiadores
│               ├── emergency-escape/ # Fuga de Emergência (Blockly)
│               ├── fact-checker/     # Detetives Digitais (4º/5º ano)
│               ├── pixel-art/       # Arte Digital (coordenadas)
│               ├── professions/      # Profissões e Tecnologia
│               └── sea-turtles/      # Corrida das Tartarugas (algoritmos)
│
├── infra/
│   ├── docker-compose.yml           # Compose local (PostgreSQL standalone)
│   └── schema.sql                   # DDL + seed inicial do banco
│
├── docker-compose.yml               # Compose de produção (3 serviços)
├── .gitignore
├── LICENSE                           # MIT
└── README.md
```

---

## 4. Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                        AWS EC2 (Ubuntu)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Docker Compose (3 serviços)                 │   │
│  │                                                          │   │
│  │  ┌─────────────────┐    ┌─────────────────┐             │   │
│  │  │   frontend:80   │───►│  backend:8080   │             │   │
│  │  │  (Nginx + SPA)  │    │ (Spring Boot)   │             │   │
│  │  │                 │    │                  │             │   │
│  │  │  • Angular 17   │    │  • Java 21       │             │   │
│  │  │  • Tailwind     │    │  • REST API      │             │   │
│  │  │  • Proxy /api/  │    │  • WebSocket     │             │   │
│  │  └─────────────────┘    │  • JWT Auth      │             │   │
│  │                         └────────┬─────────┘             │   │
│  │                                  │                       │   │
│  │                         ┌────────▼─────────┐             │   │
│  │                         │  postgres:5432   │             │   │
│  │                         │  (PostgreSQL 16) │             │   │
│  │                         │  Volume: pgdata  │             │   │
│  │                         └──────────────────┘             │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

Fluxo de Dados:
  Aluno (Browser) ──REST──► Nginx :80 ──proxy──► Spring :8080 ──JPA──► PostgreSQL
  Professor (Browser) ──WebSocket──► Nginx :80 ──proxy──► Spring :8080 (STOMP)
```

### Decisão Arquitetural: REST vs WebSocket

| Ator | Protocolo | Justificativa |
|------|-----------|---------------|
| **Alunos (40+ por turma)** | REST Stateless | Cada envio de progresso é uma requisição HTTP isolada. Não mantém conexão aberta. Econômico em memória. |
| **Professor (1 por turma)** | WebSocket/STOMP | Precisa receber atualizações em tempo real de todos os alunos. Mantém 1 conexão bidirecional persistente. |

**Motivo**: Manter 40 WebSockets abertos por sala (com 10 turmas = 400 conexões) esgotaria a memória de um EC2 de baixo custo. Com REST para alunos, a infraestrutura escala com custo mínimo.

---

## 5. Backend (Java / Spring Boot)

### 5.1 Entidades (Models)

#### `AccessTicket` — Ingresso da Turma
```java
@Entity @Table(name = "access_tickets")
UUID uuid           // @Id — Chave primária UUID
String code         // Código alfanumérico único (10 caracteres) que o aluno digita
Integer maxUses     // Máximo de alunos permitidos
Integer currentUses // Slots consumidos (default 0)
LocalDateTime expirationDate  // Data/hora de expiração
Boolean isActive    // Se o professor pausou a sala (default true)
LocalDateTime pausedAt        // Timestamp de quando foi pausado (para compensação)
String grade        // Ano escolar ("ELEMENTARY_3", etc.)
Game game           // @ManyToOne — Jogo associado
Teacher teacher     // @ManyToOne — Professor dono
```

#### `Game` — Jogo Cadastrado
```java
@Entity @Table(name = "games")
Long id             // @Id — Auto-incrementado
String title        // Nome visível ("Detetives Digitais")
String description  // Descrição pedagógica
String route        // Rota Angular ("fact-checker") — UNIQUE
List<String> allowedGrades // @ElementCollection — Anos escolares permitidos
```

#### `StudentSession` — Sessão Anônima do Aluno
```java
@Entity @Table(name = "student_sessions")
UUID id             // @Id — Gerado automaticamente
String studentName  // Apenas o primeiro nome (sem sobrenome, sem cadastro)
String ticketCode   // Código do ticket que o aluno usou
String gameRoute    // Rota do jogo (ex: "pixel-art")
int currentStage    // Fase atual (0-indexed no banco)
int totalMistakes   // Erros acumulados
boolean completed   // Se finalizou o jogo
LocalDateTime startedAt // Timestamp de início
```

#### `Teacher` — Professor (implements UserDetails)
```java
@Entity @Table(name = "teachers")
UUID uuid           // @Id
String name
String email        // UNIQUE — usado como username no Spring Security
String password     // BCrypt hash
Boolean isActive    // default true
// Retorna authority "ROLE_ADMIN"
```

### 5.2 DTOs (Data Transfer Objects)

| DTO | Campos | Uso |
|-----|--------|-----|
| `AuthenticationDTO` | `email`, `password` | Login do professor |
| `JoinGameRequestDTO` | `ticketCode`, `studentName` | Aluno entrando na sala |
| `LoginResponseDTO` | `token` | Retorno do JWT |
| `ProgressUpdateRequestDTO` | `nextStage`, `mistakesInThisLevel`, `gameFinished` | Atualização de progresso |
| `StudentSessionDTO` | `id`, `studentName`, `gameRoute`, `currentStage`, `totalMistakes`, `completed`, `startedAt` | Visualização no dashboard |
| `TicketRequestDTO` | `maxUses`, `expirationHours`, `grade`, `gameId` | Criação de ticket |
| `TicketResponseDTO` | `id`, `code`, `grade`, `gameTitle`, `gameRoute`, `maxUses`, `remainingUses`, `expirationHours`, `expirationDate`, `isActive` | Dados do ticket para o professor |

### 5.3 Repositories (Spring Data JPA)

| Repository | Custom Methods |
|-----------|----------------|
| `AccessTicketRepository` | `countByTeacher(Teacher)`, `findAllByTeacher(Teacher)`, `findByCode(String)` |
| `GameRepository` | `findByAllowedGrades(String)`, `findDistinctGradesWithGames()` (JPQL) |
| `StudentSessionRepository` | `findByTicketCode(String)`, `findByStudentNameAndTicketCode(String, String)`, `deleteByTicketCode(String)` (@Transactional) |
| `TeacherRepository` | `findByEmail(String)` |

### 5.4 Services

#### `AccessTicketService`
- **`generateTicket()`**: Cria ticket com código aleatório. Limite de 20 tickets ativos por professor.
- **`toggleTicketStatus()`**: Pausa/despausa a sala. **Algoritmo de Compensação Temporal**: ao pausar, salva `pausedAt = LocalDateTime.now()`. Ao despausar, calcula `Duration.between(pausedAt, now)` e estende `expirationDate` pelo mesmo intervalo.
- **`extendTicket()`**: Adiciona horas à expiração.
- **`cleanupExpired()`**: Remove tickets expirados automaticamente quando o professor consulta a lista.

#### `TokenService`
- Gera JWT com algoritmo `HMAC256`, expiração de **2 horas**, issuer "boebel-games-api".
- Subject é o `email` do professor.

#### `AuthorizationService`
- Implementa `UserDetailsService`. Carrega `Teacher` pelo email.

### 5.5 Controllers

#### `AccessTicketController` — `@RequestMapping("/api/tickets")`

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `POST` | `/` | 🔒 JWT | Cria ticket (professor) |
| `GET` | `/active` | 🔒 JWT | Lista tickets ativos do professor |
| `GET` | `/{ticketCode}/sessions` | 🔒 JWT | Lista alunos de um ticket |
| `POST` | `/validate` | 🌐 Público | Aluno entra na sala (cria ou reutiliza sessão) |
| `DELETE` | `/{id}` | 🔒 JWT | Deleta ticket e todas as sessões |
| `PUT` | `/{id}/extend` | 🔒 JWT | Estende validade do ticket |
| `PUT` | `/{id}/toggle-status` | 🔒 JWT | Pausa/despausa ticket |
| `GET` | `/sessions/{sessionId}/status` | 🌐 Público | Verifica se sessão ainda é válida |
| `PUT` | `/sessions/{sessionId}/progress` | 🌐 Público | Atualiza progresso do aluno |

#### `AuthenticationController` — `@RequestMapping("/api/auth")`

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `POST` | `/login` | 🌐 Público | Autentica professor, retorna JWT |

#### `GameController` — `@RequestMapping("/api")`

| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| `GET` | `/grades/available` | 🔒 JWT | Anos escolares com jogos cadastrados |
| `GET` | `/games?grade=X` | 🔒 JWT | Jogos filtrados por ano |

---

## 6. Frontend (Angular)

### 6.1 Rotas (`app.routes.ts`)

#### Rotas Públicas (Demonstração)
| Rota | Componente | Providers |
|------|-----------|-----------|
| `/free` | `FreeGamesComponent` | — |
| `/free/sea-turtles` | `SeaTurtlesComponent` | `MockProgressReporter`, `LocalPhaseRepositoryService` |
| `/free/emergency-escape` | `EmergencyEscapeComponent` | `MockProgressReporter`, `LocalLevelRepositoryService` |

> **MockProgressReporter**: Substitui o serviço de telemetria real por um `console.log`. Garante que jogos gratuitos **nunca** enviam dados ao banco.

#### Rotas Protegidas (Requerem Ticket)
| Rota | Componente | Guard |
|------|-----------|-------|
| `/games/sea-turtles` | `SeaTurtlesComponent` | `ticketGuard` |
| `/games/emergency-escape` | `EmergencyEscapeComponent` | `ticketGuard` |
| `/games/creators-vs-copiers` | `CreatorsVsCopiersComponent` | `ticketGuard` |
| `/games/fact-checker` | `FactCheckerComponent` | `ticketGuard` |
| `/games/pixel-art` | `PixelArtComponent` | `ticketGuard` |
| `/games/professions` | `ProfessionsComponent` | `ticketGuard` |
| `/games/browser-search` | `BrowserSearchComponent` | `ticketGuard` |

#### Rotas Administrativas
| Rota | Componente | Guard |
|------|-----------|-------|
| `/` | `StudentLoginComponent` | — |
| `/login` | `LoginComponent` | — |
| `/admin/dashboard` | `DashboardComponent` | `adminGuard` |

### 6.2 Services

#### `AuthService`
- `login(email, password)` → `POST /api/auth/login` → salva JWT em `localStorage`
- `logout()` → remove JWT do `localStorage`
- `getToken()` → retorna JWT
- `isLoggedIn()` → verifica se token existe

#### `TicketService`
- `validateTicket(payload)` → `POST /api/tickets/validate` (aluno entra na sala)
- `checkSessionStatus(sessionId)` → `GET /api/tickets/sessions/{sessionId}/status`
- `generateTicket(data)` → `POST /api/tickets`
- `getActiveTickets()` → `GET /api/tickets/active`
- `deleteTicket(id)` → `DELETE /api/tickets/{id}`
- `extendTicket(id, hours)` → `PUT /api/tickets/{id}/extend`
- `toggleTicketStatus(id)` → `PUT /api/tickets/{id}/toggle-status`
- `getSessionsByTicket(code)` → `GET /api/tickets/{code}/sessions`
- `getAvailableGrades()` → `GET /api/grades/available`
- `getGamesByGrade(grade)` → `GET /api/games?grade={grade}`

#### `GameService`
- `updateGameProgress(sessionId, nextStage, mistakes, isFinished)` → `PUT /api/tickets/sessions/{sessionId}/progress`
- Se o backend retornar `403`, exibe alerta ao aluno, limpa `sessionStorage` e redireciona para `/`

#### `ProgressReporterService` (Abstração de Telemetria)
- `report(data: ProgressData)`: Se `result === 'failure'`, incrementa contador local de erros. Se `result === 'success'`, chama `GameService.updateGameProgress` com `nextStage`, `totalMistakes` e flag `isLastLevel`, depois reseta o contador e atualiza `currentStage` no `sessionStorage`.

### 6.3 Guards

#### `ticketGuard` (Protege rotas `/games/*`)
1. Se o professor tem JWT **e** a URL contém `demo=1` → libera (modo demonstração)
2. Se `isDemoMode === 'true'` no `sessionStorage` → libera (persistência do demo)
3. Verifica se `activeGameRoute` e `sessionId` existem no `sessionStorage`
4. Verifica se a rota acessada corresponde à rota liberada
5. **Validação server-side**: Chama `GET /api/tickets/sessions/{sessionId}/status`
   - `200 OK` → libera
   - `403 Forbidden` → limpa `sessionStorage`, redireciona para `/`

#### `adminGuard` (Protege `/admin/dashboard`)
- Verifica se `jwt_token` existe no `localStorage`. Se não, redireciona para `/login`.

### 6.4 Interceptor (`authInterceptor`)

Intercepta **todas** as respostas HTTP. Se o servidor retornar `401` ou `403`:
- **Se a URL contém `/sessions/` ou `/validate`** → **NÃO FAZ NADA** (deixa o Guard do aluno tratar)
- **Se é qualquer outra URL** → Assume que o JWT do professor expirou → `authService.logout()` → redireciona para `/login`

> ⚠️ **REGRA CRÍTICA**: O interceptor DEVE ignorar endpoints de aluno. Caso contrário, qualquer 403 de ticket expirado jogará o aluno na tela de login do professor.

### 6.5 Armazenamento Local

| Storage | Chave | Valor | Usado por |
|---------|-------|-------|-----------|
| `localStorage` | `jwt_token` | JWT do professor | `AuthService`, `adminGuard` |
| `sessionStorage` | `activeGameRoute` | Rota do jogo (ex: "pixel-art") | `ticketGuard` |
| `sessionStorage` | `sessionId` | UUID da sessão do aluno | `ticketGuard`, `GameService` |
| `sessionStorage` | `studentName` | Primeiro nome do aluno | Jogos |
| `sessionStorage` | `currentStage` | Fase atual (atualizada a cada progresso) | `ProgressReporter` |
| `sessionStorage` | `isDemoMode` | `"true"` se o professor está testando | `ticketGuard` |
| `sessionStorage` | `adminSelectedTicket` | Código do ticket sendo monitorado | Dashboard (persistência F5) |

---

## 7. Modelo de Segurança e Autenticação

### 7.1 Fluxo do Professor (JWT)

```
Professor → POST /api/auth/login (email, password)
         → Backend valida com BCrypt
         → Retorna JWT (HMAC256, 2h expiração)
         → Frontend salva em localStorage
         → Requisições subsequentes incluem header: Authorization: Bearer <token>
         → SecurityFilter intercepta, valida assinatura, extrai email, popula SecurityContext
```

### 7.2 Fluxo do Aluno (Ticket Efêmero — Zero PII)

```
Aluno → Digita Nome + Código na tela inicial
      → POST /api/tickets/validate (público, sem JWT)
      → Backend busca ticket pelo código
      → Verifica: isActive? expirationDate > now? currentUses < maxUses?
      → Cria StudentSession (ou reutiliza se mesmo nome+código)
      → Retorna: { sessionId, gameRoute, currentStage }
      → Frontend salva no sessionStorage
      → Router navega para /games/{gameRoute}
      → ticketGuard intercepta e chama GET /sessions/{sessionId}/status
      → Backend confirma que ticket ainda é válido → Libera
```

### 7.3 Spring Security — Rotas Públicas (`permitAll`)

```java
.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
.requestMatchers(HttpMethod.GET, "/api/tickets/validate/**").permitAll()
.requestMatchers(HttpMethod.POST, "/api/tickets/validate").permitAll()
.requestMatchers("/api/tickets/sessions/**").permitAll()    // ← TUDO sob /sessions/ é público
.requestMatchers("/ws/**").permitAll()                       // ← WebSocket
.anyRequest().authenticated()                                // ← Todo o resto exige JWT
```

> ⚠️ **ATENÇÃO**: Ao adicionar novos endpoints para o aluno, eles DEVEM ficar sob `/api/tickets/sessions/`. Se ficarem fora, o Spring Security exigirá JWT e o aluno receberá 403.

### 7.4 CORS

```java
Origens permitidas: ["http://localhost:4200", "http://13.58.205.20"]
Métodos: GET, POST, PUT, DELETE, OPTIONS
Headers: * (todos)
CSRF: Desabilitado
Sessões HTTP: STATELESS
```

---

## 8. WebSocket e Telemetria em Tempo Real

### 8.1 Configuração (Server-side)

```java
// WebSocketConfig.java
Endpoint: /ws (com SockJS fallback)
Message Broker: /topic (SimpleBroker)
Application Prefix: /app
Allowed Origins: http://localhost:4200
```

### 8.2 Fluxo de Broadcast

1. Aluno envia progresso → `PUT /api/tickets/sessions/{id}/progress`
2. Controller atualiza `StudentSession` no banco
3. Controller chama `broadcastSessions(ticketCode)`
4. `SimpMessagingTemplate` envia `List<StudentSessionDTO>` para `/topic/sessions/{ticketCode}`
5. Dashboard do professor (inscrito nesse tópico via STOMP) recebe a lista atualizada em tempo real

### 8.3 Conexão no Frontend (Dashboard)

```typescript
// Usa @stomp/stompjs
const client = new Client({
  brokerURL: `ws://${location.host}/ws`,
  // ...
});
client.subscribe(`/topic/sessions/${ticketCode}`, (message) => {
  this.sessions = JSON.parse(message.body);
});
```

---

## 9. Banco de Dados

### 9.1 Configuração

| Propriedade | Valor |
|-------------|-------|
| SGBD | PostgreSQL |
| Database | `boebelgames` |
| Porta | 5432 |
| Driver | `org.postgresql.Driver` |
| DDL Auto | `update` (Hibernate cria/altera colunas automaticamente) |
| Dialect | `PostgreSQLDialect` |

### 9.2 Tabelas

```
teachers
├── uuid (PK, UUID)
├── name (VARCHAR)
├── email (VARCHAR, UNIQUE)
├── password (VARCHAR, BCrypt)
└── is_active (BOOLEAN)

games
├── id (BIGSERIAL, PK)
├── title (VARCHAR)
├── description (VARCHAR)
└── route (VARCHAR, UNIQUE)

game_allowed_grades
├── game_id (FK → games.id)
└── allowed_grades (VARCHAR) — ex: "ELEMENTARY_3"

access_tickets
├── uuid (PK, UUID)
├── code (VARCHAR(10), UNIQUE)
├── max_uses (INTEGER)
├── current_uses (INTEGER)
├── expiration_date (TIMESTAMP)
├── is_active (BOOLEAN)
├── paused_at (TIMESTAMP, nullable)
├── grade (VARCHAR)
├── game_id (FK → games.id)
└── teacher_uuid (FK → teachers.uuid)

student_sessions
├── id (PK, UUID)
├── student_name (VARCHAR)
├── ticket_code (VARCHAR)
├── game_route (VARCHAR)
├── current_stage (INTEGER)
├── total_mistakes (INTEGER)
├── completed (BOOLEAN)
└── started_at (TIMESTAMP)
```

### 9.3 Variáveis de Ambiente (`.env`)

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/boebelgames
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=<senha>
APP_ADMIN_EMAIL=<email-do-admin>
APP_ADMIN_PASSWORD=<senha-do-admin>
APP_SECURITY_TOKEN_SECRET=<segredo-jwt>
```

---

## 10. Infraestrutura e Deploy (Docker + AWS EC2)

### 10.1 Docker Compose (Produção)

3 serviços orquestrados:

1. **`postgres`**: PostgreSQL 16, volume persistente `pgdata`, schema inicial via `infra/schema.sql`
2. **`backend`**: Multi-stage Dockerfile (Maven → JRE 21), porta 8080, depende do `postgres`
3. **`frontend`**: Multi-stage Dockerfile (Node 20 → Nginx), porta 80, depende do `backend`

### 10.2 Nginx como Reverse Proxy

O Nginx no container `frontend` serve dupla função:
- Serve os arquivos estáticos do Angular (SPA) em `/`
- Faz proxy reverso de `/api/` para `http://backend:8080`
- Usa `try_files $uri $uri/ /index.html` para suportar rotas do Angular (SPA routing)

### 10.3 Deploy na EC2

- **IP Público**: `13.58.205.20`
- **Usuário SSH**: `ubuntu` (AMI padrão)
- **Workflow**: `git pull origin main` → `docker compose up -d --build`
- **PDFs**: Armazenados em `/home/ubuntu/pdfs` (mapeado como volume do backend)
- **Porta 80**: Aberta para tráfego HTTP público

### 10.4 Ambiente de Produção Angular

```typescript
// frontend/src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiBaseUrl: '',  // URLs relativas — funciona automaticamente com Nginx reverse proxy
};
```

O `angular.json` substitui `environment.ts` (que aponta para `http://localhost:8080`) por `environment.prod.ts` durante o build de produção.

---

## 11. Convenções de Código e Git

### 11.1 Branching Strategy

| Prefixo | Uso | Exemplo |
|---------|-----|---------|
| `feat/` | Nova funcionalidade | `feat/browser-search-expansion` |
| `fix/` | Correção de bug | `fix/ticket-pause-timer` |
| `patch/` | Correção pontual | `patch/dashboard-stage-number` |

**Workflow**:
1. Criar branch a partir de `main`
2. Desenvolver e commitar na branch
3. Fazer merge na `main`
4. Push para `origin main`

> ⚠️ **REGRA**: NUNCA commitar diretamente na `main`. Sempre criar branch primeiro.

### 11.2 Conventional Commits

```
<type>(<scope>): <descrição imperativa em minúsculo>
```

**Tipos**:
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `refactor`: Refatoração sem alterar comportamento
- `docs`: Documentação
- `style`: Formatação
- `chore`: Tarefas de manutenção

**Exemplos reais**:
```
feat(browser-search): expand game duration to 1h30 with space exploration narrative
fix(backend): remove duplicated PutMapping annotation causing ambiguous mapping
fix(frontend): prevent auth interceptor from redirecting students to teacher login
fix(backend): allow public GET access to session status endpoint
```

### 11.3 Convenções de Código

#### Backend (Java)
- Usar Lombok (`@Builder`, `@RequiredArgsConstructor`, `@Data`) para reduzir boilerplate
- DTOs são Java Records
- UUIDs como chaves primárias (nunca auto-increment para entidades expostas ao cliente)
- `LocalDateTime` para todas as datas (nunca `java.util.Date`)
- Endpoints do aluno sempre sob `/api/tickets/sessions/`

#### Frontend (Angular)
- Standalone Components (sem NgModules)
- Tailwind CSS para estilização (sem CSS customizado quando possível)
- `sessionStorage` para dados voláteis do aluno
- `localStorage` apenas para JWT do professor
- RxJS pipes para tratamento de erros em Guards

---

## 12. Regras Críticas para Agentes de IA

> **LEIA ESTA SEÇÃO INTEIRA ANTES DE FAZER QUALQUER ALTERAÇÃO NO CÓDIGO.**

### 12.1 Branching (OBRIGATÓRIO)

```bash
# CORRETO:
git checkout -b feat/minha-feature
# ... desenvolve ...
git add . && git commit -m "feat(scope): descrição"
git checkout main && git merge feat/minha-feature
git push origin main

# ERRADO: Nunca commite direto na main
git checkout main
git commit -m "..."  # ❌ PROIBIDO
```

### 12.2 Segurança — Endpoints do Aluno

Se você criar um novo endpoint que o aluno (sem JWT) precisa acessar:
1. A rota DEVE ficar sob `/api/tickets/sessions/`
2. Ela já estará automaticamente liberada pelo `permitAll` no `SecurityConfig.java`
3. **NÃO** use `**` no meio de um path no Spring Security 6+ (ex: `/sessions/**/status`). Use `/**` apenas no final.
4. O `authInterceptor.ts` do Angular já ignora rotas contendo `/sessions/` e `/validate`

### 12.3 Progresso e Telemetria

Ao criar ou modificar um jogo:
- O `levelId` deve ser único por missão/tarefa (ex: `browser-search-m1-t2`)
- A `fase` (`nextStage`) deve ser um número absoluto crescente
- O `currentStage` no banco é **0-indexed**. No dashboard, exibimos **+1** para o professor
- O campo `gameFinished` deve ser `true` apenas na última fase do jogo
- Sempre use `ProgressReporterService.report()` — nunca chame `GameService` diretamente de dentro de um jogo

### 12.4 Jogos — Duração e Narrativa

- Cada jogo DEVE durar entre **1h e 1h30** em sala de aula
- Jogos devem ter **trilha narrativa** com um mentor virtual (personagem guia)
- Use o padrão `displayMode: 'briefing' | 'gameplay' | 'feedback'` como máquina de estados
- Mentores existentes: "Inspetor Lupa" (Detetives Digitais), "Robô T-B0T" (Cyber Exploradores)

### 12.5 Spring Security — Path Matchers

```java
// ✅ CORRETO — Curinga no final
.requestMatchers("/api/tickets/sessions/**").permitAll()

// ❌ ERRADO — Curinga no meio (Spring 6 rejeita)
.requestMatchers("/api/tickets/sessions/**/status").permitAll()

// ❌ ERRADO — Asterisco simples não casa UUIDs com hífens corretamente
.requestMatchers("/api/tickets/sessions/*/status").permitAll()
```

### 12.6 Interceptor do Angular — Não Quebrar

O `authInterceptor.ts` tem uma regra vital:
```typescript
const isStudentEndpoint = req.url.includes('/sessions/') || req.url.includes('/validate');
if ((error.status === 401 || error.status === 403) && !isStudentEndpoint) {
  // Só redireciona para /login se NÃO for endpoint do aluno
}
```
**Nunca remova essa verificação.** Sem ela, qualquer erro 403 de ticket expirado jogará o aluno na tela de login do professor.

### 12.7 Banco de Dados

- **DDL Auto é `update`**: O Hibernate cria/altera colunas automaticamente. Se adicionar um novo campo a uma `@Entity`, ele aparecerá no banco sem necessidade de migrations.
- **Cuidado com remoção de campos**: `update` NÃO remove colunas. Se precisar remover, faça manualmente no PostgreSQL.
- **Futuramente**: Migrar para `validate` + Flyway para controle seguro de schema.

### 12.8 CORS

Se o IP da EC2 mudar, atualizar em:
1. `SecurityConfig.java` → `corsConfiguration.setAllowedOrigins(...)`
2. `WebSocketConfig.java` → `setAllowedOrigins(...)` (se aplicável)

### 12.9 Diversidade Visual

Ao gerar imagens de personagens:
- Manter equilíbrio racial realista
- Personagens específicos que são negros: Médico/Doutora, Cientista, Piloto
- Outros personagens podem ser brancos para manter o equilíbrio
- Estilo: ilustração 2D cartoon colorida, kid-friendly

---

## 13. Catálogo de Jogos Educacionais

### 13.1 Detetives Digitais (`fact-checker`) — 4º/5º Ano

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Agência de Detetives Digitais |
| **Mentor** | Inspetor Lupa |
| **Model** | `DetectiveCase` com `AnatomyStage`, `PhishingStage`, `FactCheckStage` |
| **Estado** | `displayMode: 'briefing' \| 'gameplay' \| 'feedback'` |
| **Missões** | 4 casos: Anatomia de Notícias, Phishing/WhatsApp, Cruzamento de Fontes, Deepfakes/IA |
| **Duração** | ~1h30 |

### 13.2 Cyber Exploradores (`browser-search`) — 3º Ano

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Central de Comando Espacial |
| **Mentor** | Robô T-B0T |
| **Model** | `CyberMission` com `AnatomyTask` e `SearchTask` |
| **Estado** | `displayMode: 'briefing' \| 'gameplay' \| 'feedback'` |
| **Missões** | 4: Painel da Nave (navegador), Filtro de Palavras, Pesquisa Direcionada, Hacker do 3º Ano |
| **Duração** | ~1h30 |

### 13.3 Pixel Art (`pixel-art`)

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Pintar por coordenadas (estilo Batalha Naval) |
| **Model** | `Level` com paletas de cores e arrays `pattern` → grid 10x10 |
| **Estado** | Comparação de `studentGrid` com `targetGrid` |

### 13.4 Profissões (`professions`)

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Tecnologia nas Profissões (hardware/software) |
| **Model** | `Profession`, `Scenario`, `Phase3Item` |
| **Estado** | `gameStage`: 1 (Ferramentas), 2 (Cenários), 3 (Drag & Drop com Angular CDK) |

### 13.5 Criadores vs Copiadores (`creators-vs-copiers`)

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Copyright, Creative Commons e Plágio |
| **Model** | `LicenseTask` e `PlagiarismTask` |
| **Estado** | `gameStage` (1 ou 2), `showFeedbackModal` |

### 13.6 Fuga de Emergência (`emergency-escape`)

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Escape room com programação visual (Blockly) |
| **Model** | `LevelConfig`, `Grid`, `PlayerPos` |
| **Estado** | `screen: 'briefing' \| 'playing'` |
| **Especial** | Usa Blockly para programação em blocos. Avalia ticks do algoritmo. |

### 13.7 Corrida das Tartarugas (`sea-turtles`)

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Tartarugas marinhas + lógica/sequenciamento |
| **Model** | `PhaseRepository` com configs de mini-atividades |
| **Estado** | `screen: 'briefing' \| 'playing'` |
| **Especial** | Fisher-Yates shuffle balanceado com proteção anti-resolvido |

---

## 14. Erros Conhecidos e Lições Aprendidas

### 14.1 Bugs Já Corrigidos (Para Referência)

| Bug | Causa | Correção |
|-----|-------|----------|
| Tickets continuavam expirando quando pausados | `toggleTicketStatus` só mudava `isActive`, mas não congelava o tempo | Adicionado `pausedAt` + cálculo de `Duration.between()` para estender `expirationDate` |
| Aluno acessava jogo com ticket expirado via URL direta | Guard do Angular confiava apenas no `sessionStorage` local | Guard agora faz chamada ao backend (`/sessions/{id}/status`) |
| F5 no dashboard voltava para a lista de tickets | Estado do ticket selecionado se perdia no reload | Salvar `adminSelectedTicket` no `sessionStorage` |
| Fase mostrava 0 quando aluno estava na fase 1 | Backend usa 0-indexed, dashboard exibia sem offset | Dashboard exibe `currentStage + 1` |
| Aluno era redirecionado para login do professor ao ticket expirar | `authInterceptor` global capturava 403 de endpoints do aluno | Interceptor agora ignora URLs com `/sessions/` e `/validate` |
| `@PutMapping` duplicado impedia o backend de subir | Script de patch inseriu o `@GetMapping` sem remover a annotation anterior | Removida annotation duplicada |
| Spring Boot 3 rejeitava `/**/status` no meio do path | Spring 6 não permite `**` no meio de patterns | Usar `/**` apenas no final: `/api/tickets/sessions/**` |

### 14.2 Limitações Conhecidas

- **`ddl-auto: update`**: Funciona para MVP, mas não remove colunas. Em produção madura, migrar para Flyway.
- **CORS hardcoded**: Se o IP da EC2 mudar, é necessário atualizar `SecurityConfig.java` manualmente.
- **WebSocket Origins**: `WebSocketConfig.java` pode precisar do IP da EC2 nas origens permitidas.
- **Bundle Size**: O bundle inicial do Angular (`1.77 MB`) excede o budget de `1.46 MB`. Considerar lazy loading de módulos de jogos.
- **Sem HTTPS**: A EC2 opera em HTTP puro na porta 80. Para produção final, configurar certificado SSL (Let's Encrypt + Nginx).

---

> **Este documento deve ser atualizado sempre que houver mudanças arquiteturais significativas.**
> Última revisão: 2026-09-21 por Iago + Antigravity AI
