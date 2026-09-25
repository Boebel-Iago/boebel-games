import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechInvestigatorsEngineService, GameState, TaskOption, DropZone } from './engine/tech-investigators-engine.service';

@Component({
  selector: 'app-tech-investigators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-investigators.component.html',
})
export class TechInvestigatorsComponent implements OnInit {
  state!: GameState;
  
  // Module 1 & 4
  tapOptions: TaskOption[] = [];
  
  // Module 2
  scene: string = '';
  dragOptions: TaskOption[] = [];
  correctOptionId: string = '';
  
  // Module 3 & 5
  dragItem: string = '';
  dropZones: DropZone[] = [];
  correctZoneId: string = '';

  draggedItemId: string | null = null;
  draggedItemEmoji: string | null = null;

  constructor(public engine: TechInvestigatorsEngineService) {}

  ngOnInit(): void {
    this.updateState();
  }

  updateState(): void {
    this.state = this.engine.getState();
    this.setupTask();
  }

  setupTask(): void {
    this.draggedItemId = null;
    this.draggedItemEmoji = null;
    
    switch (this.state.modulo) {
      case 0:
        const mod1 = this.engine.generateModule1Task();
        this.tapOptions = mod1.options;
        break;
      case 1:
        const mod2 = this.engine.generateModule2Task();
        this.scene = mod2.scene;
        this.dragOptions = mod2.options;
        this.correctOptionId = mod2.correctOptionId;
        break;
      case 2:
        const mod3 = this.engine.generateModule3Task();
        this.dragItem = mod3.item;
        this.dropZones = mod3.zones;
        this.correctZoneId = mod3.correctZoneId;
        break;
      case 3:
        const mod4 = this.engine.generateModule4Task();
        this.tapOptions = mod4.options;
        break;
      case 4:
        const mod5 = this.engine.generateModule5Task();
        this.dragItem = mod5.item;
        this.dropZones = mod5.zones;
        this.correctZoneId = mod5.correctZoneId;
        break;
    }
  }

  get vidasArray(): any[] {
    return new Array(this.state.vidas);
  }

  get perdidasArray(): any[] {
    return new Array(3 - this.state.vidas);
  }

  onTapOption(option: TaskOption): void {
    if (option.isCorrect) {
      this.engine.handleSuccess();
    } else {
      this.engine.handleFailure();
    }
    this.updateState();
  }

  // HTML5 Drag and Drop Handlers
  onDragStart(event: DragEvent, id: string, emoji: string): void {
    this.draggedItemId = id;
    this.draggedItemEmoji = emoji;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDropToScene(event: DragEvent): void {
    event.preventDefault();
    if (this.draggedItemId) {
      if (this.draggedItemId === this.correctOptionId) {
        this.engine.handleSuccess();
      } else {
        this.engine.handleFailure();
      }
      this.updateState();
    }
  }

  onDropToZone(event: DragEvent, zoneId: string): void {
    event.preventDefault();
    if (this.draggedItemEmoji === this.dragItem) {
      if (zoneId === this.correctZoneId) {
        this.engine.handleSuccess();
      } else {
        this.engine.handleFailure();
      }
      this.updateState();
    }
  }
}
