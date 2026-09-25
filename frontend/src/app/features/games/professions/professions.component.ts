import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';
import { ProfessionsEngineService, Task } from './engine/professions-engine.service';

@Component({
  selector: 'app-professions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professions.component.html',
  styleUrls: ['./professions.component.scss']
})
export class ProfessionsComponent implements OnInit {
  currentTask: Task | null = null;
  feedback: 'correct' | 'wrong' | null = null;
  draggedItem: string | null = null;

  constructor(
    public engine: ProfessionsEngineService,
    private progress: ProgressReporter
  ) {}

  ngOnInit() {
    this.loadCurrentTask();
  }

  loadCurrentTask() {
    this.currentTask = this.engine.getCurrentTask();
    this.feedback = null;
    this.draggedItem = null;
  }

  get currentModuleTitle(): string {
    return this.engine.modules[this.engine.state.fase]?.title || 'Concluído!';
  }

  // Tap interactions
  selectOption(option: string) {
    if (this.feedback || !this.currentTask || this.currentTask.type !== 'tap') return;
    this.processAnswer(option);
  }

  // Drag & Drop interactions
  onDragStart(event: DragEvent, item: string) {
    this.draggedItem = item;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', item);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, zone: string) {
    event.preventDefault();
    if (this.feedback || !this.draggedItem) return;
    
    // Check if the current task is drag or drag-3
    if (this.currentTask && (this.currentTask.type === 'drag' || this.currentTask.type === 'drag-3')) {
       // Since the user is asked to drag TO a profession/zone, we match the zone against correct answer.
       // However, in our engine, for 'drag' the correct option is the one to drop IN.
       // Wait, if it's "drag camera to Fotógrafo", zone = "Fotógrafo", item = "Camera DSLR".
       // The correct is "Fotógrafo". Let's check it.
       this.processAnswer(zone);
    }
    this.draggedItem = null;
  }

  processAnswer(answer: string) {
    const isCorrect = this.engine.checkAnswer(answer);
    
    if (isCorrect) {
      this.feedback = 'correct';
    } else {
      this.feedback = 'wrong';
      this.progress.report({
        levelId: `fase-${this.engine.state.fase}`,
        fase: this.engine.state.fase,
        result: 'failure',
        attempts: 1,
        timestamp: new Date().toISOString(),
        isLastLevel: false
      });

      if (this.engine.state.hearts <= 0) {
         setTimeout(() => {
           alert('Sem corações! Reiniciando o módulo...');
           this.engine.restartModule();
           this.loadCurrentTask();
         }, 1500);
      }
    }
  }

  next() {
    if (this.feedback !== 'correct') {
       this.feedback = null;
       return;
    }

    const stateResult = this.engine.nextTask();
    
    if (stateResult === 'next-module' || stateResult === 'finished') {
       // Just finished a module (phase)
       const finishedFase = this.engine.state.fase - 1; // Since it increments
       const isLast = stateResult === 'finished';
       this.progress.report({
          levelId: `fase-${finishedFase}`,
          fase: finishedFase,
          result: 'success',
          attempts: 1,
          timestamp: new Date().toISOString(),
          isLastLevel: isLast
       });
    }

    this.loadCurrentTask();
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}