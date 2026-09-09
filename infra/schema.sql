-- 1. Criação da tabela de Professores (Independente)
CREATE TABLE teachers (
    uuid UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 2. Criação da tabela de Jogos (Independente)
CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY, -- BIGSERIAL faz o auto-incremento (GenerationType.IDENTITY)
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    route VARCHAR(255) NOT NULL UNIQUE
);

-- 3. Tabela auxiliar oculta gerada pelo @ElementCollection (Depende de Games)
CREATE TABLE game_allowed_grades (
    game_id BIGINT NOT NULL,
    grade_name VARCHAR(50) NOT NULL,
    CONSTRAINT fk_game_grades FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE
);

-- 4. Criação da tabela de Ingressos (Depende de Teachers e Games)
CREATE TABLE access_tickets (
    uuid UUID PRIMARY KEY, -- Alterado de 'id' para 'uuid' para bater com o Java
    code VARCHAR(10) NOT NULL UNIQUE,
    max_uses INTEGER NOT NULL,
    current_uses INTEGER NOT NULL DEFAULT 0,
    expiration_date TIMESTAMP NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Novos campos que mapeamos hoje:
    grade VARCHAR(50) NOT NULL,
    game_id BIGINT NOT NULL,
    teacher_uuid UUID NOT NULL,
    
    -- Constraints amarrando as chaves estrangeiras
    CONSTRAINT fk_ticket_game FOREIGN KEY (game_id) REFERENCES games (id),
    CONSTRAINT fk_ticket_teacher FOREIGN KEY (teacher_uuid) REFERENCES teachers (uuid)
);
