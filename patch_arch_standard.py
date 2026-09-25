with open("ARCHITECTURE.md", "r") as f:
    content = f.read()

insertion = """## 13. Catálogo de Jogos Educacionais

### 13.0 Padrão Arquitetural Universal de Jogos (Modelo 5x10)
A partir de Setembro de 2026, todos os jogos curriculares (exceto `emergency-escape`, que é legado e intocável) devem gradualmente seguir ou ser construídos sob a seguinte estrutura universal para garantir engajamento contínuo (mais de 1h de duração) e proteção contra chutes:

1. **Estrutura Base (5x10):**
   - **5 Módulos** por jogo.
   - **10 Fases (Tarefas)** interativas por Módulo (totalizando 50 interações por jogo).
   
2. **Sistema Anti-Chute (Corações/Vidas):**
   - O jogador inicia cada Módulo com **3 Vidas (Corações)**.
   - Cada erro desconta 1 vida e dispara um feedback visual explicativo.
   - A perda de todas as vidas resulta em um "Game Over" de Módulo, forçando o aluno a **reiniciar o Módulo atual** desde a fase 1, penalizando o chute desenfreado com tempo.
   
3. **Persistência de Estado (F5):**
   - Todos os jogos devem realizar _auto-save_ do seu estado (`currentTaskIndex`, `lives`, etc.) no `localStorage`.
   - Evita perda de progresso em sessões compartilhadas caso o aluno recarregue a aba do navegador acidentalmente.
   - Ao finalizar o jogo (conclusão do módulo 5), o `localStorage` deve ser limpo para o próximo aluno.

4. **Aleatoriedade Dinâmica (Shuffle):**
   - O núcleo do jogo (Engine) deve rodar um algoritmo de embaralhamento (*Fisher-Yates*) nos vetores de conteúdo antes da inicialização, quebrando qualquer padrão determinístico de respostas falsas/verdadeiras que os alunos possam decorar.

"""

content = content.replace("## 13. Catálogo de Jogos Educacionais\n", insertion)

with open("ARCHITECTURE.md", "w") as f:
    f.write(content)
