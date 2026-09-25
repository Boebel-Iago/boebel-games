import re

with open('frontend/src/app/features/games/professions/professions.component.ts', 'r') as f:
    content = f.read()

# I will find all instances of this.progressReporter.report({ ... });
# and completely overwrite them one by one.
# There are reports in checkTool, checkScenario, checkPhase3Answers (2x).
# Just to be safe, I will find 'this.progressReporter.report' and replace the whole block.
content = re.sub(r'this\.progressReporter\.report\(\{[^}]*\}\);', 'this.progressReporter.report({ levelId: `professions-${this.getAbsoluteStage()}`, fase: this.getAbsoluteStage(), result: \'success\', attempts: 0, timestamp: new Date().toISOString(), isLastLevel: false });', content)

# But wait, we need 'failure' for the error blocks!
# Let's restore the file to the commit before the mess, and redo it properly.
