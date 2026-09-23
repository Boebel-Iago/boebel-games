import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProgressReporter } from '../../../../core/services/progress-reporter.service';

export interface TaskItem {
  id: string;
  text: string;
  type: 'robot' | 'human';
  droppedIn?: 'robot' | 'human';
}

export interface GameState {
  fase: number;
  phase0Tasks: TaskItem[];
  phase1Tasks: TaskItem[];
  phase2Tasks: TaskItem[];
  phase3Queue: TaskItem[];
  phase3CurrentIndex: number;
  phase3Completed: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
/**
 * AutomationRoboticsEngineService
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class AutomationRoboticsEngineService {
  private initialState: GameState = {
    fase: 0,
    phase0Tasks: [
      { id: 'p0-1', text: 'Calcular 1000 números', type: 'robot' },
      { id: 'p0-2', text: 'Apertar parafusos iguais', type: 'robot' }
    ],
    phase1Tasks: [
      { id: 'p1-1', text: 'Consolar um paciente triste', type: 'human' },
      { id: 'p1-2', text: 'Criar um poema', type: 'human' }
    ],
    phase2Tasks: [
      { id: 'p2-1', text: 'Calcular impostos rapidamente', type: 'robot' },
      { id: 'p2-2', text: 'Inspirar uma equipe', type: 'human' },
      { id: 'p2-3', text: 'Montar peças de carro', type: 'robot' },
      { id: 'p2-4', text: 'Aconselhar um amigo', type: 'human' }
    ],
    phase3Queue: [
      { id: 'p3-1', text: 'Soldar placas repetitivamente', type: 'robot' },
      { id: 'p3-2', text: 'Compor uma melodia', type: 'human' },
      { id: 'p3-3', text: 'Empacotar caixas', type: 'robot' },
      { id: 'p3-4', text: 'Empatia com o cliente', type: 'human' }
    ],
    phase3CurrentIndex: 0,
    phase3Completed: false,
    message: ''
  };

  private state = new BehaviorSubject<GameState>(this.clone(this.initialState));
  state$ = this.state.asObservable();

  constructor(private progress: ProgressReporter) {}

  private clone(state: GameState): GameState {
    return JSON.parse(JSON.stringify(state));
  }

  get currentState(): GameState {
    return this.state.getValue();
  }

  private updateState(newState: Partial<GameState>) {
    this.state.next({ ...this.currentState, ...newState });
  }

  dropPhase0(taskId: string) {
    const s = this.currentState;
    if (s.fase !== 0) return;
    const task = s.phase0Tasks.find(t => t.id === taskId);
    if (task && task.type === 'robot') {
      task.droppedIn = 'robot';
      this.updateState({ phase0Tasks: s.phase0Tasks, message: 'Muito bem!' });
      this.checkPhase0Completion();
    } else {
      this.reportMistake();
      this.updateState({ message: 'Ops! Isso não é tarefa de robô.' });
    }
  }

  private checkPhase0Completion() {
    const s = this.currentState;
    if (s.phase0Tasks.every(t => t.droppedIn === 'robot')) {
      this.completePhase(false);
    }
  }

  dropPhase1(taskId: string) {
    const s = this.currentState;
    if (s.fase !== 1) return;
    const task = s.phase1Tasks.find(t => t.id === taskId);
    if (task && task.type === 'human') {
      task.droppedIn = 'human';
      this.updateState({ phase1Tasks: s.phase1Tasks, message: 'Excelente!' });
      this.checkPhase1Completion();
    } else {
      this.reportMistake();
      this.updateState({ message: 'Ops! Isso não é tarefa humana.' });
    }
  }

  private checkPhase1Completion() {
    const s = this.currentState;
    if (s.phase1Tasks.every(t => t.droppedIn === 'human')) {
      this.completePhase(false);
    }
  }

  dropPhase2(taskId: string, targetBox: 'robot' | 'human') {
    const s = this.currentState;
    if (s.fase !== 2) return;
    const task = s.phase2Tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.type === targetBox) {
      task.droppedIn = targetBox;
      this.updateState({ phase2Tasks: s.phase2Tasks, message: 'Correto!' });
      this.checkPhase2Completion();
    } else {
      this.reportMistake();
      this.updateState({ message: `Atenção: A tarefa é para ${task.type === 'human' ? 'Humanos' : 'Robôs'}!` });
    }
  }

  private checkPhase2Completion() {
    const s = this.currentState;
    if (s.phase2Tasks.every(t => t.droppedIn)) {
      this.completePhase(false);
    }
  }

  answerPhase3(type: 'robot' | 'human') {
    const s = this.currentState;
    if (s.fase !== 3) return;
    
    const task = s.phase3Queue[s.phase3CurrentIndex];
    if (task.type === type) {
      this.updateState({ message: 'Certo! Rápido!', phase3CurrentIndex: s.phase3CurrentIndex + 1 });
      if (s.phase3CurrentIndex + 1 >= s.phase3Queue.length) {
        this.updateState({ phase3Completed: true, message: 'Parabéns, você completou o jogo!' });
        this.completePhase(true);
      }
    } else {
      this.reportMistake();
      this.updateState({ message: 'Erro! Preste mais atenção na esteira.' });
    }
  }

  completePhase(isLastLevel: boolean) {
    const s = this.currentState;
    this.progress.report({
      levelId: `fase-${s.fase}`,
      fase: s.fase,
      result: 'success',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: isLastLevel
    });
    if (!isLastLevel) {
      this.updateState({ fase: s.fase + 1, message: 'Fase concluída!' });
    }
  }

  reportMistake() {
    const s = this.currentState;
    this.progress.report({
      levelId: `fase-${s.fase}`,
      fase: s.fase,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false
    });
  }

  resetGame() {
    this.state.next(this.clone(this.initialState));
  }
}
