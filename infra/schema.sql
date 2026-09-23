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
    paused_at TIMESTAMP,
    ticket_name VARCHAR(100),
    notes VARCHAR(500),
    
    -- Novos campos que mapeamos hoje:
    grade VARCHAR(50) NOT NULL,
    game_id BIGINT NOT NULL,
    teacher_uuid UUID NOT NULL,
    max_players_per_session INTEGER NOT NULL DEFAULT 1,
    
    -- Constraints amarrando as chaves estrangeiras
    CONSTRAINT fk_ticket_game FOREIGN KEY (game_id) REFERENCES games (id),
    CONSTRAINT fk_ticket_teacher FOREIGN KEY (teacher_uuid) REFERENCES teachers (uuid)
);

    -- Inserindo jogo: Pixel Art Maker (ID = 1)
    INSERT INTO games (title, description, route) 
    VALUES ('Pixel Art Maker', 'Uma tela de 10x10 para criar desenhos pixelados e treinar lógica e coordenadas espaciais.', 'pixel-art');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (1, 'ELEMENTARY_1');
    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (1, 'ELEMENTARY_2');
    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (1, 'ELEMENTARY_3');
    
    -- Inserindo jogo: Máquinas e Profissões (ID = 2)
    INSERT INTO games (title, description, route) 
    VALUES ('Máquinas e Profissões', 'Associe tecnologias ao trabalho e ao lazer.', 'professions');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (2, 'ELEMENTARY_2');
    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (2, 'ELEMENTARY_3');
    
    -- Inserindo jogo: Detetive Digital (ID = 3)
    INSERT INTO games (title, description, route) 
    VALUES ('Detetive Digital', 'Avaliação prática de uso de navegadores e palavras-chave.', 'browser-search');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (3, 'ELEMENTARY_3');
    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (3, 'ELEMENTARY_4');

    -- Inserindo jogo: Detetive de Notícias (ID = 4)
    INSERT INTO games (title, description, route) 
    VALUES ('Detetive de Notícias', 'Identifique partes de uma notícia e avalie se é verdadeira ou falsa.', 'fact-checker');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (4, 'ELEMENTARY_4');
    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (4, 'ELEMENTARY_5');

    -- Inserindo jogo: Criadores vs Copiadores (ID = 5)
    INSERT INTO games (title, description, route) 
    VALUES ('Criadores vs Copiadores', 'Aprenda sobre direitos autorais e licenças Creative Commons.', 'creators-vs-copiers');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (5, 'ELEMENTARY_4');
    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (5, 'ELEMENTARY_5');

    -- Inserindo jogo: Fuga de Emergência (ID = 6)
    INSERT INTO games (title, description, route) 
    VALUES ('Fuga de Emergência', 'Escape-room com programação em blocos usando Blockly.', 'emergency-escape');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (6, 'ELEMENTARY_3');
    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (6, 'ELEMENTARY_4');
    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (6, 'ELEMENTARY_5');

    -- Nova tabela pra sessão dos estudantes.
    
    CREATE TABLE student_sessions (
    id UUID PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    ticket_code VARCHAR(255) NOT NULL,
    game_route VARCHAR(255) NOT NULL,
    current_stage INT DEFAULT 0 NOT NULL,
    total_mistakes INT DEFAULT 0 NOT NULL,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    -- Inserindo jogo: Das Areias ao Mar (ID = 7)
    INSERT INTO games (title, description, route) 
    VALUES ('Das Areias ao Mar', 'Aprenda a classificar e reconhecer padrões com as tartarugas marinhas.', 'sea-turtles');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (7, 'ELEMENTARY_1');
    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (7, 'ELEMENTARY_2');

    -- Inserindo jogo: Texto e Formas (ID = 8)
    INSERT INTO games (title, description, route) 
    VALUES ('Texto e Formas', 'Aplique formatações em textos e use formas geométricas para criar desenhos.', 'text-and-shapes');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (8, 'ELEMENTARY_3');

    -- Inserindo jogo: Mini-Cartaz (ID = 9)
    INSERT INTO games (title, description, route) 
    VALUES ('Mini-Cartaz', 'Organize o layout do seu mini-cartaz digital usando textos e redimensionando imagens.', 'mini-poster');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (9, 'ELEMENTARY_3');

    -- Inserindo jogo: Letramento e Toque (ID = 10)
    INSERT INTO games (title, description, route) 
    VALUES ('Letramento e Toque', 'Pratique clicar e arrastar objetos pela tela enquanto treina a coordenação motora.', 'touch-literacy');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (10, 'ELEMENTARY_1');

    -- Inserindo jogo: Investigadores da Tecnologia (ID = 11)
    INSERT INTO games (title, description, route) 
    VALUES ('Investigadores da Tecnologia', 'Descubra o que é tecnologia e aprenda a cuidar dos nossos equipamentos.', 'tech-investigators');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (11, 'ELEMENTARY_1');

    -- Inserindo jogo: Mistério da Senha Secreta (ID = 12)
    INSERT INTO games (title, description, route) 
    VALUES ('Mistério da Senha', 'Proteja o seu cofre classificando atitudes seguras e descobrindo senhas fortes.', 'password-mystery');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (12, 'ELEMENTARY_2');

    -- Inserindo jogo: Segurança e Zelo (ID = 13)
    INSERT INTO games (title, description, route) 
    VALUES ('Segurança e Zelo Físico', 'Aprenda a manusear equipamentos com cuidado e avalie os riscos do dia a dia.', 'hardware-care');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (13, 'ELEMENTARY_2');

    -- Inserindo jogo: Coleta e Anonimato na Escola (ID = 14)
    INSERT INTO games (title, description, route) 
    VALUES ('Coleta e Anonimato', 'Aprenda a coletar dados para uma pesquisa protegendo a privacidade dos participantes.', 'data-anonymity');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (14, 'ELEMENTARY_4');

    -- Inserindo jogo: Dilemas Éticos e Autoria (ID = 15)
    INSERT INTO games (title, description, route) 
    VALUES ('Dilemas Éticos', 'Tome decisões éticas sobre privacidade, senhas e direitos autorais no dia a dia.', 'ethical-dilemmas');

    INSERT INTO game_allowed_grades (game_id, grade_name) VALUES (15, 'ELEMENTARY_4');
