import re

with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "r") as f:
    engine = f.read()

# 1. State changes
engine = re.sub(r'private state: GameState = \{.*?\};', """private state: GameState = this.loadState();

  private loadState(): GameState {
    const saved = localStorage.getItem('boebel_creators_state');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      currentMissionIndex: 0,
      currentTaskIndex: 0,
      lives: 3,
      isGameOver: false,
      displayMode: 'briefing',
      currentDialogueIndex: 0,
      gameFinished: false,
      showFeedbackModal: false,
      feedbackText: '',
      isCorrectGuess: false,
      currentOptions: [],
      showDragError: false,
      unassignedItems: [],
      freeCol: [],
      creditsCol: [],
      plagiarismCol: []
    };
  }""", engine, flags=re.DOTALL)

# 2. updateState method
engine = re.sub(r'private updateState\(updates: Partial<GameState>\) \{\n    this\.state = \{ \.\.\.this\.state, \.\.\.updates \};\n    this\.stateSubject\.next\(this\.state\);\n  \}', """private updateState(updates: Partial<GameState>) {
    this.state = { ...this.state, ...updates };
    
    if (this.state.gameFinished) {
      localStorage.removeItem('boebel_creators_state');
    } else {
      localStorage.setItem('boebel_creators_state', JSON.stringify(this.state));
    }
    
    this.stateSubject.next(this.state);
  }""", engine, flags=re.DOTALL)

with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "w") as f:
    f.write(engine)
