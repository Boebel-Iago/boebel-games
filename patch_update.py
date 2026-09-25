with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "r") as f:
    engine = f.read()

target = """  private updateState(updates: Partial<GameState>) {
    this.state = { ...this.state, ...updates };
    this.stateSubject.next({ ...this.state });
  }"""

rep = """  private updateState(updates: Partial<GameState>) {
    this.state = { ...this.state, ...updates };
    
    if (this.state.gameFinished) {
      localStorage.removeItem('boebel_creators_state');
    } else {
      localStorage.setItem('boebel_creators_state', JSON.stringify(this.state));
    }
    
    this.stateSubject.next({ ...this.state });
  }"""

engine = engine.replace(target, rep)

with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "w") as f:
    f.write(engine)
