import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactCheckerEngineService } from './engine/fact-checker-engine.service';

@Component({
  selector: 'app-fact-checker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fact-checker.component.html',
  styleUrls: ['./fact-checker.component.scss']
})
export class FactCheckerComponent {
  public engine = inject(FactCheckerEngineService);

  public state = computed(() => this.engine.state());
  public currentTask = computed(() => {
    const st = this.state();
    if (st.currentTasks && st.currentTasks.length > 0 && st.taskIndex < st.currentTasks.length) {
      return st.currentTasks[st.taskIndex];
    }
    return null;
  });

  public feedback: { message: string; type: 'success' | 'error' } | null = null;

  public moduleTitles = [
    'Módulo 1: Verdade ou Mentira',
    'Módulo 2: Título Sensacionalista',
    'Módulo 3: A Fonte',
    'Módulo 4: A Data Importa',
    'Módulo 5: O Grande Checador'
  ];

  public handleTapAnswer(answer: string) {
    this.processAnswer(answer);
  }

  public allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  public drag(event: DragEvent, content: string) {
    event.dataTransfer?.setData('text/plain', content);
  }

  public drop(event: DragEvent, zoneId: string) {
    event.preventDefault();
    this.processAnswer(zoneId);
  }

  private processAnswer(answer: string) {
    const t = this.currentTask();
    if (!t) return;
    
    const isCorrect = this.engine.submitAnswer(answer);
    if (isCorrect) {
      this.feedback = { message: 'Correto! ' + t.explanation, type: 'success' };
    } else {
      this.feedback = { message: 'Incorreto! ' + t.explanation, type: 'error' };
    }

    setTimeout(() => {
      this.feedback = null;
    }, 2500);
  }

  public restartModule() {
    this.feedback = null;
    this.engine.restartModule();
  }

  public restartGame() {
    this.feedback = null;
    this.engine.resetGame();
  }
}
