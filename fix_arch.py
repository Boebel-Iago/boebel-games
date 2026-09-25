import re

with open("ARCHITECTURE.md", "r") as f:
    content = f.read()

# Extract from "## 13. Componentes de Jogos (Frontend)" up to "---" before "## 14."
start_idx = content.find("## 13. Componentes de Jogos (Frontend)")
end_idx = content.find("## 14. Erros Conhecidos e Lições Aprendidas")

if start_idx != -1 and end_idx != -1:
    # Before and after
    before = content[:start_idx]
    after = content[end_idx:]

    new_section = """## 13. Componentes de Jogos (Frontend)

Cada jogo educacional é um módulo Angular focado em desenvolver competências específicas do pensamento computacional. 

### 13.0 Padrão Arquitetural Universal de Jogos (Modelo 5x10)
De acordo com o novo Padrão Curricular, todos os jogos seguem uma mecânica arquitetural unificada focada em repetição e retenção de aprendizado, com exceção dos jogos listados na seção "Exceções":
1. **5 Módulos Temáticos**: Cada jogo é dividido em 5 módulos sequenciais que introduzem conceitos progressivos.
2. **10 Tarefas (Fases) por Módulo**: O aluno deve resolver 10 exercícios curtos e diretos para passar de módulo, totalizando 50 fases por jogo.
3. **Mecânica de Vidas (Anti-Bruteforce)**: O jogador possui 3 corações. Errando qualquer clique ou drag-and-drop, perde 1 coração. Zerando as vidas, o Módulo recomeça do zero para coibir o "chute" nas respostas.
4. **Persistência de Estado Local**: Cada clique que altera fase ou vida salva o estado via `localStorage`, impedindo que um F5 acidental (comum em escolas) perca o progresso.
5. **Fisher-Yates Shuffle**: Todos os arrays de respostas ou perguntas dos jogos são embaralhados matematicamente na instanciação, garantindo que não existam padrões fixos ("Certo, Errado, Certo").

Abaixo está o mapeamento dos jogos na plataforma com base nas novas especificações:

### 1º Ano
* **Letramento e Toque (`touch-literacy`)**: Prática de coordenação motora com SVGs, arrastando frutas, combinando formas lógicas, clicando em bolhas.
* **Investigadores da Tecnologia (`tech-investigators`)**: Validação motora rápida com imagens/emojis; separar Hardware de Software; O que é Computador vs Objeto Comum.

### 2º Ano
* **Mistério da Senha (`password-mystery`)**: Teclado de cofre virtual anti-erros, classificação de atitudes (Verde = Seguro, Vermelho = Perigo) sobre senhas, identificação de senhas fortes.
* **Segurança e Zelo Físico (`hardware-care`)**: Manuseio físico. Ex: Não comer no teclado, como transportar um tablet, classificação (Limpeza, Energia, Impacto).

### 3º Ano
* **Texto e Formas (`text-and-shapes`)**: Digitação exata contra erros ortográficos, uso de botões de formatação (Cores, Negrito/Itálico) e reconhecimento geométrico via interface (SVG).
* **Mini-Cartaz (`mini-poster`)**: Diagramação; uso de Drag & Drop para encaixar Títulos e Imagens em *bounding boxes*; alinhamento (Esquerda/Centro/Direita).
* **Cyber Exploradores (`browser-search`)**: Formação de palavras-chave, filtros de busca, reconhecimento de URLs confiáveis e operadores de busca com aspas.
* **Pixel Art (`pixel-art`)**: Lógica de malhas/grids, preenchimento de coordenadas cartesianas básicas, simetria em matrizes e cores em pixel art.

### 4º Ano
* **Dilemas Éticos (`ethical-dilemmas`)**: Foco em cidadania digital. Julgamento ético rápido contra cyberbullying, uso seguro, não expor amigos.
* **Coleta e Anonimato (`data-anonymity`)**: Entendimento de "Dado Pessoal" vs "Dado Comum", campos seguros vs inseguros em formulários.
* **Criadores vs Copiadores (`creators-vs-copiers`)**: Direitos autorais, Plágio vs Inspiração, licenças abertas.
* **Profissões (`professions`)**: Hardware e Software de diferentes profissões modernas (Engenheiro com CAD, Médico com Raio-X digital).

### 5º Ano
* **Feira do Futuro (`future-fair`)**: Resolução de problemas com Inteligência Artificial, VR, Drones, Impressão 3D e IoT.
* **Detetives Digitais (`fact-checker`)**: Checagem rigorosa de Fake News, Clickbaits, checagem cruzada de datas e fontes confiáveis.

### Jogos Exceções (Fora do Padrão 5x10)
Os jogos abaixo seguem lógicas distintas de programação ou algoritmos e não se enquadram no modelo 5x10:
* **Fuga de Emergência (`emergency-escape`)**: Usa a biblioteca Google Blockly para programação visual em blocos. O aluno constrói o algoritmo e o "roda" em um grid bidimensional.
* **Automação e Robótica (`automation-robotics`)**: Futuro jogo que utilizará lógicas customizadas.
* **Corrida das Tartarugas (`sea-turtles`)**: Jogo de sequenciamento com balanceamento próprio de mecânica.

---
"""
    with open("ARCHITECTURE.md", "w") as out:
        out.write(before + new_section + after)
