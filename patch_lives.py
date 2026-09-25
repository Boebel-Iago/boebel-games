import re

engine_path = "frontend/src/app/features/games/creators-vs-copiers/engine/creators-engine.service.ts"
with open(engine_path, "r") as f:
    engine = f.read()

# 1. Update initial state
engine = engine.replace(
    "currentTaskIndex: 0,",
    "currentTaskIndex: 0,\n      lives: 3,\n      isGameOver: false,"
)

# 2. Update startMission to reset lives
engine = engine.replace(
    "if (!isRestore) this.updateState({ currentTaskIndex: 0 });",
    "if (!isRestore) this.updateState({ currentTaskIndex: 0, lives: 3, isGameOver: false });"
)

# 3. Helper to handle wrong answers
helper = """  private handleWrongAnswer(baseFeedback: string) {
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
"""

# inject helper before checkLicense
engine = engine.replace("  checkLicense(selectedAnswer: string) {", helper + "\n  checkLicense(selectedAnswer: string) {")

# 4. Replace manual wrong answer logic in checkLicense
engine = re.sub(
    r'\} else \{\s*this.updateState\(\{\s*isCorrectGuess: false,\s*feedbackText: [^}]+?\}\);\s*\}',
    "} else {\n      this.handleWrongAnswer('Cuidado! Leia o símbolo novamente. Lembre-se do que conversamos sobre Direitos Autorais e Creative Commons.');\n    }",
    engine
)

# 5. Replace in votePlagiarism
engine = re.sub(
    r'\} else \{\s*this.updateState\(\{\s*isCorrectGuess: false,\s*feedbackText: [^}]+?\}\);\s*\}',
    """} else {
      const fb = voteForCorrectUse 
        ? 'Atenção, Juiz! Você deixou um plágio passar despercebido. Leia a atitude do aluno novamente.' 
        : 'Opa! Você penalizou um aluno que fez tudo certo. Lembre-se: se há créditos ou uso apropriado, está correto!';
      this.handleWrongAnswer(fb);
    }""",
    engine
)

# 6. Replace in checkDragDropAnswers
engine = re.sub(
    r'\} else \{\s*this.updateState\(\{\s*showDragError: true\s*\}\);\s*\}',
    """} else {
      this.handleWrongAnswer('Existem itens nas colunas erradas! Revise cada um deles com atenção.');
    }""",
    engine
)

# 7. Replace in voteAudit
engine = re.sub(
    r'\} else \{\s*this.updateState\(\{\s*isCorrectGuess: false,\s*feedbackText: [^}]+?\}\);\s*\}',
    """} else {
      const fb = voteForApproved 
        ? 'Auditoria Falhou! Você aprovou algo que pode render um processo para a escola!' 
        : 'Calma, Auditor! Você reprovou um recurso que estava sendo usado de forma perfeitamente legal.';
      this.handleWrongAnswer(fb);
    }""",
    engine
)

# 8. Update nextStep
next_step_logic = """  nextStep() {
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
engine = engine.replace("""  nextStep() {
    this.updateState({ showFeedbackModal: false });

    if (!this.state.isCorrectGuess) {
      this.reportProgress('failure', false);
      return;
    }""", next_step_logic)


with open(engine_path, "w") as f:
    f.write(engine)

# ==========================================
# Update HTML
# ==========================================
html_path = "frontend/src/app/features/games/creators-vs-copiers/creators-vs-copiers.component.html"
with open(html_path, "r") as f:
    html = f.read()

# Header hearts
new_header = """    <div class="flex items-center gap-4">
      <div class="text-3xl tracking-widest drop-shadow-md" title="Vidas">
        <span class="text-red-500">{{ '❤️'.repeat(state.lives) }}</span><span class="text-gray-300">{{ '🤍'.repeat(3 - state.lives) }}</span>
      </div>
      <span class="bg-forest-900 text-white px-4 py-2 rounded-lg font-bold shadow">
        Fase {{ state.currentTaskIndex + 1 }}
      </span>
    </div>"""

html = re.sub(r'<div class="text-right">\s*<span class="bg-forest-900 text-white px-4 py-2 rounded-lg font-bold shadow">\s*Fase \{\{ state.currentTaskIndex \+ 1 \}\}\s*</span>\s*</div>', new_header, html)

# Feedback modal button text
html = html.replace(
    "{{ state.isCorrectGuess ? 'Continuar ➔' : 'Tentar Novamente ↺' }}",
    "{{ state.isCorrectGuess ? 'Continuar ➔' : (state.isGameOver ? 'Recomeçar Missão ↺' : 'Tentar Novamente ↺') }}"
)

with open(html_path, "w") as f:
    f.write(html)
