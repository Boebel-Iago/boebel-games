import re

with open('frontend/src/app/features/games/professions/professions.component.ts', 'r') as f:
    content = f.read()

# Remove duplicate fields or wrongly typed fields inside checkPhase3Answers
# We'll just replace the entire checkPhase3Answers method cleanly.
start = content.find('checkPhase3Answers() {')
end = content.find('}', content.find('sessionStorage.setItem', start) + 100) + 1

correct_method = """checkPhase3Answers() {
    if (this.unassignedItems.length > 0) return;
    
    let hasError = false;
    this.workColumn.forEach(item => { if(item.category !== 'TRABALHO') hasError = true; });
    this.studyColumn.forEach(item => { if(item.category !== 'ESTUDO') hasError = true; });
    this.leisureColumn.forEach(item => { if(item.category !== 'LAZER') hasError = true; });

    if (hasError) {
      this.feedbackSoftware = 'Ops! Alguns artefatos estão na coluna errada. Revise!';
      this.showFeedback = true;
      
      this.progressReporter.report({
        levelId: `professions-${this.getAbsoluteStage()}`,
        fase: this.getAbsoluteStage(),
        result: 'failure',
        attempts: 0,
        timestamp: new Date().toISOString(),
        isLastLevel: false
      });
      return;
    }

    this.showFeedback = false;
    this.feedbackSoftware = '';

    this.progressReporter.report({
      levelId: `professions-${this.getAbsoluteStage()}`,
      fase: this.getAbsoluteStage(),
      result: 'success',
      attempts: 0,
      timestamp: new Date().toISOString(),
      isLastLevel: this.phase3Level === 3
    });

    if (this.phase3Level < 3) {
      this.phase3Level++;
      this.loadPhase3();
      sessionStorage.setItem('currentStage', this.getAbsoluteStage().toString());
    } else {
      this.gameFinished = true;
      sessionStorage.setItem('currentStage', this.getAbsoluteStage().toString());
    }
  }"""

content = content[:start] + correct_method + content[end:]

# Now clean up any other duplicates in checkScenario or checkTool
# In checkTool (Phase 1)
content = re.sub(r'timestamp:\s*Date\.now\(\),', '', content)
content = re.sub(r'isLastLevel:\s*this\.phase3Level === 3,?', '', content)

with open('frontend/src/app/features/games/professions/professions.component.ts', 'w') as f:
    f.write(content)
