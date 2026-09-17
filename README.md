# 🎮 Boebel Games - Plataforma Educacional

Uma plataforma completa de gamificação e educação digital, desenvolvida para o ensino do **Pensamento Computacional**, **Cidadania Digital** e **Lógica de Programação** (incluindo atividades plugadas e desplugadas). 

Construída com uma arquitetura moderna Full-Stack utilizando **Spring Boot (Java)** no back-end e **Angular** no front-end, a Boebel Games permite que professores gerenciem turmas, acompanhem o progresso dos alunos em tempo real e gerem relatórios automatizados, tudo em um ambiente lúdico e seguro.

---

## 🎯 Objetivo do Projeto

A plataforma foi idealizada para democratizar o acesso ao letramento digital em sala de aula. Os objetivos principais são:
- Desenvolver a **lógica de programação** de forma acessível através de blocos visuais e desafios progressivos.
- Ensinar **cidadania digital**, incluindo o combate a fake news, compreensão de direitos autorais e noções de segurança na internet.
- Promover a reflexão sobre o impacto da tecnologia e **diversidade** no mercado de trabalho.
- Fornecer aos educadores métricas em tempo real (dashboard) e **relatórios detalhados** sobre o desempenho de cada estudante para intervenções pedagógicas direcionadas.

---

## 🕹️ Catálogo de Jogos (Mini-games)

O sistema conta com 7 jogos educativos principais, divididos por objetivos pedagógicos:

1. **Sea Turtles (Resgate de Tartarugas) 🐢**
   - *Foco:* Lógica algorítmica e sustentabilidade.
   - *Descrição:* O aluno utiliza blocos de comando (avançar, girar) para programar o trajeto de uma tartaruga pelo oceano, desviando de lixo e superando obstáculos até o destino.

2. **Emergency Escape (Fuga de Emergência) 🚒**
   - *Foco:* Estruturas de controle complexas (Loops aninhados, Condicionais).
   - *Descrição:* Um labirinto desafiador onde o jogador deve controlar um personagem para fugir de um prédio em chamas, usando a quantidade exata e limitada de blocos condicionais (`se fogo...`).

3. **Professions (Profissões e Tecnologia) 👩🏾‍🔬**
   - *Foco:* Conscientização sobre tecnologia no mercado e diversidade.
   - *Descrição:* O aluno deve identificar quais hardwares e softwares são utilizados por diferentes profissionais (médicos, produtores musicais, engenheiros), substituindo ferramentas incorretas (físicas) por ferramentas tecnológicas apropriadas. O design de personagens promove a diversidade racial e de gênero.

4. **Pixel Art (Desvendando Binários) 👾**
   - *Foco:* Representação de dados, matrizes e números binários.
   - *Descrição:* Ensina como os computadores "enxergam" imagens interpretando grades de zeros (`0`) e uns (`1`) para revelar desenhos escondidos na tela.

5. **Fact Checker (Agência de Checagem) 🕵️**
   - *Foco:* Combate à desinformação.
   - *Descrição:* Os estudantes atuam como detetives da internet, lendo manchetes suspeitas e utilizando um buscador fictício seguro para cruzar fatos e determinar o que é verdade e o que é Fake News.

6. **Creators vs Copiers (Criadores vs Copiadores) ⚖️**
   - *Foco:* Direitos autorais e Plágio.
   - *Descrição:* Apresenta cenários do cotidiano escolar (fazer um trabalho, postar uma arte) e desafia o jogador a classificar se as ações constituem criação original, inspiração ética ou cópia/plágio.

7. **Browser Search (Busca Eficiente) 🌐**
   - *Foco:* Habilidades de pesquisa e filtros booleanos.
   - *Descrição:* Um simulador de buscador web onde o jogador precisa aprender a usar palavras-chave, aspas e filtros adequados para encontrar a informação desejada no menor tempo possível.

---

## ⚙️ Módulos e Funcionalidades

### 🏫 Módulo do Professor / Administrador
- **Sistema de Tickets Temporários:** Professores geram "Tickets" (códigos de acesso) para a sala de aula. Os tickets possuem validade configurável (ex: 2h, 24h).
- **Dashboard em Tempo Real:** Via *WebSockets*, o painel do professor se atualiza instantaneamente a cada movimento do aluno.
- **Geração de Relatórios (PDF):** Relatórios completos exportados em PDF demonstrando a taxa de acerto, tempo de tela e evolução de cada aluno do ticket.

### 🎓 Módulo do Aluno
- **Acesso Simples:** Não requer criação de conta com e-mail/senha. O aluno entra apenas com seu Nome e o Código do Ticket fornecido pelo professor.
- **Modo Livre (Free):** Uma área de degustação onde os alunos podem testar versões reduzidas dos jogos em casa sem necessidade de ticket.

---

## 🛠️ Tecnologias Utilizadas

**Front-end:**
- [Angular 18+](https://angular.io/) (TypeScript, SCSS)
- [Tailwind CSS](https://tailwindcss.com/) (Padronização visual e responsividade, temas institucionais *Forest* e *Emerald*)
- RxJS (Programação reativa)

**Back-end:**
- [Java 21](https://jdk.java.net/21/) + [Spring Boot 3](https://spring.io/projects/spring-boot)
- Spring Data JPA + Hibernate
- Spring Security (Autenticação do Admin)
- WebSockets (STOMP / SockJS para telemetria em tempo real)

---

## 🚀 Como Executar o Projeto Localmente

### 📌 Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 18 ou superior) e **NPM**
- **Angular CLI** (`npm install -g @angular/cli`)
- **Java JDK 21**
- **Maven** (O projeto já inclui o *wrapper*, mas é bom garantir)
- Um banco de dados **PostgreSQL** ou **MySQL** em execução (conforme configurado em seu `application.properties/yml`).

### 1️⃣ Iniciando o Back-end (Spring Boot)
1. Abra um terminal e navegue até a pasta `backend`:
   ```bash
   cd backend
   ```
2. Verifique o arquivo `src/main/resources/application.properties` para garantir que as credenciais do banco de dados (URL, usuário e senha) estão corretas para o seu ambiente local.
3. Execute o projeto utilizando o Maven Wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   *O backend iniciará normalmente na porta `8080` (http://localhost:8080).*

### 2️⃣ Iniciando o Front-end (Angular)
1. Abra um **novo** terminal e navegue até a pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências do Node:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento do Angular:
   ```bash
   npm start
   ```
   *Ou utilize o comando `ng serve`.*
4. Abra o seu navegador e acesse: **http://localhost:4200**

---
*Boebel Games - Desenvolvido com amor e foco na educação do futuro.*
