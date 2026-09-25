import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutomationRoboticsEngineService } from './engine/automation-robotics-engine.service';

@Component({
  selector: 'app-automation-robotics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './automation-robotics.component.html',
  styleUrls: ['./automation-robotics.component.scss']
})
/**
 * AutomationRoboticsComponent
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class AutomationRoboticsComponent implements OnInit {
  state$ = this.engine.state$;
  draggedTaskId: string | null = null;

  constructor(public engine: AutomationRoboticsEngineService) {}

  ngOnInit(): void {}

  onDragStart(event: DragEvent, taskId: string) {
    this.draggedTaskId = taskId;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', taskId);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDropPhase0(event: DragEvent) {
    event.preventDefault();
    if (this.draggedTaskId) {
      this.engine.dropPhase0(this.draggedTaskId);
      this.draggedTaskId = null;
    }
  }

  onDropPhase1(event: DragEvent) {
    event.preventDefault();
    if (this.draggedTaskId) {
      this.engine.dropPhase1(this.draggedTaskId);
      this.draggedTaskId = null;
    }
  }

  onDropPhase2(event: DragEvent, targetBox: 'robot' | 'human') {
    event.preventDefault();
    if (this.draggedTaskId) {
      this.engine.dropPhase2(this.draggedTaskId, targetBox);
      this.draggedTaskId = null;
    }
  }

  answerPhase3(type: 'robot' | 'human') {
    this.engine.answerPhase3(type);
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
