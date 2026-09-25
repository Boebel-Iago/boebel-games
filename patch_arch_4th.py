import re

with open("ARCHITECTURE.md", "r") as f:
    content = f.read()

new_content = """### 13.13 Segurança e Zelo Físico (`hardware-care`) — 2º Ano

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Manuseio correto de hardware e proteção de dados |
| **Model** | `hardware-care-engine.service.ts` |
| **Estado** | 4 fases (regras, separação de comida/água, timeline de ações) |
| **Especial** | Mecânica de "Linha do Tempo" e agrupamento seguro vs perigo |

### 13.14 Coleta e Anonimato (`data-anonymity`) — 4º Ano

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Anonimização de dados em pesquisas |
| **Model** | `data-anonymity-engine.service.ts` |
| **Estado** | 4 fases (crachá vs pesquisa, censura de nomes vazados) |
| **Especial** | Interface com drag-and-drop para caixa trituradora (Privacy Box) |

### 13.15 Dilemas Éticos (`ethical-dilemmas`) — 4º Ano

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Plágio, senhas e exposição na internet |
| **Model** | `ethical-dilemmas-engine.service.ts` |
| **Estado** | 4 fases (plágio, foto whatsapp, proteção de senha) |
| **Especial** | Estruturado via cenários descritivos interativos (decision-making) |"""

content = content.replace("### 13.13 Segurança e Zelo Físico (`hardware-care`) — 2º Ano\n\n| Aspecto | Detalhe |\n|---------|---------|\n| **Tema** | Manuseio correto de hardware e proteção de dados |\n| **Model** | `hardware-care-engine.service.ts` |\n| **Estado** | 4 fases (regras, separação de comida/água, timeline de ações) |\n| **Especial** | Mecânica de \"Linha do Tempo\" e agrupamento seguro vs perigo |", new_content)

with open("ARCHITECTURE.md", "w") as f:
    f.write(content)
