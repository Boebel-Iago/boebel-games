import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutomationRoboticsEngineService, GameState, RoboticsTask } from './engine/automation-robotics-engine.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-automation-robotics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './automation-robotics.component.html',
  styleUrls: ['./automation-robotics.component.scss']
})
export class AutomationRoboticsComponent implements OnInit, OnDestroy {
  state!: GameState;
  currentTask: RoboticsTask | null = null;
  private sub?: Subscription;

  // Feedback states
  feedbackType: 'success' | 'error' | null = null;
  feedbackExplanation: string = '';
  selectedOptionId: string | null = null;

  moduleTitles = [
    'Linha de Montagem Industrial',
    'Sensores e Lógica Condicional',
    'Inspetor de Código & Bugs',
    'Indústria 4.0 & Ética',
    'Programação de Rotas com Loops'
  ];

  moduleIcons = ['🏭', '🤖', '🐞', '🌐', '🧭'];

  constructor(public engine: AutomationRoboticsEngineService) {}

  ngOnInit(): void {
    this.sub = this.engine.state$.subscribe(state => {
      this.state = state;
      this.currentTask = this.engine.getCurrentTask();
      this.selectedOptionId = null;
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  get heartsArray(): boolean[] {
    return Array(3).fill(false).map((_, i) => i < this.state.hearts);
  }

  selectOption(option: { id: string; text: string; isCorrect: boolean }): void {
    if (this.feedbackType !== null || !this.currentTask) return;

    this.selectedOptionId = option.id;
    const isCorrect = option.isCorrect;
    this.feedbackExplanation = this.currentTask.explanation;

    if (isCorrect) {
      this.feedbackType = 'success';
      setTimeout(() => {
        this.feedbackType = null;
        this.selectedOptionId = null;
        this.engine.submitAnswer(true);
      }, 1600);
    } else {
      this.feedbackType = 'error';
      setTimeout(() => {
        this.feedbackType = null;
        this.selectedOptionId = null;
        this.engine.submitAnswer(false);
      }, 2200);
    }
  }

  restartGame(): void {
    this.feedbackType = null;
    this.selectedOptionId = null;
    this.engine.resetGame();
  }

  leaveRoom(): void {
    if (confirm('Tem certeza que deseja sair da sala? Seu progresso nesta fase será interrompido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
