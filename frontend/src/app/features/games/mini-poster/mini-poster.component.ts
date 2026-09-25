import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiniPosterEngineService } from './engine/mini-poster-engine.service';

@Component({
  selector: 'app-mini-poster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-poster.component.html'
})
export class MiniPosterComponent {
  draggedItem: 'image' | 'title' | null = null;
  m5PlacedTitle = false;
  m5PlacedImage = false;

  constructor(public engine: MiniPosterEngineService) {}

  get state() { return this.engine.state; }
  get currentTask() { return this.state.tasks[this.state.taskIndex]; }

  onDragStart(event: DragEvent, type: 'image' | 'title') {
    this.draggedItem = type;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, zone: 'image' | 'title') {
    event.preventDefault();
    if (!this.draggedItem) return;

    if (this.state.modulo === 0) {
      if (this.draggedItem === 'image') {
        if (zone === 'image') {
          this.engine.completeTask();
        } else {
          this.engine.reportMistake();
        }
      }
    } else if (this.state.modulo === 4) {
       if (this.draggedItem === zone) {
         if (zone === 'image') this.m5PlacedImage = true;
         if (zone === 'title') this.m5PlacedTitle = true;
         
         if (this.m5PlacedImage && this.m5PlacedTitle) {
           this.m5PlacedImage = false;
           this.m5PlacedTitle = false;
           this.engine.completeTask();
         }
       } else {
         this.m5PlacedImage = false;
         this.m5PlacedTitle = false;
         this.engine.reportMistake();
       }
    }
    this.draggedItem = null;
  }

  checkM2(option: string) {
    if (option === this.currentTask.correct) {
      this.engine.completeTask();
    } else {
      this.engine.reportMistake();
    }
  }

  checkM3(align: string) {
    if (align === this.currentTask.target) {
      this.engine.completeTask();
    } else {
      this.engine.reportMistake();
    }
  }

  checkM4(option: string) {
    if (option === this.currentTask.correct) {
      this.engine.completeTask();
    } else {
      this.engine.reportMistake();
    }
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
