import os
import re

files = [
    'frontend/src/app/features/games/automation-robotics/automation-robotics.component.ts',
    'frontend/src/app/features/games/automation-robotics/engine/automation-robotics-engine.service.ts',
    'frontend/src/app/features/games/future-fair/future-fair.component.ts',
    'frontend/src/app/features/games/future-fair/engine/future-fair-engine.service.ts',
]

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    if "/**" not in content:
        # Add basic class doc
        name_match = re.search(r'export class ([A-Za-z0-9_]+)', content)
        if name_match:
            class_name = name_match.group(1)
            doc = f"/**\n * {class_name}\n * Responsável por gerenciar a lógica principal ou estado do jogo educacional.\n * Integrado com a plataforma via ProgressReporter.\n */\nexport class {class_name}"
            content = content.replace(f"export class {class_name}", doc)
            with open(f, 'w') as file:
                file.write(content)
