import re

with open('frontend/src/app/features/games/professions/professions.component.ts', 'r') as f:
    content = f.read()

# 1. Add Imports
if 'DragDropModule' not in content:
    content = content.replace(
        "import { ProgressReporter } from '../../../core/services/progress-reporter.service';",
        "import { ProgressReporter } from '../../../core/services/progress-reporter.service';\nimport { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';"
    )
    content = content.replace("imports: [CommonModule]", "imports: [CommonModule, DragDropModule]")

# 2. Add Phase 3 Interfaces
phase3_interface = """
interface Phase3Item {
  id: string;
  name: string;
  icon: string;
  category: 'TRABALHO' | 'ESTUDO' | 'LAZER';
}
"""
if 'interface Phase3Item' not in content:
    content = content.replace("interface Scenario {", phase3_interface + "\ninterface Scenario {")

# 3. Add Phase 3 State Variables
phase3_vars = """
  // FASE 3: Drag & Drop (Categorização)
  gameStage: 1 | 2 | 3 = 1;
  phase3Level: number = 1;

  unassignedItems: Phase3Item[] = [];
  workColumn: Phase3Item[] = [];
  studyColumn: Phase3Item[] = [];
  leisureColumn: Phase3Item[] = [];

  phase3Data: Phase3Item[][] = [
    // Nível 1
    [
      { id: '1', name: 'Planilha Financeira', icon: '📊', category: 'TRABALHO' },
      { id: '2', name: 'Editor de Código', icon: '💻', category: 'TRABALHO' },
      { id: '3', name: 'Reunião de Equipe', icon: '👔', category: 'TRABALHO' },
      { id: '4', name: 'Email Profissional', icon: '✉️', category: 'TRABALHO' },
      { id: '5', name: 'Controle de Estoque', icon: '📦', category: 'TRABALHO' },
      { id: '6', name: 'Videoaula', icon: '📐', category: 'ESTUDO' },
      { id: '7', name: 'Resumo Acadêmico', icon: '📄', category: 'ESTUDO' },
      { id: '8', name: 'Fórum de Dúvidas', icon: '🙋', category: 'ESTUDO' },
      { id: '9', name: 'Simulado Online', icon: '📝', category: 'ESTUDO' },
      { id: '10', name: 'Pesquisa Escolar', icon: '🔍', category: 'ESTUDO' },
      { id: '11', name: 'Série Animada', icon: '📺', category: 'LAZER' },
      { id: '12', name: 'Jogo de Aventura', icon: '🎮', category: 'LAZER' },
      { id: '13', name: 'Rede Social', icon: '📱', category: 'LAZER' },
      { id: '14', name: 'Música Relaxante', icon: '🎧', category: 'LAZER' },
      { id: '15', name: 'Quadrinhos', icon: '🗯️', category: 'LAZER' }
    ],
    // Nível 2
    [
      { id: '16', name: 'App de Vendas', icon: '📈', category: 'TRABALHO' },
      { id: '17', name: 'App de Motorista', icon: '🚗', category: 'TRABALHO' },
      { id: '18', name: 'Edição de Vídeo', icon: '🎬', category: 'TRABALHO' },
      { id: '19', name: 'Prancheta Digital', icon: '📏', category: 'TRABALHO' },
      { id: '20', name: 'Sistema de Caixa', icon: '🛒', category: 'TRABALHO' },
      { id: '21', name: 'Livro Didático', icon: '📚', category: 'ESTUDO' },
      { id: '22', name: 'Grupo de Estudos', icon: '💬', category: 'ESTUDO' },
      { id: '23', name: 'Curso de Idiomas', icon: '🌍', category: 'ESTUDO' },
      { id: '24', name: 'Calculadora', icon: '🧮', category: 'ESTUDO' },
      { id: '25', name: 'Mapa Mental', icon: '🧠', category: 'ESTUDO' },
      { id: '26', name: 'Vlog de Viagem', icon: '✈️', category: 'LAZER' },
      { id: '27', name: 'Futebol Online', icon: '⚽', category: 'LAZER' },
      { id: '28', name: 'Playlist de Festa', icon: '🎵', category: 'LAZER' },
      { id: '29', name: 'Vídeos Engraçados', icon: '😂', category: 'LAZER' },
      { id: '30', name: 'Live de Jogos', icon: '🔴', category: 'LAZER' }
    ],
    // Nível 3
    [
      { id: '31', name: 'Prontuário Médico', icon: '⚕️', category: 'TRABALHO' },
      { id: '32', name: 'Projeto 3D', icon: '🏗️', category: 'TRABALHO' },
      { id: '33', name: 'Design Gráfico', icon: '🎨', category: 'TRABALHO' },
      { id: '34', name: 'Contabilidade', icon: '🧾', category: 'TRABALHO' },
      { id: '35', name: 'Agenda de Clientes', icon: '📅', category: 'TRABALHO' },
      { id: '36', name: 'Tutorial Python', icon: '⌨️', category: 'ESTUDO' },
      { id: '37', name: 'Artigo Científico', icon: '🔬', category: 'ESTUDO' },
      { id: '38', name: 'Documentário', icon: '🏛️', category: 'ESTUDO' },
      { id: '39', name: 'Treinamento', icon: '🎯', category: 'ESTUDO' },
      { id: '40', name: 'Teste Lógico', icon: '🧩', category: 'ESTUDO' },
      { id: '41', name: 'Comédia Stand-up', icon: '🍿', category: 'LAZER' },
      { id: '42', name: 'Chat com Amigos', icon: '🗣️', category: 'LAZER' },
      { id: '43', name: 'Jogo de Cartas', icon: '🃏', category: 'LAZER' },
      { id: '44', name: 'Loja de Roupas', icon: '👗', category: 'LAZER' },
      { id: '45', name: 'Planejar Férias', icon: '🏖️', category: 'LAZER' }
    ]
  ];
"""
content = re.sub(r'gameStage:\s*1\s*\|\s*2\s*=\s*1;', phase3_vars, content)

