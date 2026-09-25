with open('frontend/src/app/features/games/professions/professions.component.ts', 'r') as f:
    content = f.read()

# Make sure EVERY .report({ contains isLastLevel.
# There are 4 calls to report in this file probably.
# Let's just find them and replace the object.
import re

def replacer(match):
    inner = match.group(1)
    if 'isLastLevel' not in inner:
        if 'phase3Level' in content and 'checkPhase3Answers' in inner: # heuristic
            inner += ",\n      isLastLevel: false"
        else:
            inner += ",\n      isLastLevel: false"
    # Actually just add it if missing. We will use a regex to capture the whole report call.
    pass

# Let's just replace all 'this.progressReporter.report({' to end of object.
# Actually I'll use sed to replace the specific lines that are broken.
