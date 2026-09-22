import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProfessionsEngineService } from '../../engine/professions-engine.service';
import { Phase3Item } from '../../content/models';

@Component({
  selector: 'app-drag-drop',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './drag-drop.component.html'
})
export class DragDropComponent {
  constructor(public engine: ProfessionsEngineService) {}
  get state() { return this.engine.stateValue; }
  get phase3Data() { return this.engine.phase3Data; }

  drop(event: CdkDragDrop<Phase3Item[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    
    // Notify engine about the layout change
    this.engine.updateDragState(
      this.state.unassignedItems,
      this.state.workColumn,
      this.state.studyColumn,
      this.state.leisureColumn
    );
  }
}
