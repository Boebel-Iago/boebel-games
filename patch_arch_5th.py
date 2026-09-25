import re

with open("ARCHITECTURE.md", "r") as f:
    content = f.read()

new_content = """### 13.15 Dilemas Éticos (`ethical-dilemmas`) — 4º Ano

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Plágio, senhas e exposição na internet |
| **Model** | `ethical-dilemmas-engine.service.ts` |
| **Estado** | 4 fases (plágio, foto whatsapp, proteção de senha) |
| **Especial** | Estruturado via cenários descritivos interativos (decision-making) |

### 13.16 Automação e Robótica (`automation-robotics`) — 5º Ano

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | IA e robótica vs Atributos humanos (empatia/criatividade) |
| **Model** | `automation-robotics-engine.service.ts` |
| **Estado** | 4 fases (caixas de robô vs humano, esteira rápida) |
| **Especial** | Mecânica de "Esteira do Futuro" testando agilidade de raciocínio |

### 13.17 Feira do Futuro HQ (`future-fair`) — 5º Ano

| Aspecto | Detalhe |
|---------|---------|
| **Tema** | Profissões do futuro e autoria criativa digital |
| **Model** | `future-fair-engine.service.ts` |
| **Estado** | 4 fases (tutorial de HQ guiado até modo sandbox livre) |
| **Especial** | Sistema de drag-and-drop avançado e `contenteditable` em balões de fala |"""

content = content.replace("### 13.15 Dilemas Éticos (`ethical-dilemmas`) — 4º Ano\n\n| Aspecto | Detalhe |\n|---------|---------|\n| **Tema** | Plágio, senhas e exposição na internet |\n| **Model** | `ethical-dilemmas-engine.service.ts` |\n| **Estado** | 4 fases (plágio, foto whatsapp, proteção de senha) |\n| **Especial** | Estruturado via cenários descritivos interativos (decision-making) |", new_content)

with open("ARCHITECTURE.md", "w") as f:
    f.write(content)
