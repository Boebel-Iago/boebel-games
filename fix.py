with open('frontend/src/app/features/games/professions/professions.component.ts', 'r') as f:
    content = f.read()

# Fix 1: Floating 'private'
content = content.replace("  private \n  getAbsoluteStage(): number {", "  private getAbsoluteStage(): number {")

# Fix 2: showFeedback -> remove it, we can just set feedbackSoftware to string and it shows up? Let's check how Phase 1 uses it.
# Actually I'll just declare showFeedback: boolean = false; at the top if it doesn't exist.
if 'showFeedback: boolean' not in content:
    content = content.replace("gameStage: 1 | 2 | 3 = 1;", "gameStage: 1 | 2 | 3 = 1;\n  showFeedback: boolean = false;")

# Fix 3: 'fail' -> 'failure'
content = content.replace("result: 'fail',", "result: 'failure',")

# Fix 4: remove mistakes property
content = content.replace("mistakes: 1\n      });", "      });")
content = content.replace("mistakes: 0\n    });", "    });")

with open('frontend/src/app/features/games/professions/professions.component.ts', 'w') as f:
    f.write(content)
