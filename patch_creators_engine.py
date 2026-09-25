import re

with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "r") as f:
    content = f.read()

# Replace the bad shuffle with a proper Fisher-Yates
shuffle_fn = """  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private startMission(isRestore = false) {"""
  
content = content.replace("  private startMission(isRestore = false) {", shuffle_fn)

content = content.replace(
    "const opts = [task.correctAnswer, ...task.wrongAnswers].sort(() => Math.random() - 0.5);",
    "const opts = this.shuffleArray([task.correctAnswer, ...task.wrongAnswers]);"
)

content = content.replace(
    "const items = [...this.dragDropData[lvl]].sort(() => Math.random() - 0.5);",
    "const items = this.shuffleArray([...this.dragDropData[lvl]]);"
)

with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "w") as f:
    f.write(content)
