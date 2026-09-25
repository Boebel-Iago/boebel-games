import re

with open("ARCHITECTURE.md", "r") as f:
    content = f.read()

new_content = """### 13.11 Investigadores da Tecnologia (`tech-investigators`) — 1º Ano

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | O que é tecnologia? Hardware x Software |
| **Model** | `tech-investigators-engine.service.ts` |
| **Estado** | 4 fases (associação de finalidade, separação de caixas) |
| **Especial** | Foco na validação motora e cognitiva rápida para alunos não alfabetizados |

### 13.12 Mistério da Senha (`password-mystery`) — 2º Ano

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Senhas como chaves e privacidade |
| **Model** | `password-mystery-engine.service.ts` |
| **Estado** | 4 fases (cofre virtual, classificação de atitudes, senha forte/fraca) |
| **Especial** | Interface de cofre/teclado com separação em zonas verde e vermelha |

### 13.13 Segurança e Zelo Físico (`hardware-care`) — 2º Ano

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Manuseio correto de hardware e proteção de dados |
| **Model** | `hardware-care-engine.service.ts` |
| **Estado** | 4 fases (regras, separação de comida/água, timeline de ações) |
| **Especial** | Mecânica de "Linha do Tempo" e agrupamento seguro vs perigo |"""

content = content.replace("### 13.11 Investigadores da Tecnologia (`tech-investigators`) — 1º Ano\n\n| Aspecto | Detalhe |\n|---------|---------|\n| **Tema** | O que é tecnologia? Hardware x Software |\n| **Model** | `tech-investigators-engine.service.ts` |\n| **Estado** | 4 fases (associação de finalidade, separação de caixas) |\n| **Especial** | Foco na validação motora e cognitiva rápida para alunos não alfabetizados |", new_content)

with open("ARCHITECTURE.md", "w") as f:
    f.write(content)