# 4. Modify restoreProgress
restore_progress_new = """
  private restoreProgress() {
    const saved = sessionStorage.getItem('currentStage');
    if (saved) {
      const stage = parseInt(saved, 10);
      if (!isNaN(stage) && stage > 0) {
        const phase1Total = this.professions.length;
        const phase2Total = this.scenarios.length;
        if (stage >= phase1Total + phase2Total + 3) {
          this.gameFinished = true;
        } else if (stage >= phase1Total + phase2Total) {
          this.gameStage = 3;
          this.phase3Level = stage - (phase1Total + phase2Total) + 1;
          this.loadPhase3();
        } else if (stage >= phase1Total) {
          this.gameStage = 2;
          this.currentIndex = stage - phase1Total;
        } else {
          this.gameStage = 1;
          this.currentIndex = stage;
        }
      }
    }
  }

  loadPhase3() {
    this.workColumn = [];
    this.studyColumn = [];
    this.leisureColumn = [];
    // Clonar e embaralhar
    this.unassignedItems = [...this.phase3Data[this.phase3Level - 1]].sort(() => Math.random() - 0.5);
  }
"""
content = re.sub(r'private restoreProgress\(\)\s*\{.*?\n  \}', restore_progress_new, content, flags=re.DOTALL)

# 5. Modify getAbsoluteStage
abs_stage_new = """
  getAbsoluteStage(): number {
    const p1 = this.professions.length;
    const p2 = this.scenarios.length;
    if (this.gameStage === 1) return this.currentIndex;
    if (this.gameStage === 2) return p1 + this.currentIndex;
    return p1 + p2 + (this.phase3Level - 1);
  }
"""
content = re.sub(r'getAbsoluteStage\(\): number\s*\{.*?\n  \}', abs_stage_new, content, flags=re.DOTALL)

# 6. Modify Advance Logic in checkScenario
check_scenario_new = """
    this.currentIndex++;
    const phase1Total = this.professions.length;
    let isFinished = false;

    if (this.gameStage === 1 && this.currentIndex >= phase1Total) {
      this.gameStage = 2;
      this.currentIndex = 0;
    } else if (this.gameStage === 2 && this.currentIndex >= this.scenarios.length) {
      this.gameStage = 3;
      this.phase3Level = 1;
      this.loadPhase3();
    } else if (this.gameStage === 1) {
      this.loadProfession();
    }
"""
# Replace the old checkScenario advance logic
content = re.sub(r'this\.currentIndex\+\+;.*?this\.progressReporter\.report', check_scenario_new + '\n    this.progressReporter.report', content, flags=re.DOTALL)

# 7. Add Phase 3 Validation Methods
phase3_methods = """
  drop(event: CdkDragDrop<Phase3Item[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  checkPhase3Answers() {
    if (this.unassignedItems.length > 0) return; // Não deveria ser clicável, mas por segurança
    
    // Validar cada coluna
    let hasError = false;
    this.workColumn.forEach(item => { if(item.category !== 'TRABALHO') hasError = true; });
    this.studyColumn.forEach(item => { if(item.category !== 'ESTUDO') hasError = true; });
    this.leisureColumn.forEach(item => { if(item.category !== 'LAZER') hasError = true; });

    if (hasError) {
      this.feedbackSoftware = 'Ops! Alguns artefatos estão na coluna errada. Revise!';
      this.showFeedback = true;
      
      this.progressReporter.report({
        levelId: `professions-${this.getAbsoluteStage()}`,
        fase: this.getAbsoluteStage(),
        result: 'fail',
        attempts: 0,
        mistakes: 1
      });
      return;
    }

    // Sucesso!
    this.showFeedback = false;
    this.feedbackSoftware = '';

    this.progressReporter.report({
      levelId: `professions-${this.getAbsoluteStage()}`,
      fase: this.getAbsoluteStage(),
      result: 'success',
      attempts: 0,
      mistakes: 0
    });

    if (this.phase3Level < 3) {
      this.phase3Level++;
      this.loadPhase3();
      sessionStorage.setItem('currentStage', this.getAbsoluteStage().toString());
    } else {
      this.gameFinished = true;
      sessionStorage.setItem('currentStage', this.getAbsoluteStage().toString());
    }
  }
"""
# Add before the last closing brace
content = content.rsplit('}', 1)[0] + phase3_methods + '\n}'

with open('frontend/src/app/features/games/professions/professions.component.ts', 'w') as f:
    f.write(content)
