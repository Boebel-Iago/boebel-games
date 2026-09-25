with open('frontend/src/app/features/games/professions/professions.component.ts', 'r') as f:
    content = f.read()

content = content.replace("  private \n  getAbsoluteStage", "  private getAbsoluteStage")

with open('frontend/src/app/features/games/professions/professions.component.ts', 'w') as f:
    f.write(content)
