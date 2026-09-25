with open('frontend/src/app/features/games/professions/professions.component.ts', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "result: 'success'," in line and "isLastLevel" not in lines[i+1] and "isLastLevel" not in lines[i+2] and "isLastLevel" not in lines[i+3]:
        # Need to insert isLastLevel. Let's just find the next '});' and insert before it.
        pass

# Actually, doing it via a simpler python script reading the whole content.
content = "".join(lines)
import re

# Fix missing isLastLevel in Phase 1 / Phase 2 success
content = re.sub(r"(result: 'success',\s*attempts: 0,\s*timestamp: new Date\(\)\.toISOString\(\))\s*\}\);", r"\1,\n      isLastLevel: false\n    });", content)
content = re.sub(r"(result: 'failure',\s*attempts: 1,\s*timestamp: new Date\(\)\.toISOString\(\))\s*\}\);", r"\1,\n      isLastLevel: false\n    });", content)
content = re.sub(r"(result: 'failure',\s*attempts: 0,\s*timestamp: new Date\(\)\.toISOString\(\))\s*\}\);", r"\1,\n      isLastLevel: false\n    });", content)

# Remove extra trailing brace
content = content.strip()
if content.endswith('}'):
    # Check if we have too many closing braces
    braces_open = content.count('{')
    braces_close = content.count('}')
    if braces_close > braces_open:
        content = content[:-1]

with open('frontend/src/app/features/games/professions/professions.component.ts', 'w') as f:
    f.write(content)
