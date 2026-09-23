import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressReporter } from '../../../core/services/progress-reporter.service';
import { FutureFairEngineService } from './engine/future-fair-engine.service';

interface PanelItem {
  type: string;
  x: number;
  y: number;
  text?: string;
}

interface Panel {
  items: PanelItem[];
}

@Component({
  selector: 'app-future-fair',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './future-fair.component.html',
  styleUrls: ['./future-fair.component.scss']
})
/**
 * FutureFairComponent
 * Responsável por gerenciar a lógica principal ou estado do jogo educacional.
 * Integrado com a plataforma via ProgressReporter.
 */
export class FutureFairComponent {
  charPlaced = false;
  speechText = '';
  propPlaced = false;
  
  panels: Panel[] = [
    { items: [] },
    { items: [] },
    { items: [] },
    { items: [] }
  ];
  
  draggedItem: string | null = null;

  constructor(
    public engine: FutureFairEngineService,
    private progress: ProgressReporter
  ) {}

  completePhase(isLastLevel: boolean) {
    this.progress.report({
      levelId: `fase-${this.engine.fase}`,
      fase: this.engine.fase,
      result: 'success',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: isLastLevel
    });
    if (!isLastLevel) {
      this.engine.fase++;
    }
  }

  reportMistake() {
    this.progress.report({
      levelId: `fase-${this.engine.fase}`,
      fase: this.engine.fase,
      result: 'failure',
      attempts: 1,
      timestamp: new Date().toISOString(),
      isLastLevel: false
    });
  }

  onDragStart(event: DragEvent, itemType: string) {
    this.draggedItem = itemType;
    event.dataTransfer?.setData('text/plain', itemType);
  }

  onDropP0(event: DragEvent) {
    event.preventDefault();
    if (this.draggedItem === 'character') {
      this.charPlaced = true;
      setTimeout(() => this.completePhase(false), 500);
    } else {
      this.reportMistake();
    }
  }
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  checkSpeech() {
    if (this.speechText.trim().length >= 3) {
      this.completePhase(false);
    } else {
      this.reportMistake();
      alert('Digite pelo menos 3 caracteres!');
    }
  }

  onDropP2(event: DragEvent) {
    event.preventDefault();
    if (this.draggedItem === 'prop') {
      this.propPlaced = true;
      setTimeout(() => this.completePhase(false), 500);
    } else {
      this.reportMistake();
    }
  }

  onDropP3(event: DragEvent, panelIndex: number) {
    event.preventDefault();
    const type = event.dataTransfer?.getData('text/plain') || this.draggedItem;
    if (type) {
      const target = event.currentTarget as HTMLElement;
      const panelRect = target.getBoundingClientRect();
      const x = event.clientX - panelRect.left - 25;
      const y = event.clientY - panelRect.top - 25;
      this.panels[panelIndex].items.push({ type, x, y, text: '' });
    }
  }

  publishHQ() {
    this.completePhase(true);
    alert('HQ Publicada com sucesso! Parabéns!');
  }
}
