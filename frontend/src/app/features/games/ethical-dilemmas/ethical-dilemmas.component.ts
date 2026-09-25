import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthicalDilemmasEngineService, TapTask, Drag2Task, Drag3Task, Task } from './engine/ethical-dilemmas-engine.service';

@Component({
  selector: 'app-ethical-dilemmas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ethical-dilemmas.component.html',
  styleUrls: ['./ethical-dilemmas.component.scss']
})
export class EthicalDilemmasComponent implements OnInit {
  draggedItem: any = null;

  constructor(public engine: EthicalDilemmasEngineService) {}

  ngOnInit() {
    this.engine.initGame();
  }

  get currentModule() {
    return this.engine.modules[this.engine.state.moduleIndex];
  }

  handleTap(correct: boolean) {
    this.engine.processAnswer(correct);
  }

  onDragStart(event: DragEvent, item: string) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', item);
      event.dataTransfer.effectAllowed = 'move';
    }
    this.draggedItem = item;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, zoneIndex: number) {
    event.preventDefault();
    const task = this.engine.currentTask;
    if (task && (task.type === 'drag-2' || task.type === 'drag-3')) {
      const correct = zoneIndex === (task as any).correctZone;
      this.engine.processAnswer(correct);
    }
    this.draggedItem = null;
  }

  asTap(task: Task): TapTask {
    return task as TapTask;
  }
  
  getDragItem(task: Task): string {
    return (task as Drag2Task | Drag3Task).item;
  }

  getDragZones(task: Task): string[] {
    return (task as Drag2Task | Drag3Task).zones;
  }
  
  restart() {
    this.engine.resetGame();
    this.engine.initGame();
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
