import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CreatorsEngineService } from '../../engine/creators-engine.service';
import { DragDropItem } from '../../content/models';

@Component({
  selector: 'app-creators-drag-drop',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './drag-drop.component.html'
})
export class DragDropComponent {
  constructor(public engine: CreatorsEngineService) {}
  get state() { return this.engine.stateValue; }
  get dragDropData() { return this.engine.dragDropData; }

  drop(event: CdkDragDrop<DragDropItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    
    this.engine.updateDragState(
      this.state.unassignedItems,
      this.state.freeCol,
      this.state.creditsCol,
      this.state.plagiarismCol
    );
  }

  leaveRoom() {
    if (confirm('Tem certeza que deseja sair? Seu progresso desta fase será perdido.')) {
      sessionStorage.clear();
      window.location.href = '/';
    }
  }
}
