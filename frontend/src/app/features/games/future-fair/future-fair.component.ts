import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FutureFairEngineService, Task } from './engine/future-fair-engine.service';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';

@Component({
  selector: 'app-future-fair',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './future-fair.component.html',
  styleUrls: ['./future-fair.component.scss']
})
export class FutureFairComponent {
  draggedItem: any = null;

  constructor(
    public engine: FutureFairEngineService,
    private progress: ProgressReporter
  ) {}

  get currentTask(): Task | null {
    return this.engine.getCurrentTask();
  }

  get heartsArray(): number[] {
    return Array(this.engine.state.hearts).fill(0);
  }
  
  get lostHeartsArray(): number[] {
    return Array(3 - this.engine.state.hearts).fill(0);
  }

  onTapOption(optionId: string) {
    if (!this.currentTask || this.currentTask.type !== 'tap') return;
    this.handleAnswer(optionId);
  }

  onDragStart(event: DragEvent, item: any) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', item.id);
      event.dataTransfer.effectAllowed = 'move';
      this.draggedItem = item;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Necessary to allow dropping
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, zoneId: string) {
    event.preventDefault();
    if (!this.draggedItem) return;
    this.handleAnswer(zoneId);
    this.draggedItem = null;
  }

  handleAnswer(selectedId: string) {
    const isCorrect = this.engine.processAnswer(selectedId);
    const globalTaskNumber = ((this.engine.state.module - 1) * 10) + this.engine.state.taskIndex + 1;
    const isLastLevel = globalTaskNumber === 50;

    if (isCorrect) {
      this.progress.report({
        levelId: `future-fair-m${this.engine.state.module}-t${this.engine.state.taskIndex + 1}`,
        fase: globalTaskNumber - 1,
        result: 'success',
        attempts: 1,
        timestamp: new Date().toISOString(),
        isLastLevel: isLastLevel
      });

      const isGameOver = this.engine.advanceTask();
      if (isGameOver) {
        this.engine.clearState();
      }
    } else {
      this.progress.report({
        levelId: `future-fair-m${this.engine.state.module}-t${this.engine.state.taskIndex + 1}`,
        fase: globalTaskNumber - 1,
        result: 'failure',
        attempts: 1,
        timestamp: new Date().toISOString(),
        isLastLevel: false
      });

      if (this.engine.state.hearts <= 0) {
        alert('Você perdeu todos os corações! O módulo será reiniciado.');
        this.engine.resetModule();
      } else {
        alert('Ops, resposta errada! Você perdeu 1 coração.');
      }
    }
  }

  resetGame() {
    this.engine.resetState();
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
