with open('frontend/src/app/features/games/professions/professions.component.ts', 'r') as f:
    content = f.read()

content = content.replace("""    this.progressReporter.report({
      levelId: `professions-${this.getAbsoluteStage()}`,
      fase: this.getAbsoluteStage(),
      result: 'success',
      attempts: 0,
      timestamp: new Date().toISOString()
    });

    if (this.phase3Level < 3) {""", """    this.progressReporter.report({
      levelId: `professions-${this.getAbsoluteStage()}`,
      fase: this.getAbsoluteStage(),
      result: 'success',
      attempts: 0,
      timestamp: new Date().toISOString(),
      isLastLevel: this.phase3Level === 3
    });

    if (this.phase3Level < 3) {""")

with open('frontend/src/app/features/games/professions/professions.component.ts', 'w') as f:
    f.write(content)
