import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordMysteryEngineService } from './engine/password-mystery-engine.service';

@Component({
  selector: 'app-password-mystery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-mystery.component.html',
  styleUrls: ['./password-mystery.component.scss']
})
/**
 * PasswordMysteryComponent
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class PasswordMysteryComponent {
  constructor(public engine: PasswordMysteryEngineService) {}
  
  draggedItemId: string | null = null;
  draggedItemPhase: 1 | 3 | null = null;

  onDragStart(event: DragEvent, itemId: string, phase: 1 | 3) {
    this.draggedItemId = itemId;
    this.draggedItemPhase = phase;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', itemId);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, target: 'safe' | 'risk', phase: 1 | 3) {
    event.preventDefault();
    if (this.draggedItemId && this.draggedItemPhase === phase) {
      this.engine.placeItem(phase, this.draggedItemId, target);
    }
    this.draggedItemId = null;
    this.draggedItemPhase = null;
  }
}
