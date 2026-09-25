import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserSearchEngineService, GameState } from './engine/browser-search-engine.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-browser-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browser-search.component.html',
  styleUrls: ['./browser-search.component.scss']
})
export class BrowserSearchComponent implements OnInit, OnDestroy {
  gameState: GameState | null = null;
  private destroy$ = new Subject<void>();
  
  draggedItemId: string | null = null;

  constructor(public engine: BrowserSearchEngineService) {}

  ngOnInit() {
    this.engine.state$.pipe(takeUntil(this.destroy$)).subscribe(state => {
      this.gameState = state;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTapOption(optionId: string) {
    if (!this.gameState?.currentTask) return;
    const task = this.gameState.currentTask;
    if (task.type === 'tap') {
      const isCorrect = optionId === task.correctOptionId;
      this.engine.submitAnswer(isCorrect);
    }
  }

  onDragStart(event: DragEvent, itemId: string) {
    this.draggedItemId = itemId;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', itemId);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Necessary to allow dropping
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, dropZoneId: string, acceptsId: string) {
    event.preventDefault();
    const itemId = event.dataTransfer?.getData('text/plain') || this.draggedItemId;
    if (!itemId || !this.gameState?.currentTask) return;

    // Check if the drop zone accepts this item
    const isCorrect = acceptsId === itemId;
    this.engine.submitAnswer(isCorrect);
    this.draggedItemId = null;
  }

  retry() {
    this.engine.retryModule();
  }

  reset() {
    this.engine.resetGame();
  }

  getModuleTitle(moduleIndex: number): string {
    const titles = [
      '1: Palavras-chave',
      '2: Menos é Mais',
      '3: Fontes Confiáveis',
      '4: Busca Exata',
      '5: O Investigador'
    ];
    return titles[moduleIndex] || '';
  }
}
