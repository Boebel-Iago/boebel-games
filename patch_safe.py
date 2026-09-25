with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "r") as f:
    engine = f.read()

# 1. State changes
engine = engine.replace(
    "currentTaskIndex: 0,",
    "currentTaskIndex: 0,\n      lives: 3,\n      isGameOver: false,"
)

engine = engine.replace(
    "if (!isRestore) this.updateState({ currentTaskIndex: 0 });",
    "if (!isRestore) this.updateState({ currentTaskIndex: 0, lives: 3, isGameOver: false });"
)

# 2. Add handleWrongAnswer function
handle_fn = """  private handleWrongAnswer(baseFeedback: string) {
    const lives = this.state.lives - 1;
    const isGameOver = lives <= 0;
    let text = baseFeedback;
    if (isGameOver) {
      text += '\\n\\n⚠️ FIM DE JOGO! Você cometeu muitos erros e perdeu seu distintivo. A missão será reiniciada. Leia com mais atenção!';
    } else {
      text += `\\n\\nCuidado! Você tem apenas mais ${lives} chance${lives > 1 ? 's' : ''}.`;
    }
    
    this.updateState({
      isCorrectGuess: false,
      feedbackText: text,
      showFeedbackModal: true,
      lives,
      isGameOver
    });
  }

  checkLicense(selectedAnswer: string) {"""
engine = engine.replace("  checkLicense(selectedAnswer: string) {", handle_fn)

# 3. Replace in checkLicense
target_license = """      this.updateState({
        isCorrectGuess: false,
        feedbackText: 'Cuidado! Leia o símbolo novamente. Lembre-se do que conversamos sobre Direitos Autorais e Creative Commons.',
        showFeedbackModal: true
      });"""
rep_license = "      this.handleWrongAnswer('Cuidado! Leia o símbolo novamente. Lembre-se do que conversamos sobre Direitos Autorais e Creative Commons.');"
engine = engine.replace(target_license, rep_license)

# 4. Replace in votePlagiarism
target_plag = """      this.updateState({
        isCorrectGuess: false,
        feedbackText: voteForCorrectUse 
          ? 'Atenção, Juiz! Você deixou um plágio passar despercebido. Leia a atitude do aluno novamente.' 
          : 'Opa! Você penalizou um aluno que fez tudo certo. Lembre-se: se há créditos ou uso apropriado, está correto!',
        showFeedbackModal: true
      });"""
rep_plag = """      const fb = voteForCorrectUse 
        ? 'Atenção, Juiz! Você deixou um plágio passar despercebido. Leia a atitude do aluno novamente.' 
        : 'Opa! Você penalizou um aluno que fez tudo certo. Lembre-se: se há créditos ou uso apropriado, está correto!';
      this.handleWrongAnswer(fb);"""
engine = engine.replace(target_plag, rep_plag)

# 5. Replace in checkDragDropAnswers
target_drag = """      this.updateState({ showDragError: true });"""
rep_drag = """      this.handleWrongAnswer('Existem itens nas colunas erradas! Revise cada um deles com atenção.');"""
engine = engine.replace(target_drag, rep_drag)

# 6. Replace in voteAudit
target_audit = """      this.updateState({
        isCorrectGuess: false,
        feedbackText: voteForApproved 
          ? 'Auditoria Falhou! Você aprovou algo que pode render um processo para a escola!' 
          : 'Calma, Auditor! Você reprovou um recurso que estava sendo usado de forma perfeitamente legal.',
        showFeedbackModal: true
      });"""
rep_audit = """      const fb = voteForApproved 
        ? 'Auditoria Falhou! Você aprovou algo que pode render um processo para a escola!' 
        : 'Calma, Auditor! Você reprovou um recurso que estava sendo usado de forma perfeitamente legal.';
      this.handleWrongAnswer(fb);"""
engine = engine.replace(target_audit, rep_audit)

# 7. Update nextStep
target_next = """  nextStep() {
    this.updateState({ showFeedbackModal: false });

    if (!this.state.isCorrectGuess) {
      this.reportProgress('failure', false);
      return;
    }"""
rep_next = """  nextStep() {
    this.updateState({ showFeedbackModal: false });

    if (this.state.isGameOver) {
      this.reportProgress('failure', false);
      this.startMission();
      return;
    }

    if (!this.state.isCorrectGuess) {
      this.reportProgress('failure', false);
      return;
    }"""
engine = engine.replace(target_next, rep_next)

with open("frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts", "w") as f:
    f.write(engine)
