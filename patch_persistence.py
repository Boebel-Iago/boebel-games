import re

with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "r") as f:
    engine = f.read()

# 1. Add loadState and replace initial state
initial_state_old = """  private state: GameState = {
    currentMissionIndex: 0,
    currentTaskIndex: 0,
    lives: 3,
    isGameOver: false,
    displayMode: 'briefing',
    currentDialogueIndex: 0,
    isCorrectGuess: false,
    showFeedbackModal: false,
    feedbackText: '',
    gameFinished: false,
    currentOptions: [],
    unassignedItems: [],
    freeCol: [],
    creditsCol: [],
    plagiarismCol: []
  };"""

initial_state_new = """  private state: GameState = this.loadState();

  private loadState(): GameState {
    const saved = localStorage.getItem('boebel_creators_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      currentMissionIndex: 0,
      currentTaskIndex: 0,
      lives: 3,
      isGameOver: false,
      displayMode: 'briefing',
      currentDialogueIndex: 0,
      isCorrectGuess: false,
      showFeedbackModal: false,
      feedbackText: '',
      gameFinished: false,
      currentOptions: [],
      unassignedItems: [],
      freeCol: [],
      creditsCol: [],
      plagiarismCol: []
    };
  }"""

engine = engine.replace(initial_state_old, initial_state_new)

# 2. Update updateState
update_state_old = """  private updateState(updates: Partial<GameState>) {
    this.state = { ...this.state, ...updates };
    this.stateSubject.next(this.state);
  }"""

update_state_new = """  private updateState(updates: Partial<GameState>) {
    this.state = { ...this.state, ...updates };
    if (this.state.gameFinished) {
      localStorage.removeItem('boebel_creators_state');
    } else {
      localStorage.setItem('boebel_creators_state', JSON.stringify(this.state));
    }
    this.stateSubject.next(this.state);
  }"""

engine = engine.replace(update_state_old, update_state_new)

with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "w") as f:
    f.write(engine)
